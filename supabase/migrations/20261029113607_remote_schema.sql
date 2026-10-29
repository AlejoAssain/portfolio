


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."delete_admin_entity"("p_entity" "text", "p_id" "text") RETURNS "void"
    LANGUAGE "plpgsql"
    SET "search_path" TO ''
    AS $$
begin
  if not public.is_admin() then
    raise exception 'Admin access required'
      using errcode = '42501';
  end if;

  case p_entity
    when 'projects' then
      delete from public.project_skills where project_id = p_id;
      delete from public.projects where id = p_id;

    when 'experiences' then
      delete from public.experience_skills where experience_id = p_id;
      delete from public.experiences where id = p_id;

    when 'skills' then
      delete from public.project_skills where skill_id = p_id;
      delete from public.experience_skills where skill_id = p_id;
      delete from public.skills where id = p_id;

    else
      raise exception 'Unsupported entity: %', p_entity;
  end case;
end;
$$;


ALTER FUNCTION "public"."delete_admin_entity"("p_entity" "text", "p_id" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_admin"() RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;


ALTER FUNCTION "public"."is_admin"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."reorder_admin_entities"("p_entity" "text", "p_ids" "text"[]) RETURNS "void"
    LANGUAGE "plpgsql"
    SET "search_path" TO ''
    AS $$
declare
  expected_count integer;
  supplied_count integer;
  matched_count integer;
begin
  if not public.is_admin() then
    raise exception 'Admin access required'
      using errcode = '42501';
  end if;

  supplied_count := cardinality(coalesce(p_ids, array[]::text[]));

  if supplied_count <> (
    select count(distinct item)
    from unnest(coalesce(p_ids, array[]::text[])) as item
  ) then
    raise exception 'Duplicate IDs are not allowed';
  end if;

  case p_entity
    when 'projects' then
      select count(*) into expected_count from public.projects;
      select count(*) into matched_count
      from public.projects where id = any(p_ids);

      if supplied_count <> expected_count
        or matched_count <> expected_count then
        raise exception 'Project list is stale; reload and try again';
      end if;

      update public.projects as entity
      set display_order = ordered.position::integer
      from unnest(p_ids) with ordinality as ordered(id, position)
      where entity.id = ordered.id;

    when 'experiences' then
      select count(*) into expected_count from public.experiences;
      select count(*) into matched_count
      from public.experiences where id = any(p_ids);

      if supplied_count <> expected_count
        or matched_count <> expected_count then
        raise exception 'Experience list is stale; reload and try again';
      end if;

      update public.experiences as entity
      set display_order = ordered.position::integer
      from unnest(p_ids) with ordinality as ordered(id, position)
      where entity.id = ordered.id;

    when 'skills' then
      select count(*) into expected_count from public.skills;
      select count(*) into matched_count
      from public.skills where id = any(p_ids);

      if supplied_count <> expected_count
        or matched_count <> expected_count then
        raise exception 'Skill list is stale; reload and try again';
      end if;

      update public.skills as entity
      set display_order = ordered.position::integer
      from unnest(p_ids) with ordinality as ordered(id, position)
      where entity.id = ordered.id;

    else
      raise exception 'Unsupported entity: %', p_entity;
  end case;
end;
$$;


ALTER FUNCTION "public"."reorder_admin_entities"("p_entity" "text", "p_ids" "text"[]) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."rls_auto_enable"() RETURNS "event_trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'pg_catalog'
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$$;


ALTER FUNCTION "public"."rls_auto_enable"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."save_experience_with_skills"("p_existing_id" "text", "p_id" "text", "p_display_order" integer, "p_role" "text", "p_company" "text", "p_company_url" "text", "p_period" "text", "p_location" "text", "p_description" "text", "p_skill_ids" "text"[]) RETURNS "void"
    LANGUAGE "plpgsql"
    SET "search_path" TO ''
    AS $$
begin
  if not public.is_admin() then
    raise exception 'Admin access required'
      using errcode = '42501';
  end if;

  if p_existing_id is null then
    insert into public.experiences (
      id, display_order, role, company,
      company_url, period, location, description
    )
    values (
      p_id, p_display_order, p_role, p_company,
      p_company_url, p_period, p_location, p_description
    );
  else
    if p_existing_id <> p_id then
      raise exception 'Experience ID cannot be changed';
    end if;

    update public.experiences
    set
      display_order = p_display_order,
      role = p_role,
      company = p_company,
      company_url = p_company_url,
      period = p_period,
      location = p_location,
      description = p_description
    where id = p_existing_id;

    if not found then
      raise exception 'Experience not found';
    end if;
  end if;

  delete from public.experience_skills
  where experience_id = p_id;

  insert into public.experience_skills (
    experience_id,
    skill_id,
    display_order
  )
  select
    p_id,
    selected.skill_id,
    selected.position::integer
  from unnest(
    coalesce(p_skill_ids, array[]::text[])
  ) with ordinality as selected(skill_id, position);
end;
$$;


ALTER FUNCTION "public"."save_experience_with_skills"("p_existing_id" "text", "p_id" "text", "p_display_order" integer, "p_role" "text", "p_company" "text", "p_company_url" "text", "p_period" "text", "p_location" "text", "p_description" "text", "p_skill_ids" "text"[]) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."save_project_with_skills"("p_existing_id" "text", "p_id" "text", "p_display_order" integer, "p_title" "text", "p_description" "text", "p_github" "text", "p_demo" "text", "p_landing" "text", "p_image" "text", "p_featured" boolean, "p_skill_ids" "text"[]) RETURNS "void"
    LANGUAGE "plpgsql"
    SET "search_path" TO ''
    AS $$
begin
  if not public.is_admin() then
    raise exception 'Admin access required'
      using errcode = '42501';
  end if;

  if p_existing_id is null then
    insert into public.projects (
      id, display_order, title, description,
      github, demo, landing, image, featured
    )
    values (
      p_id, p_display_order, p_title, p_description,
      p_github, p_demo, p_landing, p_image, p_featured
    );
  else
    if p_existing_id <> p_id then
      raise exception 'Project ID cannot be changed';
    end if;

    update public.projects
    set
      display_order = p_display_order,
      title = p_title,
      description = p_description,
      github = p_github,
      demo = p_demo,
      landing = p_landing,
      image = p_image,
      featured = p_featured
    where id = p_existing_id;

    if not found then
      raise exception 'Project not found';
    end if;
  end if;

  delete from public.project_skills
  where project_id = p_id;

  insert into public.project_skills (
    project_id,
    skill_id,
    display_order
  )
  select
    p_id,
    selected.skill_id,
    selected.position::integer
  from unnest(
    coalesce(p_skill_ids, array[]::text[])
  ) with ordinality as selected(skill_id, position);
end;
$$;


ALTER FUNCTION "public"."save_project_with_skills"("p_existing_id" "text", "p_id" "text", "p_display_order" integer, "p_title" "text", "p_description" "text", "p_github" "text", "p_demo" "text", "p_landing" "text", "p_image" "text", "p_featured" boolean, "p_skill_ids" "text"[]) OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."admin_users" (
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."admin_users" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."contact_messages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "email" "text" NOT NULL,
    "message" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."contact_messages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."experience_skills" (
    "experience_id" "text" NOT NULL,
    "skill_id" "text" NOT NULL,
    "display_order" integer DEFAULT 0 NOT NULL
);


ALTER TABLE "public"."experience_skills" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."experiences" (
    "id" "text" NOT NULL,
    "display_order" integer DEFAULT 0 NOT NULL,
    "role" "text" NOT NULL,
    "company" "text" NOT NULL,
    "company_url" "text",
    "period" "text" NOT NULL,
    "location" "text",
    "description" "text" NOT NULL
);


ALTER TABLE "public"."experiences" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."personal_info" (
    "id" "text" DEFAULT 'main'::"text" NOT NULL,
    "name" "text" NOT NULL,
    "title" "text" NOT NULL,
    "tagline" "text" NOT NULL,
    "bio" "text" NOT NULL,
    "email" "text" NOT NULL,
    "location" "text" NOT NULL,
    "status" "text" NOT NULL
);


ALTER TABLE "public"."personal_info" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."project_skills" (
    "project_id" "text" NOT NULL,
    "skill_id" "text" NOT NULL,
    "display_order" integer DEFAULT 0 NOT NULL
);


ALTER TABLE "public"."project_skills" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."projects" (
    "id" "text" NOT NULL,
    "display_order" integer DEFAULT 0 NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "github" "text",
    "demo" "text",
    "landing" "text",
    "image" "text",
    "featured" boolean DEFAULT false NOT NULL
);


ALTER TABLE "public"."projects" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."section_settings" (
    "section" "text" NOT NULL,
    "visible" boolean DEFAULT true NOT NULL,
    CONSTRAINT "section_settings_section_check" CHECK (("section" = ANY (ARRAY['about'::"text", 'experience'::"text", 'projects'::"text", 'skills'::"text", 'contact'::"text"])))
);


ALTER TABLE "public"."section_settings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."skills" (
    "id" "text" NOT NULL,
    "display_order" integer DEFAULT 0 NOT NULL,
    "name" "text" NOT NULL,
    "category" "text" NOT NULL,
    CONSTRAINT "skills_category_check" CHECK (("category" = ANY (ARRAY['backend'::"text", 'database'::"text", 'frontend'::"text", 'infrastructure'::"text", 'automation'::"text", 'product'::"text"])))
);


ALTER TABLE "public"."skills" OWNER TO "postgres";


ALTER TABLE ONLY "public"."admin_users"
    ADD CONSTRAINT "admin_users_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."contact_messages"
    ADD CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."experience_skills"
    ADD CONSTRAINT "experience_skills_pkey" PRIMARY KEY ("experience_id", "skill_id");



ALTER TABLE ONLY "public"."experiences"
    ADD CONSTRAINT "experiences_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."personal_info"
    ADD CONSTRAINT "personal_info_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."project_skills"
    ADD CONSTRAINT "project_skills_pkey" PRIMARY KEY ("project_id", "skill_id");



ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."section_settings"
    ADD CONSTRAINT "section_settings_pkey" PRIMARY KEY ("section");



ALTER TABLE ONLY "public"."skills"
    ADD CONSTRAINT "skills_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."admin_users"
    ADD CONSTRAINT "admin_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."experience_skills"
    ADD CONSTRAINT "experience_skills_experience_id_fkey" FOREIGN KEY ("experience_id") REFERENCES "public"."experiences"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."experience_skills"
    ADD CONSTRAINT "experience_skills_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."project_skills"
    ADD CONSTRAINT "project_skills_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."project_skills"
    ADD CONSTRAINT "project_skills_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE CASCADE;



CREATE POLICY "Admins can delete contact messages" ON "public"."contact_messages" FOR DELETE TO "authenticated" USING (( SELECT "public"."is_admin"() AS "is_admin"));



CREATE POLICY "Admins can delete experience skills" ON "public"."experience_skills" FOR DELETE TO "authenticated" USING (( SELECT "public"."is_admin"() AS "is_admin"));



CREATE POLICY "Admins can delete experiences" ON "public"."experiences" FOR DELETE TO "authenticated" USING (( SELECT "public"."is_admin"() AS "is_admin"));



CREATE POLICY "Admins can delete project skills" ON "public"."project_skills" FOR DELETE TO "authenticated" USING (( SELECT "public"."is_admin"() AS "is_admin"));



CREATE POLICY "Admins can delete projects" ON "public"."projects" FOR DELETE TO "authenticated" USING (( SELECT "public"."is_admin"() AS "is_admin"));



CREATE POLICY "Admins can delete skills" ON "public"."skills" FOR DELETE TO "authenticated" USING (( SELECT "public"."is_admin"() AS "is_admin"));



CREATE POLICY "Admins can insert experience skills" ON "public"."experience_skills" FOR INSERT TO "authenticated" WITH CHECK (( SELECT "public"."is_admin"() AS "is_admin"));



CREATE POLICY "Admins can insert experiences" ON "public"."experiences" FOR INSERT TO "authenticated" WITH CHECK (( SELECT "public"."is_admin"() AS "is_admin"));



CREATE POLICY "Admins can insert personal info" ON "public"."personal_info" FOR INSERT TO "authenticated" WITH CHECK (( SELECT "public"."is_admin"() AS "is_admin"));



CREATE POLICY "Admins can insert project skills" ON "public"."project_skills" FOR INSERT TO "authenticated" WITH CHECK (( SELECT "public"."is_admin"() AS "is_admin"));



CREATE POLICY "Admins can insert projects" ON "public"."projects" FOR INSERT TO "authenticated" WITH CHECK (( SELECT "public"."is_admin"() AS "is_admin"));



CREATE POLICY "Admins can insert section settings" ON "public"."section_settings" FOR INSERT TO "authenticated" WITH CHECK (( SELECT "public"."is_admin"() AS "is_admin"));



CREATE POLICY "Admins can insert skills" ON "public"."skills" FOR INSERT TO "authenticated" WITH CHECK (( SELECT "public"."is_admin"() AS "is_admin"));



CREATE POLICY "Admins can read contact messages" ON "public"."contact_messages" FOR SELECT TO "authenticated" USING ("public"."is_admin"());



CREATE POLICY "Admins can update experience skills" ON "public"."experience_skills" FOR UPDATE TO "authenticated" USING (( SELECT "public"."is_admin"() AS "is_admin")) WITH CHECK (( SELECT "public"."is_admin"() AS "is_admin"));



CREATE POLICY "Admins can update experiences" ON "public"."experiences" FOR UPDATE TO "authenticated" USING (( SELECT "public"."is_admin"() AS "is_admin")) WITH CHECK (( SELECT "public"."is_admin"() AS "is_admin"));



CREATE POLICY "Admins can update personal info" ON "public"."personal_info" FOR UPDATE TO "authenticated" USING (( SELECT "public"."is_admin"() AS "is_admin")) WITH CHECK (( SELECT "public"."is_admin"() AS "is_admin"));



CREATE POLICY "Admins can update project skills" ON "public"."project_skills" FOR UPDATE TO "authenticated" USING (( SELECT "public"."is_admin"() AS "is_admin")) WITH CHECK (( SELECT "public"."is_admin"() AS "is_admin"));



CREATE POLICY "Admins can update projects" ON "public"."projects" FOR UPDATE TO "authenticated" USING (( SELECT "public"."is_admin"() AS "is_admin")) WITH CHECK (( SELECT "public"."is_admin"() AS "is_admin"));



CREATE POLICY "Admins can update section settings" ON "public"."section_settings" FOR UPDATE TO "authenticated" USING (( SELECT "public"."is_admin"() AS "is_admin")) WITH CHECK (( SELECT "public"."is_admin"() AS "is_admin"));



CREATE POLICY "Admins can update skills" ON "public"."skills" FOR UPDATE TO "authenticated" USING (( SELECT "public"."is_admin"() AS "is_admin")) WITH CHECK (( SELECT "public"."is_admin"() AS "is_admin"));



CREATE POLICY "Public can read experience skills" ON "public"."experience_skills" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "Public can read experiences" ON "public"."experiences" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "Public can read personal info" ON "public"."personal_info" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "Public can read project skills" ON "public"."project_skills" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "Public can read projects" ON "public"."projects" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "Public can read section settings" ON "public"."section_settings" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "Public can read skills" ON "public"."skills" FOR SELECT TO "authenticated", "anon" USING (true);



ALTER TABLE "public"."admin_users" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."contact_messages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."experience_skills" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."experiences" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."personal_info" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."project_skills" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."projects" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."section_settings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."skills" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";






















































































































































REVOKE ALL ON FUNCTION "public"."delete_admin_entity"("p_entity" "text", "p_id" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."delete_admin_entity"("p_entity" "text", "p_id" "text") TO "authenticated";



GRANT ALL ON FUNCTION "public"."is_admin"() TO "authenticated";



REVOKE ALL ON FUNCTION "public"."reorder_admin_entities"("p_entity" "text", "p_ids" "text"[]) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."reorder_admin_entities"("p_entity" "text", "p_ids" "text"[]) TO "authenticated";



REVOKE ALL ON FUNCTION "public"."rls_auto_enable"() FROM PUBLIC;



REVOKE ALL ON FUNCTION "public"."save_experience_with_skills"("p_existing_id" "text", "p_id" "text", "p_display_order" integer, "p_role" "text", "p_company" "text", "p_company_url" "text", "p_period" "text", "p_location" "text", "p_description" "text", "p_skill_ids" "text"[]) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."save_experience_with_skills"("p_existing_id" "text", "p_id" "text", "p_display_order" integer, "p_role" "text", "p_company" "text", "p_company_url" "text", "p_period" "text", "p_location" "text", "p_description" "text", "p_skill_ids" "text"[]) TO "authenticated";



REVOKE ALL ON FUNCTION "public"."save_project_with_skills"("p_existing_id" "text", "p_id" "text", "p_display_order" integer, "p_title" "text", "p_description" "text", "p_github" "text", "p_demo" "text", "p_landing" "text", "p_image" "text", "p_featured" boolean, "p_skill_ids" "text"[]) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."save_project_with_skills"("p_existing_id" "text", "p_id" "text", "p_display_order" integer, "p_title" "text", "p_description" "text", "p_github" "text", "p_demo" "text", "p_landing" "text", "p_image" "text", "p_featured" boolean, "p_skill_ids" "text"[]) TO "authenticated";


















GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."admin_users" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."admin_users" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."admin_users" TO "service_role";



GRANT INSERT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."contact_messages" TO "anon";
GRANT ALL ON TABLE "public"."contact_messages" TO "authenticated";
GRANT INSERT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."contact_messages" TO "service_role";



GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."experience_skills" TO "anon";
GRANT ALL ON TABLE "public"."experience_skills" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."experience_skills" TO "service_role";



GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."experiences" TO "anon";
GRANT ALL ON TABLE "public"."experiences" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."experiences" TO "service_role";



GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."personal_info" TO "anon";
GRANT SELECT,INSERT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE "public"."personal_info" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."personal_info" TO "service_role";



GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."project_skills" TO "anon";
GRANT ALL ON TABLE "public"."project_skills" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."project_skills" TO "service_role";



GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."projects" TO "anon";
GRANT ALL ON TABLE "public"."projects" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."projects" TO "service_role";



GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."section_settings" TO "anon";
GRANT SELECT,INSERT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE "public"."section_settings" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."section_settings" TO "service_role";



GRANT SELECT,REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."skills" TO "anon";
GRANT ALL ON TABLE "public"."skills" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."skills" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLES TO "service_role";



































drop extension if exists "pg_net";

drop policy "Public can read experience skills" on "public"."experience_skills";

drop policy "Public can read experiences" on "public"."experiences";

drop policy "Public can read personal info" on "public"."personal_info";

drop policy "Public can read project skills" on "public"."project_skills";

drop policy "Public can read projects" on "public"."projects";

drop policy "Public can read section settings" on "public"."section_settings";

drop policy "Public can read skills" on "public"."skills";

revoke delete on table "public"."admin_users" from "anon";

revoke insert on table "public"."admin_users" from "anon";

revoke select on table "public"."admin_users" from "anon";

revoke update on table "public"."admin_users" from "anon";

revoke delete on table "public"."admin_users" from "authenticated";

revoke insert on table "public"."admin_users" from "authenticated";

revoke select on table "public"."admin_users" from "authenticated";

revoke update on table "public"."admin_users" from "authenticated";

revoke delete on table "public"."admin_users" from "service_role";

revoke insert on table "public"."admin_users" from "service_role";

revoke select on table "public"."admin_users" from "service_role";

revoke update on table "public"."admin_users" from "service_role";

revoke delete on table "public"."contact_messages" from "anon";

revoke select on table "public"."contact_messages" from "anon";

revoke update on table "public"."contact_messages" from "anon";

revoke delete on table "public"."contact_messages" from "service_role";

revoke select on table "public"."contact_messages" from "service_role";

revoke update on table "public"."contact_messages" from "service_role";

revoke delete on table "public"."experience_skills" from "anon";

revoke insert on table "public"."experience_skills" from "anon";

revoke update on table "public"."experience_skills" from "anon";

revoke delete on table "public"."experience_skills" from "service_role";

revoke insert on table "public"."experience_skills" from "service_role";

revoke select on table "public"."experience_skills" from "service_role";

revoke update on table "public"."experience_skills" from "service_role";

revoke delete on table "public"."experiences" from "anon";

revoke insert on table "public"."experiences" from "anon";

revoke update on table "public"."experiences" from "anon";

revoke delete on table "public"."experiences" from "service_role";

revoke insert on table "public"."experiences" from "service_role";

revoke select on table "public"."experiences" from "service_role";

revoke update on table "public"."experiences" from "service_role";

revoke delete on table "public"."personal_info" from "anon";

revoke insert on table "public"."personal_info" from "anon";

revoke update on table "public"."personal_info" from "anon";

revoke delete on table "public"."personal_info" from "authenticated";

revoke delete on table "public"."personal_info" from "service_role";

revoke insert on table "public"."personal_info" from "service_role";

revoke select on table "public"."personal_info" from "service_role";

revoke update on table "public"."personal_info" from "service_role";

revoke delete on table "public"."project_skills" from "anon";

revoke insert on table "public"."project_skills" from "anon";

revoke update on table "public"."project_skills" from "anon";

revoke delete on table "public"."project_skills" from "service_role";

revoke insert on table "public"."project_skills" from "service_role";

revoke select on table "public"."project_skills" from "service_role";

revoke update on table "public"."project_skills" from "service_role";

revoke delete on table "public"."projects" from "anon";

revoke insert on table "public"."projects" from "anon";

revoke update on table "public"."projects" from "anon";

revoke delete on table "public"."projects" from "service_role";

revoke insert on table "public"."projects" from "service_role";

revoke select on table "public"."projects" from "service_role";

revoke update on table "public"."projects" from "service_role";

revoke delete on table "public"."section_settings" from "anon";

revoke insert on table "public"."section_settings" from "anon";

revoke update on table "public"."section_settings" from "anon";

revoke delete on table "public"."section_settings" from "authenticated";

revoke delete on table "public"."section_settings" from "service_role";

revoke insert on table "public"."section_settings" from "service_role";

revoke select on table "public"."section_settings" from "service_role";

revoke update on table "public"."section_settings" from "service_role";

revoke delete on table "public"."skills" from "anon";

revoke insert on table "public"."skills" from "anon";

revoke update on table "public"."skills" from "anon";

revoke delete on table "public"."skills" from "service_role";

revoke insert on table "public"."skills" from "service_role";

revoke select on table "public"."skills" from "service_role";

revoke update on table "public"."skills" from "service_role";


  create policy "Public can read experience skills"
  on "public"."experience_skills"
  as permissive
  for select
  to anon, authenticated
using (true);



  create policy "Public can read experiences"
  on "public"."experiences"
  as permissive
  for select
  to anon, authenticated
using (true);



  create policy "Public can read personal info"
  on "public"."personal_info"
  as permissive
  for select
  to anon, authenticated
using (true);



  create policy "Public can read project skills"
  on "public"."project_skills"
  as permissive
  for select
  to anon, authenticated
using (true);



  create policy "Public can read projects"
  on "public"."projects"
  as permissive
  for select
  to anon, authenticated
using (true);



  create policy "Public can read section settings"
  on "public"."section_settings"
  as permissive
  for select
  to anon, authenticated
using (true);



  create policy "Public can read skills"
  on "public"."skills"
  as permissive
  for select
  to anon, authenticated
using (true);



