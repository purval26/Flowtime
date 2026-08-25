-- ==========================================
-- 1. Create Announcements Table
-- ==========================================
CREATE TABLE public.announcements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE, -- NULL means Global announcement
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 2. Row-Level Security (RLS) Policies
-- ==========================================
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Select is open to all visitors/students
CREATE POLICY "Anyone can view announcements" ON public.announcements 
FOR SELECT USING (true);

-- Insert/Update/Delete is restricted to staff
CREATE POLICY "Staff can manage announcements" ON public.announcements 
FOR ALL USING (public.is_staff(auth.uid()));

-- ==========================================
-- 3. Audit Logs Trigger Integration
-- ==========================================
CREATE TRIGGER audit_announcements_trigger 
AFTER INSERT OR UPDATE OR DELETE ON public.announcements 
FOR EACH ROW EXECUTE FUNCTION public.process_audit_log();

-- ==========================================
-- 4. Enable Supabase Realtime Publication
-- ==========================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.announcements;
