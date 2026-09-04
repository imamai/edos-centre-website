-- Add a description field to navigation items, used for mega-menu dropdown copy
-- (e.g. "BI, dashboards & advanced analytics" under Solutions > Data Analytics).
alter table edoscentre_navigation_items
  add column if not exists description text;

-- Widen the menu_slot check to cover the footer's Industries column and the
-- "footer_legal" slot the admin UI already offered but the schema never allowed.
alter table edoscentre_navigation_items drop constraint edoscentre_navigation_items_menu_slot_check;
alter table edoscentre_navigation_items add constraint edoscentre_navigation_items_menu_slot_check
  check (menu_slot = any (array['primary'::text, 'footer_company'::text, 'footer_services'::text, 'footer_resources'::text, 'footer_industries'::text, 'footer_legal'::text]));
