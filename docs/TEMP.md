create or replace function public.rpc_create_group_on_login_form_validation(
  p_uuid uuid,
  p_lead_name text
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_group_id integer;
  v_base_name text;
  v_final_name text;
  v_suffix text;
  v_attempt int := 0;
  v_existing_group_id integer;
begin
  -- Validate inputs
  if p_uuid is null then
    raise exception 'p_uuid cannot be null';
  end if;

  v_base_name := nullif(trim(p_lead_name), '');
  if v_base_name is null then
    raise exception 'p_lead_name cannot be empty';
  end if;

  -- Ensure user is authenticated (allows team members to submit on behalf of users)
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  -- Check login_profile exists and has no existing group (single query for both checks)
  select lp.group_id into v_existing_group_id
  from public.login_profile lp
  where lp.uuid = p_uuid;

  if not found then
    raise exception 'No login_profile row found for uuid=%', p_uuid;
  end if;

  if v_existing_group_id is not null then
    raise exception 'Group already exists for this user';
  end if;


  -- Create client_group with unique group_name (retry on unique violation)
  v_final_name := v_base_name;

  loop
    begin
      insert into public.client_group (
        group_name
      )
      values (
        v_final_name
      )
      returning client_group.group_id
      into v_group_id;

      exit; -- success
    exception
      when unique_violation then
        v_attempt := v_attempt + 1;
        if v_attempt > 10 then
          raise exception 'Could not generate a unique group_name after % attempts for base "%"', v_attempt, v_base_name;
        end if;

        -- Random 3-letter suffix: ABC..XYZ
        v_suffix :=
          chr(65 + floor(random() * 26)::int) ||
          chr(65 + floor(random() * 26)::int) ||
          chr(65 + floor(random() * 26)::int);

        v_final_name := v_base_name || '-' || v_suffix;
    end;
  end loop;

  -- Update login_profile with the new group_id (primary link between user and group)
  update public.login_profile
    set group_id = v_group_id
  where uuid = p_uuid;

  -- Create group investor linked to this group_id
  -- Use original p_lead_name (not the final name with suffix) for investor_name
  insert into public.group_investors (
    group_id,
    investor_name
  )
  values (
    v_group_id,
    v_base_name
  );

  -- Return final group name
  return v_final_name;
end;
$$;

grant execute on function public.rpc_create_group_on_login_form_validation(uuid, text) to authenticated;
