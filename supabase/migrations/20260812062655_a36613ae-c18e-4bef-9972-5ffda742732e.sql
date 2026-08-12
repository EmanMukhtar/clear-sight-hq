CREATE TABLE public.roadmap_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  department text NOT NULL DEFAULT 'Ops',
  category text NOT NULL DEFAULT 'feature',
  status text NOT NULL DEFAULT 'next',
  priority text NOT NULL DEFAULT 'medium',
  owner text NOT NULL DEFAULT '',
  eta text NOT NULL DEFAULT '',
  blocking_launch boolean NOT NULL DEFAULT false,
  dependencies jsonb NOT NULL DEFAULT '[]'::jsonb,
  note text NOT NULL DEFAULT '',
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.roadmap_tasks TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.roadmap_tasks TO authenticated;
GRANT ALL ON public.roadmap_tasks TO service_role;

ALTER TABLE public.roadmap_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "roadmap_tasks open read" ON public.roadmap_tasks FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "roadmap_tasks open insert" ON public.roadmap_tasks FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "roadmap_tasks open update" ON public.roadmap_tasks FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "roadmap_tasks open delete" ON public.roadmap_tasks FOR DELETE TO anon, authenticated USING (true);

CREATE TABLE public.roadmap_settings (
  id text PRIMARY KEY,
  launch_date text NOT NULL DEFAULT 'August 28',
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.roadmap_settings TO anon;
GRANT SELECT, INSERT, UPDATE ON public.roadmap_settings TO authenticated;
GRANT ALL ON public.roadmap_settings TO service_role;

ALTER TABLE public.roadmap_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "roadmap_settings open read" ON public.roadmap_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "roadmap_settings open insert" ON public.roadmap_settings FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "roadmap_settings open update" ON public.roadmap_settings FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER roadmap_tasks_touch BEFORE UPDATE ON public.roadmap_tasks
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

ALTER TABLE public.roadmap_tasks REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.roadmap_tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.roadmap_settings;

INSERT INTO public.roadmap_settings (id, launch_date) VALUES ('default', 'August 28');

INSERT INTO public.roadmap_tasks (name, department, category, status, priority, owner, eta, blocking_launch, dependencies, note, position) VALUES
('Real property/parcel data — all 9 served cities', 'GTM', 'feature', 'done', 'high', 'Eman', '', false, '[]'::jsonb, '', 100),
('Municipality directory (real data)', 'GTM', 'infrastructure', 'done', 'medium', 'Eman', '', false, '[]'::jsonb, '', 200),
('Address lookup — Google + Census fallback', 'GTM', 'feature', 'done', 'high', 'Eman', '', false, '[]'::jsonb, '', 300),
('Integrate DBPR API key', 'GTM', 'feature', 'next', 'medium', 'Eman', '', false, '[]'::jsonb, '', 400),
('myCOI / illumend white-label partnership', 'GTM', 'feature', 'inprogress', 'medium', 'Eman', '1 week', false, '[]'::jsonb, '', 500),
('Municipality Submission — expand past Plantation pilot', 'GTM', 'feature', 'next', 'critical', 'Eman', '2 weeks', true, '[{"name":"Agent 5 approval gate","done":true},{"name":"test_only safeguard","done":true}]'::jsonb, '', 600),
('Permit History', 'GTM', 'feature', 'blocked', 'low', 'Eman', 'TBD', false, '[{"name":"Building dept login storage","done":true},{"name":"Faster per-city workaround","done":false}]'::jsonb, 'Blocked on municipal portal logins — real permit history lives inside each city''s own building department system, not a shared dataset. Need a quicker workaround than connecting to every portal one at a time.', 700),
('Real Stripe pricing tiers', 'Finance', 'feature', 'done', 'high', 'Eman', '', false, '[]'::jsonb, '', 800),
('Billing and invoicing — real Stripe charges', 'Finance', 'feature', 'done', 'high', 'Eman', '', false, '[]'::jsonb, '', 900),
('Payment Authorization — real embedded checkout', 'Finance', 'feature', 'done', 'high', 'Eman', '', false, '[]'::jsonb, '', 1000),
('Staff assignment, priority, escalation tracking', 'Ops', 'feature', 'done', 'medium', 'Eman', '', false, '[]'::jsonb, '', 1100),
('Audit trail — real activity log', 'Ops', 'infrastructure', 'done', 'medium', 'Eman', '', false, '[]'::jsonb, '', 1200),
('Project notes — real, tenant-scoped', 'Ops', 'feature', 'done', 'low', 'Eman', '', false, '[]'::jsonb, '', 1300),
('Reports — real numbers, not seeded', 'Ops', 'feature', 'done', 'medium', 'Eman', '', false, '[]'::jsonb, '', 1400),
('Calendar — real deadlines', 'Ops', 'feature', 'done', 'medium', 'Eman', '', false, '[]'::jsonb, '', 1500),
('Notary request queue', 'Ops', 'feature', 'done', 'low', 'Eman', '', false, '[]'::jsonb, '', 1600),
('Inspections — real scheduling and results', 'Ops', 'feature', 'done', 'medium', 'Eman', '', false, '[]'::jsonb, '', 1700),
('Dispatch property intelligence panel', 'Ops', 'feature', 'done', 'high', 'Eman', '', false, '[]'::jsonb, '', 1800),
('Company Profile — real data + file uploads', 'Ops', 'feature', 'done', 'medium', 'Eman', '', false, '[]'::jsonb, '', 1900),
('Legal Document Library — real storage + versioning', 'Ops', 'feature', 'done', 'low', 'Eman', '', false, '[]'::jsonb, '', 2000),
('Insurance Requests — real submission + notification', 'Ops', 'feature', 'done', 'medium', 'Eman', '', false, '[{"name":"Company Profiles","done":true},{"name":"File uploads","done":true},{"name":"E-signatures (SignWell)","done":true}]'::jsonb, '', 2100),
('Full 7-agent permit automation pipeline', 'Ops', 'feature', 'done', 'critical', 'Eman', '', false, '[]'::jsonb, '', 2200),
('Real e-signatures (SignWell)', 'Ops', 'infrastructure', 'done', 'high', 'Eman', '', false, '[]'::jsonb, '', 2300),
('Automated code reviewer (QA Agent)', 'Ops', 'infrastructure', 'done', 'medium', 'Eman', '', false, '[]'::jsonb, '', 2400),
('Staff Workload — fix fake employee roster', 'Ops', 'techdebt', 'inprogress', 'medium', 'Eman', '2 days', false, '[]'::jsonb, '', 2500),
('Check GC Clients admin page', 'Ops', 'techdebt', 'next', 'low', 'Eman', '', false, '[]'::jsonb, '', 2600),
('PostHog product analytics setup', 'Ops', 'infrastructure', 'inprogress', 'medium', 'Eman', '3 days', false, '[]'::jsonb, '', 2700),
('Victoria AI intelligence layer', 'Ops', 'feature', 'next', 'low', 'Eman', '', false, '[]'::jsonb, '', 2800),
('Fixed invite/signup tenant-isolation hole', 'Security & Legal', 'security', 'done', 'critical', 'Eman', '', false, '[]'::jsonb, '', 2900),
('Fixed internal notes exposure', 'Security & Legal', 'security', 'done', 'high', 'Eman', '', false, '[]'::jsonb, '', 3000),
('Locked database functions against forgery', 'Security & Legal', 'security', 'done', 'high', 'Eman', '', false, '[]'::jsonb, '', 3100),
('Fixed fake support-reply forgery bug', 'Security & Legal', 'security', 'done', 'high', 'Eman', '', false, '[]'::jsonb, '', 3200),
('Removed duplicate insecure credential system', 'Security & Legal', 'security', 'done', 'medium', 'Eman', '', false, '[]'::jsonb, '', 3300),
('Approval gate — government filing (Agent 5)', 'Security & Legal', 'security', 'done', 'critical', 'Eman', '', false, '[]'::jsonb, '', 3400),
('Approval gate — client-facing letters (Agent 7)', 'Security & Legal', 'security', 'done', 'critical', 'Eman', '', false, '[]'::jsonb, '', 3500),
('Fixed 5 RLS/publish-blocking security findings', 'Security & Legal', 'security', 'done', 'critical', 'Eman', '', false, '[]'::jsonb, '', 3600),
('Correction-reply routing — Plantation address', 'Security & Legal', 'feature', 'inprogress', 'medium', 'Eman', 'pending confirmation', false, '[{"name":"Elajuwan needs to confirm the real email","done":false}]'::jsonb, '', 3700);