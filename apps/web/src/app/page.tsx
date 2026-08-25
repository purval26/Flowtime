'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { usePreferences } from '@/hooks/usePreferences';
import { useRealtimeAnnouncements } from '@/hooks/useRealtimeAnnouncements';
import StudentDashboard from '@/components/StudentDashboard';
import { Class, Timetable, TimetableEntry, TimetableOverride, Announcement } from '@flowtime/types';
import { resolveScheduleForDate } from '@flowtime/timetable-core';
import { Layers, AlertCircle, Calendar, Sun, Moon, Monitor, Instagram, Megaphone, Globe } from 'lucide-react';
import Link from 'next/link';

export default function StudentHomePage() {
  const { selectedClassId, changeClassId, theme, changeTheme, loading: prefLoading } = usePreferences();

  // 0. Telemetry tracking
  React.useEffect(() => {
    supabase.from('analytics_events').insert({
      event_type: 'page_view',
      platform: 'web',
      metadata: { path: '/' }
    }).then();
  }, []);

  React.useEffect(() => {
    if (selectedClassId) {
      supabase.from('analytics_events').insert({
        event_type: 'class_selected',
        platform: 'web',
        metadata: { class_id: selectedClassId }
      }).then();
    }
  }, [selectedClassId]);

  // 1. Fetch all classes for the selector dropdown
  const { data: classes = [], isLoading: classesLoading } = useQuery<Class[]>({
    queryKey: ['student-classes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('name', { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });

  // 2. Fetch the active timetable for the selected class ID
  const { data: activeTimetable, isLoading: timetableLoading } = useQuery<Timetable | null>({
    queryKey: ['active-timetable', selectedClassId],
    queryFn: async () => {
      if (!selectedClassId) return null;
      const { data, error } = await supabase
        .from('timetables')
        .select('*')
        .eq('class_id', selectedClassId)
        .eq('is_active', true);
        
      if (error) throw error;
      return data && data.length > 0 ? data[0] : null;
    },
    enabled: !!selectedClassId,
  });

  // 3. Fetch all entries for that active timetable
  const { data: entries = [], isLoading: entriesLoading } = useQuery<TimetableEntry[]>({
    queryKey: ['active-timetable-entries', activeTimetable?.id],
    queryFn: async () => {
      if (!activeTimetable?.id) return [];
      const { data, error } = await supabase
        .from('timetable_entries')
        .select(`
          *,
          subject:subjects (*),
          room:rooms (*),
          professor:professors (*)
        `)
        .eq('timetable_id', activeTimetable.id);

      if (error) throw error;
      return (data || []) as any[];
    },
    enabled: !!activeTimetable?.id,
  });

  // 4. Fetch overrides for that active timetable on today's date
  const todayDateStr = new Date().toLocaleDateString('en-CA');

  const { data: overrides = [], isLoading: overridesLoading } = useQuery<TimetableOverride[]>({
    queryKey: ['active-timetable-overrides', activeTimetable?.id, todayDateStr],
    queryFn: async () => {
      if (!activeTimetable?.id) return [];
      const { data, error } = await supabase
        .from('timetable_overrides')
        .select(`
          *,
          subject:subjects (*),
          room:rooms (*),
          professor:professors (*)
        `)
        .eq('timetable_id', activeTimetable.id)
        .eq('override_date', todayDateStr);

      if (error) throw error;
      return (data || []) as any[];
    },
    enabled: !!activeTimetable?.id,
  });

  // Enable real-time updates for announcements
  useRealtimeAnnouncements();

  // Query: Fetch announcements (global or for selected class)
  const { data: announcements = [] } = useQuery<Announcement[]>({
    queryKey: ['announcements', selectedClassId],
    queryFn: async () => {
      let query = supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (selectedClassId) {
        query = query.or(`class_id.is.null,class_id.eq.${selectedClassId}`);
      } else {
        query = query.is('class_id', null);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as Announcement[];
    },
  });

  const todayDayOfWeek = new Date().getDay() === 0 ? 7 : new Date().getDay();
  const resolvedEntries = resolveScheduleForDate(entries, overrides, todayDayOfWeek);

  const selectedClassDetails = classes.find((c) => c.id === selectedClassId);

  const globalLoading = prefLoading || classesLoading || timetableLoading || entriesLoading || overridesLoading;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Header */}
      <header className="h-16 border-b border-border bg-surface sticky top-0 z-10">
        <div className="max-w-4xl mx-auto h-full px-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold tracking-tight text-text-primary">
            Flowtime
          </Link>
          <div className="flex items-center gap-4">
            {/* Class Selector Dropdown */}
            {!classesLoading && classes.length > 0 && (
              <div className="flex items-center gap-1 bg-background border border-border rounded-button px-2 py-1">
                <Layers className="w-3.5 h-3.5 text-text-secondary" />
                <select
                  value={selectedClassId || ''}
                  onChange={(e) => changeClassId(e.target.value || null)}
                  className="bg-transparent text-xs font-semibold text-text-primary focus:outline-none pr-1 cursor-pointer"
                >
                  <option value="">Select your class...</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} - {cls.section}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {/* Theme Toggle Button */}
            <button
              onClick={() => {
                if (theme === 'light') changeTheme('dark');
                else if (theme === 'dark') changeTheme('system');
                else changeTheme('light');
              }}
              className="p-2 border border-border bg-surface hover:bg-background rounded-button text-text-secondary hover:text-text-primary transition-colors flex items-center justify-center cursor-pointer"
              title={`Theme: ${theme} (Click to toggle)`}
            >
              {theme === 'light' && <Sun className="w-4.5 h-4.5" />}
              {theme === 'dark' && <Moon className="w-4.5 h-4.5" />}
              {theme === 'system' && <Monitor className="w-4.5 h-4.5" />}
            </button>

            <Link 
              href="/admin" 
              className="text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors border border-border px-3 py-1.5 rounded-button bg-surface"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        {/* Announcements Notice Board */}
        {announcements.length > 0 && (
          <div className="mb-8 space-y-3">
            <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5 px-1">
              <Megaphone className="w-4 h-4 text-primary-accent" />
              Notices & Announcements
            </h2>
            <div className="space-y-3">
              {announcements.slice(0, 3).map((item) => {
                const isNew = new Date().getTime() - new Date(item.created_at).getTime() < 24 * 60 * 60 * 1000;
                const isGlobal = !item.class_id;
                return (
                  <div
                    key={item.id}
                    className="bg-surface border border-border p-4 rounded-card shadow-xs transition-shadow hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {isGlobal ? (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-[9px] font-extrabold uppercase tracking-wide">
                              <Globe className="w-2.5 h-2.5" />
                              Global Broadcast
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 text-[9px] font-extrabold uppercase tracking-wide">
                              Class Notice
                            </span>
                          )}
                          {isNew && (
                            <span className="px-1.5 py-0.5 rounded bg-success-soft text-success text-[9px] font-extrabold uppercase tracking-wide animate-pulse">
                              New
                            </span>
                          )}
                          <span className="text-[10px] text-text-secondary">
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="font-semibold text-text-primary text-sm leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-xs text-text-secondary whitespace-pre-wrap leading-relaxed">
                          {item.content}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {globalLoading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-text-secondary text-sm animate-pulse">Loading schedule...</p>
          </div>
        ) : !selectedClassId ? (
          /* Empty State: Select Class */
          <div className="bg-surface border border-border rounded-card p-12 text-center max-w-md mx-auto mt-10 space-y-6">
            <div className="mx-auto w-12 h-12 rounded-full bg-accent-soft flex items-center justify-center text-primary-accent">
              <Layers className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-text-primary">Select Your Academic Class</h3>
              <p className="text-xs text-text-secondary">
                Choose your department division and section division in the top header dropdown to load your schedule.
              </p>
            </div>
          </div>
        ) : !activeTimetable ? (
          /* Empty State: No Active Timetable */
          <div className="bg-surface border border-border rounded-card p-12 text-center max-w-md mx-auto mt-10 space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-text-primary">No Active Timetable</h3>
              <p className="text-xs text-text-secondary">
                There is currently no active timetable published for "{selectedClassDetails?.name} (Section {selectedClassDetails?.section})".
              </p>
            </div>
            <p className="text-[10px] text-text-muted">
              Contact an administrator to publish the timetable settings.
            </p>
          </div>
        ) : (
          /* Student Schedule Dashboard */
          <StudentDashboard entries={resolvedEntries} className={selectedClassDetails?.name || ''} />
        )}
      </main>
      
      <footer className="py-6 text-center text-xs text-text-secondary flex items-center justify-center gap-1.5 border-t border-border mt-auto">
        <span>Made with ❤️ by</span>
        <a 
          href="https://instagram.com/rntxpurval" 
          target="_blank" 
          rel="noopener noreferrer"
          className="font-semibold text-primary-accent hover:underline flex items-center gap-1"
        >
          <Instagram className="w-3.5 h-3.5" />
          Purval
        </a>
      </footer>
    </div>
  );
}
