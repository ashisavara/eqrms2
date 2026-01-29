CREATE OR REPLACE FUNCTION public.link_login_to_lead(
  p_login_uuid uuid,
  p_lead_id    bigint
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  claims          jsonb;
  v_exists        boolean;
  v_lead_in_use   boolean;
  v_current_lead  bigint;
BEGIN
  -- Require inv_desk in JWT user_roles
  claims := nullif(current_setting('request.jwt.claims', true), '')::jsonb;
  IF claims IS NULL OR NOT ((claims->'user_roles') @> '["inv_desk"]'::jsonb) THEN
    RAISE EXCEPTION 'not authorized: inv_desk role required' USING ERRCODE = '28000';
  END IF;

  -- Validate login_profile exists
  SELECT true INTO v_exists
  FROM public.login_profile
  WHERE uuid = p_login_uuid;
  IF NOT v_exists THEN
    RAISE EXCEPTION 'login_profile % not found', p_login_uuid;
  END IF;

  -- Ensure login_profile is currently unlinked
  SELECT lead_id INTO v_current_lead
  FROM public.login_profile
  WHERE uuid = p_login_uuid;
  IF v_current_lead IS NOT NULL THEN
    RAISE EXCEPTION 'login_profile % is already linked to lead %', p_login_uuid, v_current_lead;
  END IF;

  -- Validate lead exists and fetch its group
  SELECT true INTO v_exists
  FROM public.leads_tagging
  WHERE lead_id = p_lead_id;
  IF NOT v_exists THEN
    RAISE EXCEPTION 'lead % not found', p_lead_id;
  END IF;

  -- Ensure the lead is not already linked elsewhere (1:1)
  SELECT EXISTS (
    SELECT 1 FROM public.login_profile WHERE lead_id = p_lead_id
  ) INTO v_lead_in_use;
  IF v_lead_in_use THEN
    RAISE EXCEPTION 'lead % is already linked to a login_profile', p_lead_id;
  END IF;

  -- Perform the link (set lead_id only; group_id is managed separately)
  UPDATE public.login_profile
  SET lead_id = p_lead_id
  WHERE uuid = p_login_uuid;

END;
$$;

-- Lock down who can call it (same as before)
REVOKE ALL ON FUNCTION public.link_login_to_lead(uuid, bigint) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.link_login_to_lead(uuid, bigint) TO authenticated;
