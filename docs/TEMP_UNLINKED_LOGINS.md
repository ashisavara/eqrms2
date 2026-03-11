DROP FUNCTION search_leads_new_login(text,text,integer);
-- Search over leads_tagging for manual linking
CREATE OR REPLACE FUNCTION public.search_leads_new_login(
  p_phone text DEFAULT NULL,   -- E.164 or any phone-ish string
  p_name  text DEFAULT NULL,   -- partial / fuzzy name
  p_limit int  DEFAULT 20
)
RETURNS TABLE (
  lead_id         text,
  lead_name       text,
  phone_e164      text,
  primary_rm_uuid uuid,
  rm_name         text,
  name_score      real,
  phone_exact     boolean,
  match_reason    text
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
  IF claims IS NULL OR NOT ((claims->'user_roles') @> '"inv_desk"'::jsonb) THEN
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
    lt.lead_id::text,
    lt.lead_name,
    lt.phone_e164,
    lt.primary_rm_uuid,
    emp.name AS rm_name,
    CASE
      WHEN params.p_name_raw IS NULL THEN NULL
      ELSE similarity(lt.lead_name::text, params.p_name_raw::text)
    END AS name_score,
    (
      params.p_phone_raw IS NOT NULL AND (
        lt.phone_e164 = params.p_phone_raw OR
        regexp_replace(lt.phone_e164, '\D', '', 'g') = params.p_phone_digits
      )
    ) AS phone_exact,
    CASE
      -- Exact phone match
      WHEN params.p_phone_raw IS NOT NULL AND (
        lt.phone_e164 = params.p_phone_raw OR
        regexp_replace(lt.phone_e164, '\D', '', 'g') = params.p_phone_digits
      ) THEN 'Exact phone match'
      -- Exact name match
      WHEN params.p_name_raw IS NOT NULL AND 
           similarity(lt.lead_name::text, params.p_name_raw::text) >= 0.95 
      THEN 'Exact name match'
      -- High name similarity
      WHEN params.p_name_raw IS NOT NULL AND 
           similarity(lt.lead_name::text, params.p_name_raw::text) >= 0.8 
      THEN 'High name similarity'
      -- Good name match
      WHEN params.p_name_raw IS NOT NULL AND 
           similarity(lt.lead_name::text, params.p_name_raw::text) >= 0.6 
      THEN 'Good name match'
      -- Partial name match
      WHEN params.p_name_raw IS NOT NULL AND 
           similarity(lt.lead_name::text, params.p_name_raw::text) > 0.3 
      THEN 'Partial name match'
      ELSE 'Match found'
    END AS match_reason
  FROM public.leads_tagging lt
  CROSS JOIN params
  LEFT JOIN public.ime_emp emp ON lt.primary_rm_uuid = emp.auth_id
  WHERE
  -- Case 1: If phone is provided, require phone match OR very high name similarity
  (
    params.p_phone_raw IS NOT NULL 
    AND params.p_name_raw IS NOT NULL
    AND (
      -- Exact phone match (highest priority)
      (
        regexp_replace(lt.phone_e164, '\D', '', 'g') = params.p_phone_digits
        OR lt.phone_e164 = params.p_phone_raw
      )
      OR
      -- OR very high name match (when phone doesn't match)
      (
        similarity(lt.lead_name::text, params.p_name_raw::text) > 0.6
      )
    )
  )
  OR
  -- Case 2: Only phone provided
  (
    params.p_phone_raw IS NOT NULL 
    AND params.p_name_raw IS NULL
    AND (
      regexp_replace(lt.phone_e164, '\D', '', 'g') = params.p_phone_digits
      OR lt.phone_e164 = params.p_phone_raw
    )
  )
  OR
  -- Case 3: Only name provided
  (
    params.p_phone_raw IS NULL 
    AND params.p_name_raw IS NOT NULL
    AND similarity(lt.lead_name::text, params.p_name_raw::text) > 0.3
  )
  ORDER BY
    phone_exact DESC,
    name_score DESC NULLS LAST
  LIMIT COALESCE(p_limit, 20);
END;
$$;

-- Tighten EXECUTE permissions: callers use the standard 'authenticated' DB role.
REVOKE ALL ON FUNCTION public.search_leads_new_login(text, text, int) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.search_leads_new_login(text, text, int) TO authenticated;
