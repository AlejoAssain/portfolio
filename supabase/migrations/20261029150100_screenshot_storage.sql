begin;

-- Accept the bucket created through the dashboard only with the reviewed settings.
do $$
begin
  if exists (select 1 from storage.buckets where id = 'project-screenshots') then
    if not exists (
      select 1 from storage.buckets where id = 'project-screenshots'
        and public = true and file_size_limit = 2097152
        and allowed_mime_types @> array['image/png', 'image/jpeg', 'image/webp']
        and allowed_mime_types <@ array['image/png', 'image/jpeg', 'image/webp']
    ) then
      raise exception 'Review project-screenshots bucket settings before continuing';
    end if;
  else
    insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    values ('project-screenshots', 'project-screenshots', true, 2097152,
      array['image/png', 'image/jpeg', 'image/webp']);
  end if;
end;
$$;

-- Public buckets serve downloads without SELECT; listing stays admin-only.
create policy "Admins list project screenshots"
on storage.objects for select to authenticated
using (bucket_id = 'project-screenshots' and (select public.is_admin()));

create policy "Admins upload project screenshots"
on storage.objects for insert to authenticated
with check (bucket_id = 'project-screenshots' and (select public.is_admin()));

create policy "Admins update project screenshots"
on storage.objects for update to authenticated
using (bucket_id = 'project-screenshots' and (select public.is_admin()))
with check (bucket_id = 'project-screenshots' and (select public.is_admin()));

create policy "Admins delete project screenshots"
on storage.objects for delete to authenticated
using (bucket_id = 'project-screenshots' and (select public.is_admin()));

commit;
