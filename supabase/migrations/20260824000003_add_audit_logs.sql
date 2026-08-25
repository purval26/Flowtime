-- ==========================================
-- 1. Create Audit Logs Table
-- ==========================================
CREATE TABLE public.audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    target_table TEXT NOT NULL,
    target_id UUID,
    old_data JSONB,
    new_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 2. Audit Log PL/pgSQL Trigger Function
-- ==========================================
CREATE OR REPLACE FUNCTION public.process_audit_log()
RETURNS TRIGGER AS $$
DECLARE
    v_user_id UUID;
    v_target_id UUID;
    v_old_data JSONB := null;
    v_new_data JSONB := null;
BEGIN
    -- Try to resolve the authenticated Supabase user ID
    BEGIN
        v_user_id := auth.uid();
    EXCEPTION WHEN OTHERS THEN
        v_user_id := null;
    END;

    -- Extract target primary key id and data snapshots based on SQL action
    IF (TG_OP = 'DELETE') THEN
        v_target_id := OLD.id;
        v_old_data := to_jsonb(OLD);
    ELSIF (TG_OP = 'UPDATE') THEN
        v_target_id := NEW.id;
        v_old_data := to_jsonb(OLD);
        v_new_data := to_jsonb(NEW);
    ELSE -- INSERT
        v_target_id := NEW.id;
        v_new_data := to_jsonb(NEW);
    END IF;

    -- Write to audit table
    INSERT INTO public.audit_logs (
        user_id,
        action,
        target_table,
        target_id,
        old_data,
        new_data
    ) VALUES (
        v_user_id,
        TG_OP,
        TG_TABLE_NAME,
        v_target_id,
        v_old_data,
        v_new_data
    );

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 3. Row-Level Security (RLS) Policies
-- ==========================================
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Read logs only if user is staff (owner, admin, helper)
CREATE POLICY "Staff can view audit logs" ON public.audit_logs 
FOR SELECT USING (public.is_staff(auth.uid()));

-- No direct write policies (inserts are only executed by security definer trigger)

-- ==========================================
-- 4. Attach Triggers to Target Tables
-- ==========================================
CREATE TRIGGER audit_timetables_trigger 
AFTER INSERT OR UPDATE OR DELETE ON public.timetables 
FOR EACH ROW EXECUTE FUNCTION public.process_audit_log();

CREATE TRIGGER audit_timetable_entries_trigger 
AFTER INSERT OR UPDATE OR DELETE ON public.timetable_entries 
FOR EACH ROW EXECUTE FUNCTION public.process_audit_log();

CREATE TRIGGER audit_timetable_overrides_trigger 
AFTER INSERT OR UPDATE OR DELETE ON public.timetable_overrides 
FOR EACH ROW EXECUTE FUNCTION public.process_audit_log();

CREATE TRIGGER audit_classes_trigger 
AFTER INSERT OR UPDATE OR DELETE ON public.classes 
FOR EACH ROW EXECUTE FUNCTION public.process_audit_log();

CREATE TRIGGER audit_rooms_trigger 
AFTER INSERT OR UPDATE OR DELETE ON public.rooms 
FOR EACH ROW EXECUTE FUNCTION public.process_audit_log();

CREATE TRIGGER audit_subjects_trigger 
AFTER INSERT OR UPDATE OR DELETE ON public.subjects 
FOR EACH ROW EXECUTE FUNCTION public.process_audit_log();

CREATE TRIGGER audit_professors_trigger 
AFTER INSERT OR UPDATE OR DELETE ON public.professors 
FOR EACH ROW EXECUTE FUNCTION public.process_audit_log();

-- Add profile relationship helper for Client Join queries
ALTER TABLE public.audit_logs 
ADD CONSTRAINT audit_logs_user_id_profiles_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL;
