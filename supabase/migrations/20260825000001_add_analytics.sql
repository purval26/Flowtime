-- ==========================================
-- 1. Create Analytics Events Table
-- ==========================================
CREATE TABLE public.analytics_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type TEXT NOT NULL, -- 'page_view', 'class_selected', 'theme_toggled'
    platform TEXT NOT NULL, -- 'web', 'mobile'
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 2. Row-Level Security (RLS) Policies
-- ==========================================
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Anyone can log telemetry events (allows anonymous student tracking)
CREATE POLICY "Anyone can log analytics" ON public.analytics_events 
FOR INSERT WITH CHECK (true);

-- Only staff can view analytical summaries
CREATE POLICY "Staff can view analytics" ON public.analytics_events 
FOR SELECT USING (public.is_staff(auth.uid()));
