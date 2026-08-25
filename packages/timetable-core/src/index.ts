import { TimetableEntry, TimetableOverride, ClassStatus } from '@flowtime/types';

/**
 * Converts a time string (e.g., "11:15:00" or "11:15") to minutes since midnight.
 */
export function timeStringToMinutes(timeStr: string): number {
  const parts = timeStr.split(':');
  if (parts.length < 2) return 0;
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  return hours * 60 + minutes;
}

/**
 * Checks if a class is active at the given minutes since midnight.
 */
export function isClassActive(entry: TimetableEntry, currentMinutes: number): boolean {
  const start = timeStringToMinutes(entry.start_time);
  const end = timeStringToMinutes(entry.end_time);
  return currentMinutes >= start && currentMinutes < end;
}

/**
 * Checks if a class has completed before the given minutes since midnight.
 */
export function isClassCompleted(entry: TimetableEntry, currentMinutes: number): boolean {
  const end = timeStringToMinutes(entry.end_time);
  return currentMinutes >= end;
}

/**
 * Determines the status of a class entry based on the current day of week and minutes since midnight.
 */
export function getClassStatus(entry: TimetableEntry, dayOfWeek: number, currentMinutes: number): ClassStatus {
  if (entry.day_of_week !== dayOfWeek) {
    return 'NO_CLASS';
  }
  
  if (isClassActive(entry, currentMinutes)) {
    return entry.type === 'break' ? 'BREAK' : 'CURRENT';
  }
  
  if (isClassCompleted(entry, currentMinutes)) {
    return 'COMPLETED';
  }
  
  return 'UPCOMING';
}

/**
 * Returns the current active class entry (if any).
 */
export function getCurrentClass(entries: TimetableEntry[], dayOfWeek: number, currentMinutes: number): TimetableEntry | null {
  const activeEntries = entries.filter(
    (entry) => entry.day_of_week === dayOfWeek && isClassActive(entry, currentMinutes)
  );
  
  // Return the first active class (usually lectures/labs don't overlap, breaks might)
  return activeEntries.length > 0 ? activeEntries[0] : null;
}

/**
 * Returns the next upcoming class entry for the current day.
 */
export function getNextClass(entries: TimetableEntry[], dayOfWeek: number, currentMinutes: number): TimetableEntry | null {
  const upcoming = entries
    .filter((entry) => entry.day_of_week === dayOfWeek && timeStringToMinutes(entry.start_time) > currentMinutes)
    .sort((a, b) => timeStringToMinutes(a.start_time) - timeStringToMinutes(b.start_time));
    
  return upcoming.length > 0 ? upcoming[0] : null;
}

/**
 * Returns the most recently completed class entry for the current day.
 */
export function getPreviousClass(entries: TimetableEntry[], dayOfWeek: number, currentMinutes: number): TimetableEntry | null {
  const completed = entries
    .filter((entry) => entry.day_of_week === dayOfWeek && isClassCompleted(entry, currentMinutes))
    .sort((a, b) => timeStringToMinutes(b.end_time) - timeStringToMinutes(a.end_time));
    
  return completed.length > 0 ? completed[0] : null;
}

/**
 * Returns the remaining time in minutes for the active class.
 */
export function getRemainingTime(entry: TimetableEntry, currentMinutes: number): number {
  const end = timeStringToMinutes(entry.end_time);
  return Math.max(0, end - currentMinutes);
}

/**
 * Returns the time until the next class starts in minutes.
 */
export function getTimeUntilNextClass(entry: TimetableEntry, currentMinutes: number): number {
  const start = timeStringToMinutes(entry.start_time);
  return Math.max(0, start - currentMinutes);
}

/**
 * Filters and sorts the schedule entries for a specific day of the week.
 */
export function getScheduleForDate(entries: TimetableEntry[], dayOfWeek: number): TimetableEntry[] {
  return entries
    .filter((entry) => entry.day_of_week === dayOfWeek)
    .sort((a, b) => timeStringToMinutes(a.start_time) - timeStringToMinutes(b.start_time));
}

/**
 * Returns the full schedule for today, sorted by start time.
 */
export function getTodaysSchedule(entries: TimetableEntry[], dayOfWeek: number): TimetableEntry[] {
  return getScheduleForDate(entries, dayOfWeek);
}

/**
 * Resolves standard weekly timetable entries with date-specific overrides/adjustments.
 */
export function resolveScheduleForDate(
  weeklyEntries: TimetableEntry[],
  overrides: TimetableOverride[],
  dayOfWeek: number
): TimetableEntry[] {
  // 1. Convert override start/end bounds to minutes
  const overrideTimeSlots = overrides.map(ov => ({
    override: ov,
    start: timeStringToMinutes(ov.start_time),
    end: timeStringToMinutes(ov.end_time)
  }));

  // 2. Filter out weekly entries that overlap with ANY override (rescheduled or cancelled)
  const remainingWeekly = weeklyEntries.filter(entry => {
    if (entry.day_of_week !== dayOfWeek) return false;
    const entryStart = timeStringToMinutes(entry.start_time);
    const entryEnd = timeStringToMinutes(entry.end_time);

    // Overlap checks
    const isOverlapped = overrideTimeSlots.some(
      ov => entryStart < ov.end && entryEnd > ov.start
    );
    return !isOverlapped;
  });

  // 3. Construct new mock entries for active (non-cancelled) overrides
  const overrideEntries: TimetableEntry[] = overrides
    .filter(ov => !ov.is_cancelled)
    .map(ov => ({
      id: ov.id,
      timetable_id: ov.timetable_id,
      day_of_week: dayOfWeek,
      start_time: ov.start_time,
      end_time: ov.end_time,
      type: ov.type,
      subject_id: ov.subject_id,
      room_id: ov.room_id,
      professor_id: ov.professor_id,
      label: ov.label,
      notes: ov.notes,
      subject: ov.subject || null,
      room: ov.room || null,
      professor: ov.professor || null,
      created_at: ov.created_at,
      updated_at: ov.updated_at
    }));

  // 4. Combine and sort chronologically by start time
  return [...remainingWeekly, ...overrideEntries].sort(
    (a, b) => timeStringToMinutes(a.start_time) - timeStringToMinutes(b.start_time)
  );
}
