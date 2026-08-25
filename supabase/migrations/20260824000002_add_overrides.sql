-- ==========================================
-- 1. Create Timetable Overrides Table
-- ==========================================
CREATE TABLE public.timetable_overrides (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    timetable_id UUID REFERENCES public.timetables(id) ON DELETE CASCADE NOT NULL,
    override_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    type TEXT NOT NULL,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
    room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL,
    professor_id UUID REFERENCES public.professors(id) ON DELETE SET NULL,
    label TEXT,
    notes TEXT,
    is_cancelled BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 2. Row-Level Security (RLS) Policies
-- ==========================================
ALTER TABLE public.timetable_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Overrides are viewable by everyone" ON public.timetable_overrides FOR SELECT USING (true);
CREATE POLICY "Staff can manage overrides" ON public.timetable_overrides FOR ALL USING (public.is_staff(auth.uid()));

-- ==========================================
-- 3. Triggers for updated_at
-- ==========================================
CREATE TRIGGER update_timetable_overrides_updated_at 
BEFORE UPDATE ON public.timetable_overrides 
FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
