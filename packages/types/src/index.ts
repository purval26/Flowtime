export type TimetableEntryType = 'lecture' | 'tutorial' | 'lab' | 'break' | 'other';

export type ClassStatus = 'UPCOMING' | 'CURRENT' | 'COMPLETED' | 'BREAK' | 'NO_CLASS';

export interface Profile {
  id: string; // references auth.users
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  name: 'owner' | 'admin' | 'editor' | 'user';
  description: string | null;
  created_at: string;
}

export interface UserRole {
  user_id: string;
  role_id: string;
}

export interface Class {
  id: string;
  name: string;
  academic_year: string;
  section: string;
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: string;
  name: string;
  short_name: string;
  code: string;
  created_at: string;
  updated_at: string;
}

export interface Room {
  id: string;
  name: string;
  building: string | null;
  created_at: string;
  updated_at: string;
}

export interface Professor {
  id: string;
  name: string;
  short_name: string | null;
  email: string | null;
  created_at: string;
  updated_at: string;
}

export interface Timetable {
  id: string;
  class_id: string;
  name: string;
  effective_from: string; // ISO date string (YYYY-MM-DD)
  effective_until: string | null; // ISO date string (YYYY-MM-DD)
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TimetableEntry {
  id: string;
  timetable_id: string;
  day_of_week: number; // 1 (Monday) to 7 (Sunday)
  start_time: string; // time string (HH:MM:SS)
  end_time: string; // time string (HH:MM:SS)
  subject_id: string | null;
  room_id: string | null;
  professor_id: string | null;
  type: TimetableEntryType;
  label: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;

  // Joined properties (often fetched from DB for UI convenience)
  subject?: Subject | null;
  room?: Room | null;
  professor?: Professor | null;
}

export interface TimetableOverride {
  id: string;
  timetable_id: string;
  override_date: string; // YYYY-MM-DD
  start_time: string; // HH:MM:SS
  end_time: string; // HH:MM:SS
  type: TimetableEntryType;
  subject_id: string | null;
  room_id: string | null;
  professor_id: string | null;
  label: string | null;
  notes: string | null;
  is_cancelled: boolean;
  created_at: string;
  updated_at: string;

  // Joined properties
  subject?: Subject | null;
  room?: Room | null;
  professor?: Professor | null;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: 'INSERT' | 'UPDATE' | 'DELETE';
  target_table: string;
  target_id: string | null;
  old_data: Record<string, any> | null;
  new_data: Record<string, any> | null;
  created_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  class_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;

  // Joined properties
  class?: Class | null;
}

export interface AnalyticsEvent {
  id: string;
  event_type: 'page_view' | 'class_selected' | 'theme_toggled';
  platform: 'web' | 'mobile';
  metadata: Record<string, any>;
  created_at: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  selectedClassId: string | null;
}
