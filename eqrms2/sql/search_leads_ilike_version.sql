-- ILIKE version of search_leads_new_login function
-- This version uses ILIKE instead of pg_trgm similarity for better compatibility
-- Run this in your Supabase SQL editor to create the ILIKE version

CREATE OR REPLACE FUNCTION public.search_leads_new_login_ilike(
  p_phone text DEFAULT NULL,   -- E.164 or any phone-ish string
  p_name  text DEFAULT NULL,   -- partial name search
  p_limit int  DEFAULT 20
)
RETURNS TABLE (
  lead_id         bigint,
  lead_name       text,
  phone_e164      text,
  primary_rm_uuid uuid,
  name_score      real,
  phone_exact     boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  claims           jsonb;
  v_phone_raw      text;
  v_phone_digits   text;
  v_name_raw       text;
BEGIN
  -- Extract JWT claims safely
  claims := nullif(current_setting('request.jwt.claims', true), '')::jsonb;

  -- Require user_roles array to include "inv_desk"
  IF claims IS NULL OR NOT ((claims->'user_roles') @> '["inv_desk"]'::jsonb) THEN
    RAISE EXCEPTION 'not authorized: inv_desk role required' USING ERRCODE = '28000';
  END IF;

  -- Normalize inputs
  v_phone_raw    := NULLIF(p_phone, '');
  v_phone_digits := regexp_replace(NULLIF(p_phone, ''), '\D', '', 'g');
  v_name_raw     := NULLIF(p_name, '');

  RETURN QUERY
  WITH params AS (
    SELECT v_phone_raw AS p_phone_raw,
           v_phone_digits AS p_phone_digits,
           v_name_raw AS p_name_raw
  )
  SELECT
    lt.lead_id,
    lt.lead_name,
    lt.phone_e164,
    lt.primary_rm_uuid,
    -- Use a simple scoring system based on ILIKE matches
    CASE
      WHEN params.p_name_raw IS NULL THEN NULL
      WHEN lt.lead_name ILIKE params.p_name_raw THEN 1.0  -- Exact match
      WHEN lt.lead_name ILIKE '%' || params.p_name_raw || '%' THEN 0.8  -- Contains
      ELSE 0.0
    END AS name_score,
    (
      params.p_phone_raw IS NOT NULL AND (
        lt.phone_e164 = params.p_phone_raw OR
        regexp_replace(lt.phone_e164, '\D', '', 'g') = params.p_phone_digits
      )
    ) AS phone_exact
  FROM public.leads_tagging lt, params
  WHERE
    -- Phone filter (optional)
    (
      params.p_phone_raw IS NULL
      OR regexp_replace(lt.phone_e164, '\D', '', 'g') = params.p_phone_digits
      OR lt.phone_e164 = params.p_phone_raw
    )
    AND
    -- Name ILIKE filter (optional)
    (
      params.p_name_raw IS NULL
      OR lt.lead_name ILIKE '%' || params.p_name_raw || '%'
    )
  ORDER BY
    phone_exact DESC,
    name_score DESC NULLS LAST
  LIMIT COALESCE(p_limit, 20);
END;
$$;

-- Grant execute permissions
REVOKE ALL ON FUNCTION public.search_leads_new_login_ilike(text, text, int) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.search_leads_new_login_ilike(text, text, int) TO authenticated;
