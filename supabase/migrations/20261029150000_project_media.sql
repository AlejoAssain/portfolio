begin;

-- Ordered JSON keeps the gallery and project in the same atomic write.
create function public.valid_project_screenshots(images jsonb) returns boolean
language plpgsql immutable set search_path = '' as $$
declare item jsonb;
begin
  if images is null then return true; end if;
  if jsonb_typeof(images) <> 'array' then return false; end if;
  if jsonb_array_length(images) > 6 then return false; end if;
  if jsonb_array_length(images) > 0 and (
    select count(*) from jsonb_array_elements(images) i where i->'cover' = 'true'::jsonb
  ) <> 1 then return false; end if;
  if (select count(distinct i->>'id') from jsonb_array_elements(images) i)
      <> jsonb_array_length(images) then return false; end if;
  for item in select * from jsonb_array_elements(images) loop
    if jsonb_typeof(item) <> 'object'
      or coalesce(item->>'id', '') = ''
      or coalesce(item->>'url', '') !~ '^https?://[^[:space:]]+$'
      or coalesce(jsonb_typeof(item->'cover'), '') <> 'boolean'
      or coalesce(jsonb_typeof(item->'alt'), '') <> 'object'
      or coalesce(jsonb_typeof(item->'alt'->'en'), '') <> 'string'
      or coalesce(btrim(item->'alt'->>'en'), '') = ''
      or (item->'alt' ? 'es' and jsonb_typeof(item->'alt'->'es') <> 'string')
    then return false; end if;
  end loop;
  return true;
end;
$$;

alter table public.projects add column screenshots jsonb default null
  constraint projects_valid_screenshots check (public.valid_project_screenshots(screenshots));
alter table public.experiences add column video_url text
  constraint experiences_valid_video check (
    video_url is null or video_url ~ '^https://www\.youtube\.com/watch\?v=[A-Za-z0-9_-]{11}$'
  );

-- Existing RPCs remain available for older clients; wrappers share their transaction.
create function public.save_project_with_media(
  p_existing_id text, p_id text, p_display_order integer, p_title jsonb,
  p_description jsonb, p_github text, p_demo text, p_landing text,
  p_image text, p_featured boolean, p_skill_ids text[], p_screenshots jsonb
) returns void language plpgsql set search_path = '' as $$
begin
  if not public.is_admin() then
    raise exception 'Admin access required' using errcode = '42501';
  end if;
  if p_screenshots is null or not public.valid_project_screenshots(p_screenshots) then
    raise exception 'Invalid screenshots';
  end if;
  perform public.save_project_with_skills(
    p_existing_id, p_id, p_display_order, p_title, p_description,
    p_github, p_demo, p_landing, p_image, p_featured, p_skill_ids
  );
  update public.projects set screenshots = p_screenshots where id = p_id;
end;
$$;
revoke all on function public.save_project_with_media(
  text, text, integer, jsonb, jsonb, text, text, text, text, boolean, text[], jsonb
) from public;
grant execute on function public.save_project_with_media(
  text, text, integer, jsonb, jsonb, text, text, text, text, boolean, text[], jsonb
) to authenticated;

create function public.save_experience_with_video(
  p_existing_id text, p_id text, p_display_order integer, p_role jsonb,
  p_company text, p_company_url text, p_period jsonb, p_location jsonb,
  p_description jsonb, p_skill_ids text[], p_video_url text
) returns void language plpgsql set search_path = '' as $$
begin
  if not public.is_admin() then
    raise exception 'Admin access required' using errcode = '42501';
  end if;
  perform public.save_experience_with_skills(
    p_existing_id, p_id, p_display_order, p_role, p_company,
    p_company_url, p_period, p_location, p_description, p_skill_ids
  );
  update public.experiences set video_url = p_video_url where id = p_id;
end;
$$;
revoke all on function public.save_experience_with_video(
  text, text, integer, jsonb, text, text, jsonb, jsonb, jsonb, text[], text
) from public;
grant execute on function public.save_experience_with_video(
  text, text, integer, jsonb, text, text, jsonb, jsonb, jsonb, text[], text
) to authenticated;

notify pgrst, 'reload schema';
commit;
