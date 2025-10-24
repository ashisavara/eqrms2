-- Updated Supabase function for flexible lead search
-- This function allows searching by either phone OR name (not requiring both)
-- Security definer to bypass RLS for inv_desk role

CREATE OR REPLACE FUNCTION search_leads_flexible(
  p_phone text DEFAULT NULL,
  p_name text DEFAULT NULL,
  p_limit integer DEFAULT 20
)
RETURNS TABLE(
  lead_id text,
  lead_name text,
  lead_progression text,
  lead_source text,
  phone_e164 text,
  login_name text,
  rm_name text,
  name_score real,
  phone_exact boolean
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

  -- Validate that at least one search parameter is provided
  IF (p_phone IS NULL OR p_phone = '') AND (p_name IS NULL OR p_name = '') THEN
    RAISE EXCEPTION 'At least one search parameter (phone or name) must be provided' USING ERRCODE = '22023';
  END IF;

  -- Normalize inputs
  v_phone_raw    := NULLIF(p_phone, '');
  v_phone_digits := CASE 
    WHEN v_phone_raw IS NOT NULL 
    THEN regexp_replace(v_phone_raw, '\D', '', 'g')
    ELSE NULL 
  END;
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
    lt.lead_progression,
    lt.lead_source,
    lt.phone_e164,
    lt.login_name,
    lt.rm_name,
    CASE
      WHEN params.p_name_raw IS NULL THEN NULL
      ELSE similarity(lt.lead_name::text, params.p_name_raw::text)
    END AS name_score,
    (
      params.p_phone_raw IS NOT NULL AND (
        lt.phone_e164 = params.p_phone_raw OR
        regexp_replace(lt.phone_e164, '\D', '', 'g') = params.p_phone_digits
      )
    ) AS phone_exact
  FROM public.view_leads_tagcrm lt, params
  WHERE
    -- Phone filter (optional)
    (
      params.p_phone_raw IS NULL
      OR regexp_replace(lt.phone_e164, '\D', '', 'g') = params.p_phone_digits
      OR lt.phone_e164 = params.p_phone_raw
    )
    AND
    -- Name similarity filter (optional)
    (
      params.p_name_raw IS NULL
      OR similarity(lt.lead_name::text, params.p_name_raw::text) > 0.2
    )
  ORDER BY
    phone_exact DESC,
    name_score DESC NULLS LAST
  LIMIT COALESCE(p_limit, 20);
END;
$$;
