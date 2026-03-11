-- Supabase function to search login profiles by phone and/or name
-- Queries v_login_profile_with_roles so all joined fields (role, group, RM, mandate) are included
-- Same auth and param rules as search_leads_flexible
DROP FUNCTION IF EXISTS public.search_login(text, text, integer);

CREATE OR REPLACE FUNCTION public.search_login(
  p_phone text DEFAULT NULL,
  p_name text DEFAULT NULL,
  p_limit integer DEFAULT 20
)
RETURNS TABLE(
  -- login_profile base columns
  uuid uuid,
  lead_name text,
  phone_number text,
  email text,
  first_name text,
  last_name text,
  lead_id bigint,
  group_id integer,
  created_at timestamp with time zone,
  affiliate_lead_id bigint,
  affiliate_ref_meta jsonb,
  user_role_name_id bigint,
  expires_on date,
  client_confirmation boolean,
  finacial_pdts_invested_in text[],
  existing_advisor boolean,
  existing_financial_plan boolean,
  existing_inv_mandate boolean,
  net_worth text,
  hear_ime_capital text,
  inv_desk_notes text,
  internal_notes text,
  -- joined columns from v_login_profile_with_roles
  crm_lead_name text,
  group_name text,
  mandate_id integer,
  mandate_name text,
  rm_name text,
  user_role_name text
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

  -- Require user_roles to be either inv_desk or admin
  IF claims IS NULL OR NOT (
    ((claims->'user_roles') @> '"inv_desk"'::jsonb) OR
    ((claims->'user_roles') @> '"admin"'::jsonb)
  ) THEN
    RAISE EXCEPTION 'not authorized: inv_desk or admin role required' USING ERRCODE = '28000';
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
    lp.uuid,
    lp.lead_name,
    lp.phone_number,
    lp.email,
    lp.first_name,
    lp.last_name,
    lp.lead_id,
    lp.group_id,
    lp.created_at,
    lp.affiliate_lead_id,
    lp.affiliate_ref_meta,
    lp.user_role_name_id,
    lp.expires_on,
    lp.client_confirmation,
    lp.finacial_pdts_invested_in,
    lp.existing_advisor,
    lp.existing_financial_plan,
    lp.existing_inv_mandate,
    lp.net_worth,
    lp.hear_ime_capital,
    lp.inv_desk_notes,
    lp.internal_notes,
    lp.crm_lead_name,
    lp.group_name,
    lp.mandate_id,
    lp.mandate_name,
    lp.rm_name,
    lp.user_role_name
  FROM public.v_login_profile_with_roles lp, params
  WHERE
    -- Phone filter (optional)
    (
      params.p_phone_raw IS NULL
      OR regexp_replace(COALESCE(lp.phone_number, ''), '\D', '', 'g') = params.p_phone_digits
      OR lp.phone_number = params.p_phone_raw
    )
    AND
    -- Name similarity filter (optional)
    (
      params.p_name_raw IS NULL
      OR similarity(COALESCE(lp.lead_name, '')::text, params.p_name_raw::text) > 0.2
    )
  ORDER BY
    (params.p_phone_raw IS NOT NULL AND (
      lp.phone_number = params.p_phone_raw OR
      regexp_replace(COALESCE(lp.phone_number, ''), '\D', '', 'g') = params.p_phone_digits
    )) DESC,
    (CASE
      WHEN params.p_name_raw IS NULL THEN NULL
      ELSE similarity(COALESCE(lp.lead_name, '')::text, params.p_name_raw::text)
    END) DESC NULLS LAST
  LIMIT COALESCE(p_limit, 20);
END;
$$;

-- Optional: restrict and grant (adjust role names if needed)
-- REVOKE ALL ON FUNCTION public.search_login(text, text, integer) FROM PUBLIC;
-- GRANT EXECUTE ON FUNCTION public.search_login(text, text, integer) TO authenticated;
