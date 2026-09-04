-- Case study detail pages show a project duration and year that the schema
-- had no columns for.
alter table edoscentre_case_studies
  add column if not exists duration text,
  add column if not exists project_year text;

-- Two technologies referenced by existing case study content that weren't
-- in the catalog yet.
insert into edoscentre_technologies (name, slug, is_featured, sort_order)
values
  ('Celery', 'celery', false, 100),
  ('KRA eTIMS', 'kra-etims', false, 101)
on conflict (slug) do nothing;
