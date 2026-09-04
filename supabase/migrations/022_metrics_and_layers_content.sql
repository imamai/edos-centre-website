-- Homepage metrics need a raw numeric value + suffix for the animated count-up
-- (label/sub_label/description alone can't drive the animation).
alter table edoscentre_metrics
  add column if not exists value numeric,
  add column if not exists suffix text default '';

update edoscentre_metrics set value = 50,  suffix = '+'  where key = 'projects_delivered';
update edoscentre_metrics set value = 500, suffix = 'M+' where key = 'records_processed';
update edoscentre_metrics set value = 20,  suffix = '+'  where key = 'organizations_served';
update edoscentre_metrics set value = 99.9, suffix = '%' where key = 'system_reliability';
update edoscentre_metrics set value = 100, suffix = '+'  where key = 'dashboards_built';
update edoscentre_metrics set value = 7,   suffix = ''   where key = 'industry_verticals';

alter table edoscentre_metrics alter column value set not null;

-- Platform framework layers need a "real-world example" line shown in the detail panel.
alter table edoscentre_platform_layers
  add column if not exists example text;

update edoscentre_platform_layers set example = 'A county health program collects patient data from 200+ facilities with zero paper forms.'
  where layer_number = 1;
update edoscentre_platform_layers set example = '500M+ health records processed monthly with 99.9% pipeline reliability.'
  where layer_number = 2;
update edoscentre_platform_layers set example = 'NGO programme director views real-time M&E dashboards from any device.'
  where layer_number = 3;
update edoscentre_platform_layers set example = 'Agricultural SaaS platform manages 15,000 farmers across 3 counties.'
  where layer_number = 4;
update edoscentre_platform_layers set example = 'Ministry cabinet receives weekly AI-generated performance briefs automatically.'
  where layer_number = 5;
