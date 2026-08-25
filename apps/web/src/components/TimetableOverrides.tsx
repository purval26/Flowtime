import React, { useState } from 'react';
import { Plus, Trash2, Calendar, Clock, MapPin, Users, BookOpen, AlertCircle, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { TimetableOverride, Subject, Room, Professor } from '@flowtime/types';

interface TimetableOverridesProps {
  timetableId: string;
}

interface OverrideWithRelations extends TimetableOverride {
  subject: Subject | null;
  room: Room | null;
  professor: Professor | null;
}

export function TimetableOverrides({ timetableId }: TimetableOverridesProps) {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form Fields
  const [overrideDate, setOverrideDate] = useState('');
  const [startTime, setStartTime] = useState('09:15');
  const [endTime, setEndTime] = useState('10:15');
  const [entryType, setEntryType] = useState<'lecture' | 'tutorial' | 'lab' | 'break' | 'other'>('lecture');
  const [subjectId, setSubjectId] = useState('');
  const [roomId, setRoomId] = useState('');
  const [professorId, setProfessorId] = useState('');
  const [isCancelled, setIsCancelled] = useState(false);
  const [label, setLabel] = useState('');
  const [notes, setNotes] = useState('');

  // 1. Fetch Overrides
  const { data: overrides = [], isLoading } = useQuery<OverrideWithRelations[]>({
    queryKey: ['timetable-overrides', timetableId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('timetable_overrides')
        .select(`
          *,
          subject:subjects (*),
          room:rooms (*),
          professor:professors (*)
        `)
        .eq('timetable_id', timetableId)
        .order('override_date', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) throw error;
      return (data || []) as OverrideWithRelations[];
    },
  });

  // 2. Fetch Dropdowns
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

  // 3. Open Modal Handler
  const openAddModal = () => {
    setOverrideDate('');
    setStartTime('09:15');
    setEndTime('10:15');
    setEntryType('lecture');
    setSubjectId(subjects[0]?.id || '');
    setRoomId(rooms[0]?.id || '');
    setProfessorId(professors[0]?.id || '');
    setIsCancelled(false);
    setLabel('');
    setNotes('');
    setFormError(null);
    setIsModalOpen(true);
  };

  // 4. Save Override Mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      setFormError(null);
      if (!overrideDate) {
        throw new Error('Please select a calendar date.');
      }
      if (!startTime || !endTime) {
        throw new Error('Please input start and end times.');
      }

      const payload = {
        timetable_id: timetableId,
        override_date: overrideDate,
        start_time: startTime + ':00',
        end_time: endTime + ':00',
        type: entryType,
        is_cancelled: isCancelled,
        subject_id: (!isCancelled && entryType !== 'break') ? (subjectId || null) : null,
        room_id: (!isCancelled && entryType !== 'break') ? (roomId || null) : null,
        professor_id: (!isCancelled && entryType !== 'break') ? (professorId || null) : null,
        label: label || null,
        notes: notes || null,
      };

      const { error } = await supabase.from('timetable_overrides').insert([payload]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetable-overrides', timetableId] });
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      setFormError(err.message || 'Failed to create override.');
    },
  });

  // 5. Delete Override Mutation
  const deleteMutation = useMutation({
    mutationFn: async (overrideId: string) => {
      const confirmDelete = window.confirm('Are you sure you want to delete this schedule override?');
      if (!confirmDelete) return;

      const { error } = await supabase.from('timetable_overrides').delete().eq('id', overrideId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetable-overrides', timetableId] });
    },
    onError: (err: any) => {
      alert(err.message || 'Failed to delete override.');
    },
  });

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Temporary Schedule Overrides</h3>
          <p className="text-xs text-text-secondary mt-1">
            Reschedule, replace, or cancel class blocks for specific calendar dates.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-button bg-primary-accent px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-accent/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Override
        </button>
      </div>

      {/* Overrides Table */}
      <div className="bg-surface border border-border shadow-sm rounded-card overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-text-secondary text-sm animate-pulse">
            Loading temporary adjustments...
          </div>
        ) : overrides.length === 0 ? (
          <div className="p-12 text-center text-text-secondary">
            <p className="text-sm font-medium">No temporary overrides registered.</p>
            <p className="text-xs text-text-muted mt-1">
              Add one above to override the weekly repeating schedule for a specific date.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-background/50">
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">Date</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">Time Slot</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">Adjustment Details</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-secondary text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {overrides.map((ov) => (
                  <tr key={ov.id} className="hover:bg-background/25 transition-colors align-top">
                    {/* Date column */}
                    <td className="p-4 text-sm font-semibold text-text-primary">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-text-muted" />
                        <span>{new Date(ov.override_date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </td>

                    {/* Time Slot column */}
                    <td className="p-4 text-sm font-semibold text-text-primary">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-text-muted" />
                        <span>{ov.start_time.slice(0, 5)} - {ov.end_time.slice(0, 5)}</span>
                      </div>
                    </td>

                    {/* Adjustment column */}
                    <td className="p-4 text-sm space-y-1">
                      {ov.is_cancelled ? (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-danger-soft text-danger">
                          Cancelled / Free Period
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              ov.type === 'break' 
                                ? 'bg-amber-100 text-amber-800' 
                                : ov.type === 'lab' 
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-blue-100 text-blue-800'
                            }`}>
                              {ov.type}
                            </span>
                            {ov.label && <span className="font-semibold text-text-primary">{ov.label}</span>}
                          </div>

                          <div className="flex flex-col gap-1 text-xs text-text-secondary">
                            {ov.subject && (
                              <span className="flex items-center gap-1">
                                <BookOpen className="w-3.5 h-3.5 text-text-muted" />
                                {ov.subject.name} ({ov.subject.code})
                              </span>
                            )}
                            {ov.professor && (
                              <span className="flex items-center gap-1">
                                <Users className="w-3.5 h-3.5 text-text-muted" />
                                {ov.professor.name} {ov.professor.short_name && `(${ov.professor.short_name})`}
                              </span>
                            )}
                            {ov.room && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-text-muted" />
                                {ov.room.name} {ov.room.building && `(${ov.room.building})`}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      {ov.notes && (
                        <p className="text-xs text-text-muted bg-background/50 border border-border p-1.5 rounded italic max-w-sm mt-1">
                          {ov.notes}
                        </p>
                      )}
                    </td>

                    {/* Actions column */}
                    <td className="p-4 text-sm text-right">
                      <button
                        onClick={() => deleteMutation.mutate(ov.id)}
                        className="inline-flex items-center p-1.5 text-text-secondary hover:text-danger hover:bg-danger-soft rounded transition-colors"
                        title="Remove Override"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-surface border border-border shadow-xl rounded-card w-full max-w-md overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-text-primary">Add Schedule Override</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-text-secondary hover:bg-background transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }}
              className="p-6 space-y-4 max-h-[75vh] overflow-y-auto"
            >
              {formError && (
                <div className="bg-danger-soft border border-danger/10 text-danger text-sm rounded-md p-3 font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Date Input */}
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                  Calendar Date
                </label>
                <input
                  type="date"
                  required
                  value={overrideDate}
                  onChange={(e) => setOverrideDate(e.target.value)}
                  className="block w-full rounded-md border border-border bg-background px-3 py-2 text-text-primary shadow-sm focus:border-primary-accent focus:outline-none focus:ring-1 focus:ring-primary-accent sm:text-sm"
                />
              </div>

              {/* Times */}
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

              {/* Cancel Switch */}
              <div className="flex items-center gap-2 py-2 border-y border-border">
                <input
                  type="checkbox"
                  id="isCancelled"
                  checked={isCancelled}
                  onChange={(e) => setIsCancelled(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary-accent focus:ring-primary-accent"
                />
                <label htmlFor="isCancelled" className="text-sm font-semibold text-text-primary cursor-pointer select-none">
                  Cancel all classes during this time slot
                </label>
              </div>

              {!isCancelled && (
                <>
                  {/* Type Select */}
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                      Session Type
                    </label>
                    <select
                      value={entryType}
                      onChange={(e) => setEntryType(e.target.value as any)}
                      className="block w-full rounded-md border border-border bg-background px-3 py-2 text-text-primary shadow-sm focus:border-primary-accent focus:outline-none focus:ring-1 focus:ring-primary-accent sm:text-sm"
                    >
                      <option value="lecture">Lecture</option>
                      <option value="tutorial">Tutorial</option>
                      <option value="lab">Lab Session</option>
                      <option value="break">Break</option>
                      <option value="other">Other Event</option>
                    </select>
                  </div>

                  {entryType !== 'break' && (
                    <>
                      {/* Subject Selection */}
                      <div>
                        <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                          Subject
                        </label>
                        <select
                          value={subjectId}
                          onChange={(e) => setSubjectId(e.target.value)}
                          className="block w-full rounded-md border border-border bg-background px-3 py-2 text-text-primary shadow-sm focus:border-primary-accent focus:outline-none focus:ring-1 focus:ring-primary-accent sm:text-sm"
                        >
                          <option value="">-- Select Subject --</option>
                          {subjects.map((sub) => (
                            <option key={sub.id} value={sub.id}>
                              {sub.name} ({sub.code})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Professor Selection */}
                      <div>
                        <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                          Professor / Faculty
                        </label>
                        <select
                          value={professorId}
                          onChange={(e) => setProfessorId(e.target.value)}
                          className="block w-full rounded-md border border-border bg-background px-3 py-2 text-text-primary shadow-sm focus:border-primary-accent focus:outline-none focus:ring-1 focus:ring-primary-accent sm:text-sm"
                        >
                          <option value="">-- Select Faculty --</option>
                          {professors.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} {p.short_name && `(${p.short_name})`}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Room Selection */}
                      <div>
                        <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                          Room / Location
                        </label>
                        <select
                          value={roomId}
                          onChange={(e) => setRoomId(e.target.value)}
                          className="block w-full rounded-md border border-border bg-background px-3 py-2 text-text-primary shadow-sm focus:border-primary-accent focus:outline-none focus:ring-1 focus:ring-primary-accent sm:text-sm"
                        >
                          <option value="">-- Select Room --</option>
                          {rooms.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.name} {r.building && `(${r.building})`}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}
                </>
              )}

              {/* Label Field */}
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                  Display Label (Optional)
                </label>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="e.g. Special Guest Seminar"
                  className="block w-full rounded-md border border-border bg-background px-3 py-2 text-text-primary shadow-sm focus:border-primary-accent focus:outline-none focus:ring-1 focus:ring-primary-accent sm:text-sm"
                />
              </div>

              {/* Notes Field */}
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Rescheduled from next week due to holiday."
                  className="block w-full rounded-md border border-border bg-background px-3 py-2 text-text-primary shadow-sm focus:border-primary-accent focus:outline-none focus:ring-1 focus:ring-primary-accent sm:text-sm"
                />
              </div>

              {/* Actions Footer */}
              <div className="flex gap-3 justify-end pt-4 border-t border-border mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-button border border-border bg-surface px-4 py-2 text-sm font-semibold text-text-primary hover:bg-background transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="rounded-button bg-primary-accent px-4 py-2 text-sm font-semibold text-white hover:bg-primary-accent/90 disabled:opacity-50 transition-colors"
                >
                  {saveMutation.isPending ? 'Saving...' : 'Add Override'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
