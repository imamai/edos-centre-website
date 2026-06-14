-- ============================================================================
-- Migration 007 – Website Schema Seed Data
-- Populates initial CMS content for Edos Centre website
-- Safe to re-run: uses ON CONFLICT DO NOTHING
-- ============================================================================

-- ── Site Settings ─────────────────────────────────────────────────────────────
INSERT INTO website.site_settings (key, value, description) VALUES
  ('site_title',           '"Edos Centre – Embrace Data for Optimum Solutions"',    'Browser title tag'),
  ('site_description',     '"East Africa''s premier Data Analytics, Data Engineering, SaaS & Digital Transformation partner."', 'Meta description'),
  ('primary_color',        '"#E31E24"', 'Brand red'),
  ('contact_email',        '"hello@edoscentre.com"', 'Public contact email'),
  ('contact_phone',        '"+254 700 000 000"', 'Public phone number'),
  ('contact_location',     '"Nairobi, Kenya"', 'Office location'),
  ('twitter_handle',       '"@edoscentre"', 'Twitter/X handle'),
  ('linkedin_url',         '"https://linkedin.com/company/edoscentre"', 'LinkedIn URL'),
  ('og_image',             '"/og-image.png"', 'Default Open Graph image')
ON CONFLICT (key) DO NOTHING;

-- ── Metrics ───────────────────────────────────────────────────────────────────
INSERT INTO website.metrics (key, label, sub_label, description, sort_order) VALUES
  ('projects_delivered',   '50+',   'Projects Delivered',   'Across East Africa',                    1),
  ('records_processed',    '500M+', 'Records Processed',    'Monthly across all systems',            2),
  ('organizations_served', '20+',   'Organizations Served', 'Government, NGO & enterprise',         3),
  ('system_reliability',   '99.9%', 'System Reliability',   'SLA maintained across all platforms',  4),
  ('dashboards_built',     '100+',  'Dashboards Built',     'Live and in production',               5),
  ('industry_verticals',   '7',     'Industry Verticals',   'Deep domain expertise',                6)
ON CONFLICT (key) DO NOTHING;

-- ── Technology Categories ─────────────────────────────────────────────────────
INSERT INTO website.technology_categories (name, slug, sort_order) VALUES
  ('Data Collection',   'data-collection',   1),
  ('Data Engineering',  'data-engineering',  2),
  ('Analytics & BI',    'analytics-bi',      3),
  ('Storage',           'storage',           4),
  ('Applications',      'applications',      5),
  ('Infrastructure',    'infrastructure',    6)
ON CONFLICT (name) DO NOTHING;

-- ── Technologies ─────────────────────────────────────────────────────────────
DO $$
DECLARE
  cat_collect  UUID := (SELECT id FROM website.technology_categories WHERE slug = 'data-collection');
  cat_eng      UUID := (SELECT id FROM website.technology_categories WHERE slug = 'data-engineering');
  cat_analytics UUID := (SELECT id FROM website.technology_categories WHERE slug = 'analytics-bi');
  cat_storage  UUID := (SELECT id FROM website.technology_categories WHERE slug = 'storage');
  cat_apps     UUID := (SELECT id FROM website.technology_categories WHERE slug = 'applications');
  cat_infra    UUID := (SELECT id FROM website.technology_categories WHERE slug = 'infrastructure');
BEGIN
  INSERT INTO website.technologies (category_id, name, slug, is_featured, sort_order) VALUES
    -- Data Collection
    (cat_collect, 'ODK Collect',    'odk-collect',    true,  1),
    (cat_collect, 'KoboToolbox',    'kobotoolbox',    true,  2),
    (cat_collect, 'SurveyCTO',      'surveycto',      true,  3),
    (cat_collect, 'REDCap',         'redcap',         false, 4),
    (cat_collect, 'CommCare',       'commcare',       false, 5),
    -- Data Engineering
    (cat_eng,     'Apache Airflow', 'apache-airflow', true,  1),
    (cat_eng,     'dbt',            'dbt',            true,  2),
    (cat_eng,     'Apache Kafka',   'apache-kafka',   false, 3),
    -- Analytics & BI
    (cat_analytics,'Power BI',      'power-bi',       true,  1),
    (cat_analytics,'Apache Superset','apache-superset',true, 2),
    (cat_analytics,'Tableau',       'tableau',        false, 3),
    (cat_analytics,'Metabase',      'metabase',       false, 4),
    (cat_analytics,'DHIS2',         'dhis2',          true,  5),
    -- Storage
    (cat_storage, 'PostgreSQL',     'postgresql',     true,  1),
    (cat_storage, 'Supabase',       'supabase',       true,  2),
    (cat_storage, 'BigQuery',       'bigquery',       false, 3),
    -- Applications
    (cat_apps,    'Next.js',        'nextjs',         true,  1),
    (cat_apps,    'React Native',   'react-native',   true,  2),
    (cat_apps,    'Flutter',        'flutter',        false, 3),
    (cat_apps,    'Django',         'django',         true,  4),
    (cat_apps,    'FastAPI',        'fastapi',        false, 5),
    -- Infrastructure
    (cat_infra,   'Docker',         'docker',         false, 1),
    (cat_infra,   'Vercel',         'vercel',         false, 2),
    (cat_infra,   'GitHub Actions', 'github-actions', false, 3)
  ON CONFLICT (slug) DO NOTHING;
END;
$$;

-- ── Platform Layers ───────────────────────────────────────────────────────────
INSERT INTO website.platform_layers (layer_number, name, subtitle, description, icon, color_hex, sort_order) VALUES
  (1, 'Data Collection',  'Capture at the source',    'Digitize and standardize data collection across all touchpoints using industry-leading tools.',             'Database',   '#6B5B95', 1),
  (2, 'Data Engineering', 'Build the data backbone',  'Transform raw data into reliable, queryable assets with robust ETL pipelines and modern warehousing.',       'Cpu',        '#E31E24', 2),
  (3, 'Analytics & BI',   'Surface what matters',     'Convert data assets into actionable intelligence with world-class analytics and business intelligence platforms.','BarChart3', '#E31E24', 3),
  (4, 'Applications',     'Software that scales',     'Build purpose-fit web, mobile, and SaaS applications on top of your data infrastructure.',                 'Globe',      '#2E234F', 4),
  (5, 'Decision Support', 'From insight to action',   'Empower leadership with AI-enabled reporting, strategic dashboards, and automated insight delivery.',        'Brain',      '#2E234F', 5)
ON CONFLICT (layer_number) DO NOTHING;

-- ── Services ─────────────────────────────────────────────────────────────────
INSERT INTO website.services (slug, title, tagline, description, icon, is_featured, is_active, sort_order) VALUES
  ('data-analytics',           'Data Analytics',              'Turn raw data into competitive advantage',  'Business intelligence, advanced analytics, KPI frameworks and executive dashboards that drive real decisions.',    'BarChart3',    true,  true,  1),
  ('data-engineering',         'Data Engineering',            'Build your data backbone',                  'Robust ETL pipelines, data warehouses, data lakes and real-time streaming architectures.',                        'Cpu',          true,  true,  2),
  ('saas-platforms',           'SaaS Platforms',              'Multi-tenant cloud applications',           'End-to-end SaaS development from architecture to deployment — subscription management, billing, white-labelling.','Globe',        true,  true,  3),
  ('dashboard-development',    'Dashboard Development',       'Insight at a glance',                       'Custom operational and strategic dashboards with real-time data, role-based views and mobile optimization.',       'LayoutDashboard', false, true, 4),
  ('web-development',          'Web Development',             'Enterprise-grade web applications',         'Full-stack web applications, portals, e-commerce and content platforms built for performance and scale.',          'Globe',        false, true,  5),
  ('mobile-applications',      'Mobile Applications',         'iOS & Android at enterprise scale',         'Cross-platform and native mobile apps with offline capability, push notifications and data sync.',                 'Smartphone',   false, true,  6),
  ('desktop-systems',          'Desktop Systems',             'Offline-first enterprise software',         'Windows and cross-platform desktop applications for environments with limited connectivity.',                       'Monitor',      false, true,  7),
  ('questionnaire-digitization','Questionnaire Digitization', 'Zero paper, maximum data quality',          'Transform paper-based data collection using ODK, KoboToolbox, SurveyCTO and REDCap.',                             'ClipboardList',false, true,  8),
  ('monitoring-evaluation',    'M&E Systems',                 'Measure what matters',                      'End-to-end Monitoring & Evaluation systems with indicator tracking, logframe management and donor reporting.',       'Activity',     false, true,  9),
  ('dhis2-integrations',       'DHIS2 Integrations',          'Connect your health systems',               'Custom DHIS2 configuration, data element setup, analytics apps, API integrations and national system linkages.',    'Link2',        false, true, 10)
ON CONFLICT (slug) DO NOTHING;

-- ── Industries ────────────────────────────────────────────────────────────────
INSERT INTO website.industries (slug, name, tagline, description, icon, is_active, sort_order) VALUES
  ('healthcare',          'Healthcare',         'Digitizing Africa''s health systems',              'HMIS, EMR, DHIS2 and supply chain for county health departments and hospitals.',               'Heart',        true, 1),
  ('ngos',                'NGOs & Development', 'Proof-of-impact for development programs',         'M&E systems, KoboToolbox, DHIS2 and donor reporting platforms for development organisations.', 'TrendingUp',   true, 2),
  ('government',          'Government',         'Data-driven public service delivery',              'County dashboards, e-Government portals and cross-department data integration.',                'Landmark',     true, 3),
  ('education',           'Education',          'Smart institutions, better outcomes',              'School management systems, learner analytics and fee management platforms.',                    'GraduationCap',true, 4),
  ('agriculture',         'Agriculture',        'Data for food security',                          'Farmer registries, crop tracking apps and agri-data systems for county agriculture departments.','Leaf',        true, 5),
  ('financial-services',  'Financial Services', 'Compliance, analytics & fintech',                 'Regulatory reporting automation, credit scoring dashboards and fraud analytics.',               'Building2',    true, 6),
  ('retail',              'Retail & Logistics', 'Inventory intelligence & customer analytics',     'POS, inventory management, customer loyalty platforms and supply chain dashboards.',             'ShoppingBag',  true, 7)
ON CONFLICT (slug) DO NOTHING;

-- ── Blog Categories ───────────────────────────────────────────────────────────
INSERT INTO website.blog_categories (name, slug, color_hex, sort_order) VALUES
  ('Data Engineering',  'data-engineering',  '#E31E24', 1),
  ('Analytics & BI',    'analytics-bi',      '#2E234F', 2),
  ('M&E Systems',       'me-systems',        '#6B5B95', 3),
  ('SaaS Development',  'saas-development',  '#06b6d4', 4),
  ('DHIS2',             'dhis2',             '#22c55e', 5),
  ('Digital Strategy',  'digital-strategy',  '#f59e0b', 6)
ON CONFLICT (name) DO NOTHING;

-- ── FAQ Categories ────────────────────────────────────────────────────────────
INSERT INTO website.faq_categories (name, slug, sort_order) VALUES
  ('General',         'general',         1),
  ('Services',        'services',        2),
  ('Pricing',         'pricing',         3),
  ('Technical',       'technical',       4),
  ('Engagement',      'engagement',      5)
ON CONFLICT (name) DO NOTHING;

-- ── FAQs ──────────────────────────────────────────────────────────────────────
DO $$
DECLARE
  cat_gen UUID := (SELECT id FROM website.faq_categories WHERE slug = 'general');
  cat_svc UUID := (SELECT id FROM website.faq_categories WHERE slug = 'services');
  cat_eng UUID := (SELECT id FROM website.faq_categories WHERE slug = 'engagement');
BEGIN
  INSERT INTO website.faqs (category_id, question, answer, sort_order) VALUES
    (cat_gen, 'What is Edos Centre?',
      'Edos Centre is East Africa''s data analytics, data engineering, SaaS development and digital transformation partner. We help governments, NGOs, healthcare organizations and enterprises turn data into decisions and software into impact.',
      1),
    (cat_gen, 'Where is Edos Centre based?',
      'We are headquartered in Nairobi, Kenya, and deliver projects across East Africa including Uganda, Tanzania, Rwanda and Ethiopia.',
      2),
    (cat_svc, 'What data collection tools do you work with?',
      'We specialize in ODK Collect, KoboToolbox, SurveyCTO, REDCap and CommCare. We can also integrate any API-enabled tool into your data pipeline.',
      1),
    (cat_svc, 'Do you implement DHIS2?',
      'Yes. We are experienced DHIS2 implementers — from data element configuration and tracker programs to custom analytics apps and API integrations with national systems.',
      2),
    (cat_eng, 'How long does a typical project take?',
      'It depends on scope. A dashboard project may take 3–6 weeks. A full HMIS implementation can take 3–6 months. We begin every engagement with a scoping session to give you accurate timelines.',
      1),
    (cat_eng, 'Do you offer ongoing support after delivery?',
      'Yes. All our systems come with a 3-month warranty period and optional SLA-based support contracts covering bug fixes, updates, training and capacity building.',
      2)
  ON CONFLICT DO NOTHING;
END;
$$;

-- ── Navigation ────────────────────────────────────────────────────────────────
INSERT INTO website.navigation_items (label, href, menu_slot, sort_order) VALUES
  ('Solutions',      '/services',     'primary',          1),
  ('Industries',     '/industries',   'primary',          2),
  ('Case Studies',   '/case-studies', 'primary',          3),
  ('Resources',      '/resources',    'primary',          4),
  ('About',          '/about',        'primary',          5),
  ('Blog',           '/blog',         'footer_resources', 1),
  ('Case Studies',   '/case-studies', 'footer_resources', 2),
  ('Guides',         '/resources?type=guide',      'footer_resources', 3),
  ('Whitepapers',    '/resources?type=whitepaper', 'footer_resources', 4),
  ('About Us',       '/about',        'footer_company',   1),
  ('Contact',        '/contact',      'footer_company',   2),
  ('Consultation',   '/consultation', 'footer_company',   3)
ON CONFLICT DO NOTHING;
