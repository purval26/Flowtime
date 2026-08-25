-- ==========================================
-- 1. Create Professors Table
-- ==========================================
CREATE TABLE public.professors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 2. Add professor_id to Timetable Entries
-- ==========================================
ALTER TABLE public.timetable_entries 
ADD COLUMN professor_id UUID REFERENCES public.professors(id) ON DELETE SET NULL;

-- ==========================================
-- 3. Row-Level Security (RLS) Policies
-- ==========================================
ALTER TABLE public.professors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Professors are viewable by everyone" ON public.professors FOR SELECT USING (true);
CREATE POLICY "Staff can manage professors" ON public.professors FOR ALL USING (public.is_staff(auth.uid()));

-- ==========================================
-- 4. Triggers for updated_at
-- ==========================================
CREATE TRIGGER update_professors_updated_at 
BEFORE UPDATE ON public.professors 
FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
