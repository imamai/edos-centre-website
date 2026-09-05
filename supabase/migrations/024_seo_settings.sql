-- GA4 measurement ID, read by GoogleAnalytics.tsx. Blank by default — the script
-- only renders once a real ID is set here, never a fabricated placeholder.
insert into edoscentre_site_settings (key, value, description)
values ('ga_measurement_id', '""', 'Google Analytics 4 Measurement ID (e.g. G-XXXXXXXXXX). Leave blank to disable analytics.')
on conflict (key) do nothing;

-- Footer link to the new /faq page (wired to the previously-unused edoscentre_faqs
-- table via src/app/(site)/faq/page.tsx).
insert into edoscentre_navigation_items (label, href, parent_id, menu_slot, sort_order, is_active, open_in_new)
values ('FAQ', '/faq', null, 'footer_company', 4, true, false);
