begin;

-- Video belongs to projects. Keep the already-applied experience column untouched.
alter table public.projects add column video_url text
  constraint projects_valid_video check (
    video_url is null or video_url ~ '^https://www\.youtube\.com/watch\?v=[A-Za-z0-9_-]{11}$'
  );

-- Retain the earlier RPC signatures for clients already using them.
create function public.save_project_with_video(
  p_existing_id text, p_id text, p_display_order integer, p_title jsonb,
  p_description jsonb, p_github text, p_demo text, p_landing text,
  p_image text, p_featured boolean, p_skill_ids text[], p_screenshots jsonb,
  p_video_url text
) returns void language plpgsql set search_path = '' as $$
begin
  if not public.is_admin() then
    raise exception 'Admin access required' using errcode = '42501';
  end if;
  perform public.save_project_with_media(
    p_existing_id, p_id, p_display_order, p_title, p_description,
    p_github, p_demo, p_landing, p_image, p_featured, p_skill_ids, p_screenshots
  );
  update public.projects set video_url = p_video_url where id = p_id;
end;
$$;
revoke all on function public.save_project_with_video(
  text, text, integer, jsonb, jsonb, text, text, text, text, boolean, text[], jsonb, text
) from public;
grant execute on function public.save_project_with_video(
  text, text, integer, jsonb, jsonb, text, text, text, text, boolean, text[], jsonb, text
) to authenticated;

notify pgrst, 'reload schema';
commit;
