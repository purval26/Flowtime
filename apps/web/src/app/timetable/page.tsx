'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { usePreferences } from '@/hooks/usePreferences';
import { Timetable, TimetableEntry, Class } from '@flowtime/types';
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  BookOpen, 
  Users, 
  Calendar, 
  Layers, 
  AlertCircle,
  Sun,
  Moon,
  Monitor,
  Instagram
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const DAYS_OF_WEEK = [
  { value: 1, name: 'Monday' },
  { value: 2, name: 'Tuesday' },
  { value: 3, name: 'Wednesday' },
  { value: 4, name: 'Thursday' },
  { value: 5, name: 'Friday' },
  { value: 6, name: 'Saturday' },
  { value: 7, name: 'Sunday' },
];

export default function WeeklyTimetablePage() {
  const router = useRouter();
  const { selectedClassId, theme, changeTheme } = usePreferences();
  const [activeDay, setActiveDay] = useState(1);
  const [viewMode, setViewMode] = useState<'tabs' | 'all'>('tabs');

  // 0. Telemetry tracking
  React.useEffect(() => {
    supabase.from('analytics_events').insert({
      event_type: 'page_view',
      platform: 'web',
      metadata: { path: '/timetable' }
    }).then();
  }, []);

  // 1. Fetch class details for title display
  const { data: selectedClass } = useQuery<Class | null>({
    queryKey: ['timetable-class-details', selectedClassId],
    queryFn: async () => {
      if (!selectedClassId) return null;
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('id', selectedClassId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!selectedClassId,
  });

  // 2. Fetch active timetable for the selected class ID
  const { data: activeTimetable, isLoading: timetableLoading } = useQuery<Timetable | null>({
    queryKey: ['weekly-active-timetable', selectedClassId],
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
    queryKey: ['weekly-timetable-entries', activeTimetable?.id],
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

  const dayEntries = entries
    .filter((entry) => entry.day_of_week === activeDay)
    .sort((a, b) => a.start_time.localeCompare(b.start_time));

  // Extract all unique start/end time boundaries
  const boundariesSet = new Set<string>();
  entries.forEach((entry) => {
    boundariesSet.add(entry.start_time.slice(0, 5));
    boundariesSet.add(entry.end_time.slice(0, 5));
  });

  const sortedBoundaries = Array.from(boundariesSet).sort();

  // Create adjacent pairs (e.g. 09:15-10:15, 10:15-11:15)
  const sortedTimeSlots: { start: string; end: string }[] = [];
  for (let i = 0; i < sortedBoundaries.length - 1; i++) {
    sortedTimeSlots.push({
      start: sortedBoundaries[i],
      end: sortedBoundaries[i + 1],
    });
  }

  const isLoading = timetableLoading || entriesLoading;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Header */}
      <header className="h-16 border-b border-border bg-surface sticky top-0 z-10">
        <div className="max-w-4xl mx-auto h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="p-2 border border-border bg-surface hover:bg-background rounded-button text-text-secondary hover:text-text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-lg font-bold text-text-primary">Weekly Timetable</h1>
          </div>

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
        </div>
      </header>

      {/* Main Content */}
      <main className={`flex-1 w-full mx-auto px-4 py-8 space-y-6 transition-all duration-300 ${viewMode === 'all' ? 'max-w-7xl' : 'max-w-4xl'}`}>
        {!selectedClassId ? (
          <div className="bg-surface border border-border rounded-card p-12 text-center max-w-md mx-auto mt-10 space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-accent-soft flex items-center justify-center text-primary-accent">
              <Layers className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-text-primary">No Class Selected</h3>
              <p className="text-xs text-text-secondary">
                Please select your class on the home dashboard first.
              </p>
            </div>
            <Link href="/" className="inline-block text-xs font-semibold text-primary-accent hover:underline">
              Go to Home Page
            </Link>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-text-secondary text-sm animate-pulse">Loading weekly schedule...</p>
          </div>
        ) : !activeTimetable ? (
          <div className="bg-surface border border-border rounded-card p-12 text-center max-w-md mx-auto mt-10 space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-text-primary">No Active Timetable Published</h3>
              <p className="text-xs text-text-secondary">
                There is no published weekly schedule for "{selectedClass?.name} (Section {selectedClass?.section})".
              </p>
            </div>
          </div>
        ) : (
          /* Weekly Grid Layout */
          <div className="space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider block">
                  Class Schedule
                </span>
                <h2 className="text-xl font-bold text-text-primary mt-0.5">
                  {selectedClass?.name} — Section {selectedClass?.section}
                </h2>
                <p className="text-xs text-text-muted mt-1">
                  Timetable: "{activeTimetable.name}" (effective from {activeTimetable.effective_from})
                </p>
              </div>

              {/* View Mode Toggle Segment */}
              <div className="flex bg-surface border border-border p-0.5 rounded-button shadow-xs self-start sm:self-auto">
                <button
                  onClick={() => setViewMode('tabs')}
                  className={`px-3 py-1.5 rounded-button text-xs font-semibold transition-colors ${
                    viewMode === 'tabs'
                      ? 'bg-primary-accent text-white shadow-xs'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Single Day
                </button>
                <button
                  onClick={() => setViewMode('all')}
                  className={`px-3 py-1.5 rounded-button text-xs font-semibold transition-colors ${
                    viewMode === 'all'
                      ? 'bg-primary-accent text-white shadow-xs'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  All Days
                </button>
              </div>
            </div>

            {viewMode === 'all' ? (
              /* ALL DAYS MATRIX TABLE VIEW */
              <div className="bg-surface border border-border shadow-sm rounded-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="border-b border-border bg-background/50">
                        <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-secondary w-[130px]">Time Slot</th>
                        {DAYS_OF_WEEK.map((day) => (
                          <th key={day.value} className="p-4 text-xs font-semibold uppercase tracking-wider text-text-secondary text-center min-w-[120px]">
                            {day.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {sortedTimeSlots.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="p-8 text-center text-text-secondary italic text-sm">
                            No classes scheduled for the entire week
                          </td>
                        </tr>
                      ) : (
                        sortedTimeSlots.map((slot) => (
                          <tr key={`${slot.start}-${slot.end}`} className="hover:bg-background/10 transition-colors">
                            <td className="p-4 text-xs font-bold text-text-primary bg-background/25">
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-text-muted" />
                                <span>{slot.start} - {slot.end}</span>
                              </div>
                            </td>
                            {DAYS_OF_WEEK.map((day) => {
                              // Filter entries matching this day and overlapping with this slot
                              const cellEntries = entries.filter((e) => {
                                const entryStart = e.start_time.slice(0, 5);
                                const entryEnd = e.end_time.slice(0, 5);
                                return (
                                  e.day_of_week === day.value &&
                                  entryStart < slot.end &&
                                  entryEnd > slot.start
                                );
                              });

                              return (
                                <td key={day.value} className="p-3 text-center align-top">
                                  <div className="space-y-2">
                                    {cellEntries.map((entry) => {
                                      const isBreak = entry.type === 'break';
                                      const isLab = entry.type === 'lab';

                                      return (
                                        <div
                                          key={entry.id}
                                          className={`mx-auto p-2.5 rounded-md border text-left max-w-[150px] shadow-xs space-y-1 ${
                                            isBreak
                                              ? 'bg-amber-50/20 border-amber-100/70 text-amber-800'
                                              : isLab
                                                ? 'bg-purple-50/20 border-purple-100/70 text-purple-800'
                                                : 'bg-blue-50/20 border-blue-100/70 text-blue-800'
                                          }`}
                                        >
                                          <div className="flex items-center justify-between gap-1 text-[8px] font-bold uppercase tracking-wide">
                                            <span>{entry.type}</span>
                                            {entry.room && <span className="truncate">📍 {entry.room.name}</span>}
                                          </div>
                                          <p className="font-semibold text-text-primary text-[11px] leading-tight truncate">
                                            {isBreak ? (entry.label || 'Break') : (entry.subject?.short_name || entry.subject?.name || 'Class')}
                                          </p>
                                          {!isBreak && entry.professor && (
                                            <p className="text-[9px] text-text-secondary truncate">
                                              👨‍🏫 {entry.professor.short_name || entry.professor.name}
                                            </p>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </td>
                              );
                            })}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* SINGLE DAY TAB VIEW */
              <div className="space-y-6">
                {/* Week Selector Tabs */}
                <div className="flex flex-wrap border-b border-border bg-surface rounded-card p-1 shadow-sm gap-1">
                  {DAYS_OF_WEEK.map((day) => (
                    <button
                      key={day.value}
                      onClick={() => setActiveDay(day.value)}
                      className={`flex-1 min-w-[90px] text-center py-2 px-3 rounded-button text-xs font-semibold tracking-wide transition-colors ${
                        activeDay === day.value
                          ? 'bg-primary-accent text-white shadow-xs'
                          : 'text-text-secondary hover:text-text-primary hover:bg-background'
                      }`}
                    >
                      {day.name}
                    </button>
                  ))}
                </div>

                {/* Day Entries */}
                <div className="bg-surface border border-border shadow-sm rounded-card overflow-hidden divide-y divide-border">
                  {dayEntries.length === 0 ? (
                    <div className="p-12 text-center text-text-secondary">
                      <p className="text-sm font-medium">No class entries scheduled for {DAYS_OF_WEEK.find((d) => d.value === activeDay)?.name}.</p>
                      <p className="text-xs text-text-muted mt-1">Enjoy the day off!</p>
                    </div>
                  ) : (
                    dayEntries.map((entry) => {
                      const isBreak = entry.type === 'break';
                      const isLab = entry.type === 'lab';

                      return (
                        <div 
                          key={entry.id} 
                          className={`p-5 transition-colors ${
                            isBreak ? 'bg-amber-50/20' : 'hover:bg-background/25'
                          }`}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-[150px_1fr_220px_150px] items-center gap-4 text-sm">
                            {/* Column 1: Time & Type Badge */}
                            <div className="flex flex-row md:flex-col items-center md:items-start gap-2 md:gap-1.5 shrink-0">
                              <span className="flex items-center gap-1 font-semibold text-text-primary">
                                <Clock className="w-4 h-4 text-text-muted shrink-0" />
                                {entry.start_time.slice(0, 5)} - {entry.end_time.slice(0, 5)}
                              </span>
                              <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                                isBreak 
                                  ? 'bg-amber-100 text-amber-800' 
                                  : isLab 
                                    ? 'bg-purple-100 text-purple-800'
                                    : 'bg-blue-100 text-blue-800'
                              }`}>
                                {entry.type}
                              </span>
                            </div>

                            {/* Column 2: Subject */}
                            <div className="min-w-0">
                              {isBreak ? (
                                <span className="font-semibold text-text-primary text-sm">
                                  {entry.label || 'Break'}
                                </span>
                              ) : (
                                entry.subject && (
                                  <div className="flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-text-muted shrink-0" />
                                    <div className="min-w-0">
                                      <p className="font-semibold text-text-primary truncate" title={entry.subject.name}>
                                        {entry.subject.name}
                                      </p>
                                      <p className="text-xs text-text-secondary">
                                        {entry.subject.code}
                                      </p>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>

                            {/* Column 3: Professor */}
                            <div className="min-w-0">
                              {!isBreak && entry.professor ? (
                                <div className="flex items-center gap-2">
                                  <Users className="w-4 h-4 text-text-muted shrink-0" />
                                  <div className="min-w-0">
                                    <p className="font-medium text-text-secondary truncate" title={entry.professor.name}>
                                      {entry.professor.name}
                                    </p>
                                    {entry.professor.short_name && (
                                      <p className="text-xs text-text-muted">
                                        ({entry.professor.short_name})
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-text-muted">-</span>
                              )}
                            </div>

                            {/* Column 4: Room */}
                            <div className="min-w-0">
                              {entry.room ? (
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 text-text-muted shrink-0" />
                                  <div className="min-w-0">
                                    <p className="font-medium text-text-secondary truncate" title={entry.room.name}>
                                      {entry.room.name}
                                    </p>
                                    {entry.room.building && (
                                      <p className="text-xs text-text-muted truncate" title={entry.room.building}>
                                        {entry.room.building}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-text-muted">-</span>
                              )}
                            </div>
                          </div>

                          {/* Notes if any */}
                          {entry.notes && (
                            <p className="text-xs text-text-muted bg-background/50 border border-border p-2 rounded-md italic mt-3">
                              {entry.notes}
                            </p>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
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
