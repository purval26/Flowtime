'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Timetable, TimetableEntry, Subject, Room, Class, Professor } from '@flowtime/types';
import { TimetableOverrides } from '@/components/TimetableOverrides';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Copy, 
  X, 
  AlertCircle, 
  ArrowLeft, 
  Clock, 
  MapPin, 
  BookOpen,
  Users,
  HelpCircle
} from 'lucide-react';

const DAYS_OF_WEEK = [
  { value: 1, name: 'Monday' },
  { value: 2, name: 'Tuesday' },
  { value: 3, name: 'Wednesday' },
  { value: 4, name: 'Thursday' },
  { value: 5, name: 'Friday' },
  { value: 6, name: 'Saturday' },
  { value: 7, name: 'Sunday' },
];

interface TimetableWithClass extends Timetable {
  classes: Class;
}

interface EntryWithRelations extends TimetableEntry {
  subject: Subject | null;
  room: Room | null;
  professor: Professor | null;
}

export default function TimetableDetailPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<'weekly' | 'overrides'>('weekly');
  // Active day selection (1: Monday, 7: Sunday)
  const [activeDay, setActiveDay] = useState(1);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<EntryWithRelations | null>(null);

  // Duplication panel
  const [isDupOpen, setIsDupOpen] = useState(false);
  const [dupTargetDays, setDupTargetDays] = useState<number[]>([]);

  // Form Fields
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [entryType, setEntryType] = useState<'lecture' | 'tutorial' | 'lab' | 'break' | 'other'>('lecture');
  const [subjectId, setSubjectId] = useState('');
  const [roomId, setRoomId] = useState('');
  const [professorId, setProfessorId] = useState('');
  const [label, setLabel] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // 1. Fetch Timetable Details
  const { data: timetable, isLoading: isTimetableLoading } = useQuery<TimetableWithClass>({
    queryKey: ['timetable', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('timetables')
        .select('*, classes(*)')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as TimetableWithClass;
    },
  });

  // 2. Fetch Timetable Entries (joined with subject, room, professor)
  const { data: entries = [], isLoading: isEntriesLoading } = useQuery<EntryWithRelations[]>({
    queryKey: ['timetable-entries', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('timetable_entries')
        .select(`
          *,
          subject:subjects (*),
          room:rooms (*),
          professor:professors (*)
        `)
        .eq('timetable_id', id);
      if (error) throw error;
      return (data || []) as EntryWithRelations[];
    },
  });

  // 3. Fetch Subjects, Rooms & Professors for Select Dropdowns
  const { data: subjects = [] } = useQuery<Subject[]>({
    queryKey: ['subjects-select'],
    queryFn: async () => {
      const { data, error } = await supabase.from('subjects').select('*').order('name');
      if (error) throw error;
      return data || [];
    },
  });

  const { data: rooms = [] } = useQuery<Room[]>({
    queryKey: ['rooms-select'],
    queryFn: async () => {
      const { data, error } = await supabase.from('rooms').select('*').order('name');
      if (error) throw error;
      return data || [];
    },
  });

  const { data: professors = [] } = useQuery<Professor[]>({
    queryKey: ['professors-select'],
    queryFn: async () => {
      const { data, error } = await supabase.from('professors').select('*').order('name');
      if (error) throw error;
      return data || [];
    },
  });

  // Filter entries for the selected active day, sorted chronologically by start time
  const dayEntries = entries
    .filter((entry) => entry.day_of_week === activeDay)
    .sort((a, b) => a.start_time.localeCompare(b.start_time));

  // Open modal to add new entry
  const openAddEntryModal = () => {
    setEditingEntry(null);
    setStartTime('09:15');
    setEndTime('10:15');
    setEntryType('lecture');
    setSubjectId(subjects[0]?.id || '');
    setRoomId(rooms[0]?.id || '');
    setProfessorId('');
    setLabel('');
    setNotes('');
    setFormError(null);
    setIsEntryModalOpen(true);
  };

  // Open modal to edit existing entry
  const openEditEntryModal = (entry: EntryWithRelations) => {
    setEditingEntry(entry);
    // Format TIME HH:MM:SS to HH:MM
    setStartTime(entry.start_time.slice(0, 5));
    setEndTime(entry.end_time.slice(0, 5));
    setEntryType(entry.type);
    setSubjectId(entry.subject_id || '');
    setRoomId(entry.room_id || '');
    setProfessorId(entry.professor_id || '');
    setLabel(entry.label || '');
    setNotes(entry.notes || '');
    setFormError(null);
    setIsEntryModalOpen(true);
  };

  // Save entry mutation (create or update)
  const saveEntryMutation = useMutation({
    mutationFn: async () => {
      setFormError(null);
      if (!startTime || !endTime) {
        throw new Error('Start and End times are required.');
      }
      if (startTime >= endTime) {
        throw new Error('End time must be after start time.');
      }
      if (entryType !== 'break' && entryType !== 'other' && !subjectId) {
        throw new Error('A subject must be selected for lectures, labs, and tutorials.');
      }

      const payload = {
        timetable_id: id,
        day_of_week: activeDay,
        start_time: startTime + ':00',
        end_time: endTime + ':00',
        type: entryType,
        subject_id: (entryType === 'break' || entryType === 'other') ? null : (subjectId || null),
        room_id: roomId || null,
        professor_id: (entryType === 'break' || entryType === 'other') ? null : (professorId || null),
        label: label || null,
        notes: notes || null,
      };

      if (editingEntry) {
        const { error } = await supabase
          .from('timetable_entries')
          .update(payload)
          .eq('id', editingEntry.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('timetable_entries')
          .insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetable-entries', id] });
      setIsEntryModalOpen(false);
    },
    onError: (err: any) => {
      setFormError(err.message || 'An error occurred while saving the entry.');
    },
  });

  // Delete entry mutation
  const deleteEntryMutation = useMutation({
    mutationFn: async (entryId: string) => {
      const confirmDelete = window.confirm('Are you sure you want to delete this class schedule entry?');
      if (!confirmDelete) return;

      const { error } = await supabase
        .from('timetable_entries')
        .delete()
        .eq('id', entryId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetable-entries', id] });
    },
    onError: (err: any) => {
      alert(err.message || 'Failed to delete schedule entry.');
    },
  });

  // Duplicate active day to other selected target days
  const duplicateDayMutation = useMutation({
    mutationFn: async () => {
      if (dupTargetDays.length === 0) {
        throw new Error('Please select at least one day to copy to.');
      }
      if (dayEntries.length === 0) {
        throw new Error('The current day has no entries to duplicate.');
      }

      const confirmCopy = window.confirm(
        `This will copy all ${dayEntries.length} entries of this day to the selected days. Existing entries on those days will NOT be deleted. Proceed?`
      );
      if (!confirmCopy) return;

      // Map entries to new target days
      const newEntries: any[] = [];
      dupTargetDays.forEach((targetDay) => {
        dayEntries.forEach((entry) => {
          newEntries.push({
            timetable_id: id,
            day_of_week: targetDay,
            start_time: entry.start_time,
            end_time: entry.end_time,
            type: entry.type,
            subject_id: entry.subject_id,
            room_id: entry.room_id,
            professor_id: entry.professor_id,
            label: entry.label,
            notes: entry.notes,
          });
        });
      });

      const { error } = await supabase
        .from('timetable_entries')
        .insert(newEntries);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetable-entries', id] });
      setIsDupOpen(false);
      setDupTargetDays([]);
      alert('Day schedule duplicated successfully!');
    },
    onError: (err: any) => {
      alert(err.message || 'Failed to duplicate day.');
    },
  });

  const toggleTargetDay = (dayVal: number) => {
    setDupTargetDays((prev) =>
      prev.includes(dayVal)
        ? prev.filter((d) => d !== dayVal)
        : [...prev, dayVal]
    );
  };

  if (isTimetableLoading || isEntriesLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-text-secondary text-sm animate-pulse">Loading timetable builder...</p>
      </div>
    );
  }

  if (!timetable) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-danger bg-danger-soft border border-danger/10 p-4 rounded-card">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-semibold">Timetable not found.</p>
        </div>
        <button onClick={() => router.push('/admin/timetables')} className="text-sm text-primary-accent hover:underline">
          Go back to timetables list
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button & Timetable Info */}
      <div className="flex items-start gap-4">
        <button
          onClick={() => router.push('/admin/timetables')}
          className="p-2 border border-border bg-surface hover:bg-background rounded-button text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-semibold tracking-tight text-text-primary">{timetable.name}</h1>
            {timetable.is_active ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-success-soft text-success border border-success/15">
                Active
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-background text-text-secondary border border-border">
                Draft
              </span>
            )}
          </div>
          <p className="text-sm text-text-secondary font-medium">
            Class Section: {timetable.classes ? `${timetable.classes.name} (Section ${timetable.classes.section})` : 'Unassigned'}
          </p>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-border gap-6">
        <button
          onClick={() => setActiveTab('weekly')}
          className={`pb-3 px-1 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'weekly'
              ? 'border-primary-accent text-primary-accent'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          Weekly Schedule
        </button>
        <button
          onClick={() => setActiveTab('overrides')}
          className={`pb-3 px-1 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'overrides'
              ? 'border-primary-accent text-primary-accent'
              : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          Date Overrides & Adjustments
        </button>
      </div>

      {activeTab === 'weekly' ? (
        <>
          {/* Week Selector Tabs */}
          <div className="flex flex-wrap border-b border-border bg-surface rounded-card p-1 shadow-sm gap-1">
        {DAYS_OF_WEEK.map((day) => (
          <button
            key={day.value}
            onClick={() => { setActiveDay(day.value); setIsDupOpen(false); }}
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

      {/* Day Actions & Entries List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Entries (Left/Middle 2 Columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-text-primary">
              Schedule for {DAYS_OF_WEEK.find((d) => d.value === activeDay)?.name}
            </h3>
            <button
              onClick={openAddEntryModal}
              className="inline-flex items-center gap-1.5 rounded-button bg-primary-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-accent/90 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Entry
            </button>
          </div>

          <div className="bg-surface border border-border shadow-sm rounded-card overflow-hidden divide-y divide-border">
            {dayEntries.length === 0 ? (
              <div className="p-12 text-center text-text-secondary">
                <p className="text-sm font-medium">No class entries scheduled for this day.</p>
                <p className="text-xs text-text-muted mt-1">Use the "Add Entry" button to insert a lecture, lab, or break.</p>
              </div>
            ) : (
              dayEntries.map((entry) => {
                const isBreak = entry.type === 'break';
                const isLab = entry.type === 'lab';
                
                return (
                  <div 
                    key={entry.id} 
                    className={`p-6 flex items-start justify-between gap-4 transition-colors ${
                      isBreak ? 'bg-amber-50/20' : 'hover:bg-background/25'
                    }`}
                  >
                    <div className="space-y-2 flex-1 min-w-0">
                      {/* Badge / Type */}
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          isBreak 
                            ? 'bg-amber-100 text-amber-800' 
                            : isLab 
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                        }`}>
                          {entry.type}
                        </span>
                        {entry.label && (
                          <span className="text-sm font-semibold text-text-primary truncate">
                            {entry.label}
                          </span>
                        )}
                      </div>

                      {/* Main Entry Info */}
                      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-6 text-sm text-text-secondary">
                        <span className="flex items-center gap-1 font-semibold text-text-primary">
                          <Clock className="w-4 h-4 text-text-muted" />
                          {entry.start_time.slice(0, 5)} - {entry.end_time.slice(0, 5)}
                        </span>
                        
                        {!isBreak && entry.subject && (
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4 text-text-muted" />
                            {entry.subject.name} ({entry.subject.code})
                          </span>
                        )}

                        {!isBreak && entry.professor && (
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-text-muted" />
                            {entry.professor.name}
                            {entry.professor.short_name && ` (${entry.professor.short_name})`}
                          </span>
                        )}

                        {entry.room && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-text-muted" />
                            {entry.room.name}
                            {entry.room.building && ` (${entry.room.building})`}
                          </span>
                        )}
                      </div>

                      {/* Notes */}
                      {entry.notes && (
                        <p className="text-xs text-text-muted bg-background/50 border border-border p-2 rounded-md italic">
                          {entry.notes}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 self-start">
                      <button
                        onClick={() => openEditEntryModal(entry)}
                        className="p-1.5 text-text-secondary hover:text-primary-accent hover:bg-accent-soft rounded transition-colors"
                        title="Edit Entry"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteEntryMutation.mutate(entry.id)}
                        className="p-1.5 text-text-secondary hover:text-danger hover:bg-danger-soft rounded transition-colors"
                        title="Delete Entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Duplication Tools (Right Column) */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-text-primary">Duplication Tools</h3>
          
          <div className="bg-surface border border-border shadow-sm rounded-card p-6 space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-text-primary flex items-center gap-1.5">
                <Copy className="w-4 h-4 text-primary-accent" />
                Duplicate Day Schedule
              </h4>
              <p className="text-xs text-text-secondary mt-1">
                Easily copy this day's schedule entries to another day in the timetable.
              </p>
            </div>

            {dayEntries.length === 0 ? (
              <div className="p-4 bg-background text-center rounded-button text-xs text-text-muted italic border border-dashed border-border">
                Add entries to this day before duplicating.
              </div>
            ) : !isDupOpen ? (
              <button
                onClick={() => setIsDupOpen(true)}
                className="w-full text-center rounded-button border border-border bg-surface py-2 text-xs font-semibold text-text-primary hover:bg-background transition-colors"
              >
                Configure Copy Destinations
              </button>
            ) : (
              <div className="space-y-4 pt-2 border-t border-border">
                <div className="space-y-2">
                  <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider block">
                    Select Target Days:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {DAYS_OF_WEEK.filter((d) => d.value !== activeDay).map((day) => (
                      <button
                        key={day.value}
                        type="button"
                        onClick={() => toggleTargetDay(day.value)}
                        className={`text-left px-3 py-1.5 rounded-button text-xs font-medium border transition-colors ${
                          dupTargetDays.includes(day.value)
                            ? 'bg-accent-soft border-primary-accent text-primary-accent'
                            : 'border-border bg-surface text-text-secondary hover:bg-background'
                        }`}
                      >
                        {day.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => duplicateDayMutation.mutate()}
                    disabled={duplicateDayMutation.isPending || dupTargetDays.length === 0}
                    className="flex-1 rounded-button bg-primary-accent py-2 text-xs font-semibold text-white hover:bg-primary-accent/90 disabled:opacity-50 transition-colors"
                  >
                    {duplicateDayMutation.isPending ? 'Copying...' : `Copy entries to ${dupTargetDays.length} days`}
                  </button>
                  <button
                    onClick={() => { setIsDupOpen(false); setDupTargetDays([]); }}
                    className="rounded-button border border-border bg-surface px-3 py-2 text-xs font-semibold text-text-secondary hover:bg-background"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Entry Modal */}
      {isEntryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-surface border border-border shadow-xl rounded-card w-full max-w-md overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-text-primary">
                {editingEntry ? 'Edit Schedule Entry' : 'Add Schedule Entry'}
              </h3>
              <button
                onClick={() => setIsEntryModalOpen(false)}
                className="p-1 rounded-full text-text-secondary hover:bg-background transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form 
              onSubmit={(e) => { e.preventDefault(); saveEntryMutation.mutate(); }}
              className="p-6 space-y-4"
            >
              {formError && (
                <div className="bg-danger-soft border border-danger/10 text-danger text-sm rounded-md p-3 font-medium">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="block w-full rounded-md border border-border bg-background px-3 py-2 text-text-primary shadow-sm focus:border-primary-accent focus:outline-none focus:ring-1 focus:ring-primary-accent sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="block w-full rounded-md border border-border bg-background px-3 py-2 text-text-primary shadow-sm focus:border-primary-accent focus:outline-none focus:ring-1 focus:ring-primary-accent sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                  Entry Type
                </label>
                <select
                  value={entryType}
                  onChange={(e: any) => setEntryType(e.target.value)}
                  className="block w-full rounded-md border border-border bg-background px-3 py-2 text-text-primary shadow-sm focus:border-primary-accent focus:outline-none focus:ring-1 focus:ring-primary-accent sm:text-sm"
                >
                  <option value="lecture">Lecture</option>
                  <option value="tutorial">Tutorial</option>
                  <option value="lab">Lab / Practical</option>
                  <option value="break">Break</option>
                  <option value="other">Other / Guest Event</option>
                </select>
              </div>

              {(entryType !== 'break' && entryType !== 'other') && (
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                    Course Subject
                  </label>
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="block w-full rounded-md border border-border bg-background px-3 py-2 text-text-primary shadow-sm focus:border-primary-accent focus:outline-none focus:ring-1 focus:ring-primary-accent sm:text-sm"
                  >
                    <option value="">Select subject...</option>
                    {subjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name} ({sub.code})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                  Classroom / Room Location
                </label>
                <select
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="block w-full rounded-md border border-border bg-background px-3 py-2 text-text-primary shadow-sm focus:border-primary-accent focus:outline-none focus:ring-1 focus:ring-primary-accent sm:text-sm"
                >
                  <option value="">Select room (Optional)...</option>
                  {rooms.map((rm) => (
                    <option key={rm.id} value={rm.id}>
                      {rm.name} {rm.building && ` - ${rm.building}`}
                    </option>
                  ))}
                </select>
              </div>

              {(entryType !== 'break' && entryType !== 'other') && (
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                    Assigned Professor
                  </label>
                  <select
                    value={professorId}
                    onChange={(e) => setProfessorId(e.target.value)}
                    className="block w-full rounded-md border border-border bg-background px-3 py-2 text-text-primary shadow-sm focus:border-primary-accent focus:outline-none focus:ring-1 focus:ring-primary-accent sm:text-sm"
                  >
                    <option value="">No professor (Optional)...</option>
                    {professors.map((prof) => (
                      <option key={prof.id} value={prof.id}>
                        {prof.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                  Custom Label / Event Name (Optional)
                </label>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder={entryType === 'break' ? 'e.g. Lunch Break, Recess' : 'e.g. Guest Seminar'}
                  className="block w-full rounded-md border border-border bg-background px-3 py-2 text-text-primary shadow-sm focus:border-primary-accent focus:outline-none focus:ring-1 focus:ring-primary-accent sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="e.g. Submitting assignment, bring laptop"
                  className="block w-full rounded-md border border-border bg-background px-3 py-2 text-text-primary shadow-sm focus:border-primary-accent focus:outline-none focus:ring-1 focus:ring-primary-accent sm:text-sm resize-none"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-border mt-6">
                <button
                  type="button"
                  onClick={() => setIsEntryModalOpen(false)}
                  className="rounded-button border border-border bg-surface px-4 py-2 text-sm font-semibold text-text-primary hover:bg-background transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveEntryMutation.isPending}
                  className="rounded-button bg-primary-accent px-4 py-2 text-sm font-semibold text-white hover:bg-primary-accent/90 disabled:opacity-50 transition-colors"
                >
                  {saveEntryMutation.isPending ? 'Saving...' : 'Save Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
        </>
      ) : (
        <TimetableOverrides timetableId={id} />
      )}
    </div>
  );
}
