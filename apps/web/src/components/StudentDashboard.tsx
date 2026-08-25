'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  getCurrentClass, 
  getNextClass, 
  getPreviousClass, 
  getRemainingTime, 
  getTimeUntilNextClass, 
  getTodaysSchedule, 
  getClassStatus,
  timeStringToMinutes
} from '@flowtime/timetable-core';
import { TimetableEntry } from '@flowtime/types';
import { Clock, MapPin, BookOpen, Users, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';

interface StudentDashboardProps {
  entries: TimetableEntry[];
  className: string;
}

export default function StudentDashboard({ entries, className }: StudentDashboardProps) {
  const [time, setTime] = useState(new Date());

  // Tick the clock every second to update countdowns and progress bars
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const currentMinutes = hours * 60 + minutes;
  // Convert JS Sunday (0) to 7, Monday (1) to 1
  const dayOfWeek = time.getDay() === 0 ? 7 : time.getDay();

  // 1. Current Class
  const currentEntry = getCurrentClass(entries, dayOfWeek, currentMinutes) as TimetableEntry | null;
  // 2. Next Class
  const nextEntry = getNextClass(entries, dayOfWeek, currentMinutes) as TimetableEntry | null;
  // 3. Today's Schedule
  const todaysSchedule = getTodaysSchedule(entries, dayOfWeek);

  // Formatting remaining time countdown e.g. "Ends in 32 min 14 sec"
  const getFormattedRemainingTime = (entry: TimetableEntry) => {
    const endMinutes = timeStringToMinutes(entry.end_time);
    const totalRemainingSeconds = (endMinutes * 60) - (hours * 3600 + minutes * 60 + seconds);
    
    if (totalRemainingSeconds <= 0) return 'Class finished';
    
    const h = Math.floor(totalRemainingSeconds / 3600);
    const m = Math.floor((totalRemainingSeconds % 3600) / 60);
    const s = totalRemainingSeconds % 60;
    
    if (h > 0) {
      return `Ends in ${h}h ${m}m ${s}s`;
    }
    return `Ends in ${m}m ${s}s`;
  };

  // Formatting time until next class countdown e.g. "Starts in 1h 2m"
  const getFormattedTimeUntilNext = (entry: TimetableEntry) => {
    const startMinutes = timeStringToMinutes(entry.start_time);
    const totalRemainingSeconds = (startMinutes * 60) - (hours * 3600 + minutes * 60 + seconds);
    
    if (totalRemainingSeconds <= 0) return 'Starting now';
    
    const h = Math.floor(totalRemainingSeconds / 3600);
    const m = Math.floor((totalRemainingSeconds % 3600) / 60);
    const s = totalRemainingSeconds % 60;
    
    if (h > 0) {
      return `Starts in ${h}h ${m}m`;
    }
    return `Starts in ${m}m ${s}s`;
  };

  // Calculate progress bar percent (0 to 100)
  const getProgressBarPercentage = (entry: TimetableEntry) => {
    const start = timeStringToMinutes(entry.start_time);
    const end = timeStringToMinutes(entry.end_time);
    const totalDuration = end - start;
    if (totalDuration <= 0) return 0;
    
    const elapsedMinutes = currentMinutes - start;
    const elapsedSeconds = elapsedMinutes * 60 + seconds;
    const totalSeconds = totalDuration * 60;
    
    return Math.min(100, Math.max(0, (elapsedSeconds / totalSeconds) * 100));
  };

  // Friendly greeting based on local hour
  const getGreeting = () => {
    if (hours < 12) return 'Good morning';
    if (hours < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const formattedDate = time.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="space-y-8">
      {/* Date Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider block">
            {getGreeting()}
          </span>
          <h2 className="text-xl font-bold text-text-primary mt-0.5">{formattedDate}</h2>
        </div>
        <Link 
          href="/timetable"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary-accent hover:underline bg-accent-soft px-3 py-1.5 rounded-button transition-colors"
        >
          Full Week Timetable
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Main Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CURRENT Class */}
        <div className="bg-surface border border-border shadow-sm rounded-card p-6 flex flex-col justify-between min-h-[220px]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Current Class
              </span>
              {currentEntry && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-success-soft text-success border border-success/15 animate-pulse">
                  LIVE
                </span>
              )}
            </div>
            
            {currentEntry ? (
              <div className="mt-4 space-y-3">
                <h3 className="text-2xl font-semibold text-text-primary tracking-tight">
                  {currentEntry.type === 'break' 
                    ? (currentEntry.label || 'Break') 
                    : (currentEntry.subject?.name || 'Class Event')}
                </h3>
                <div className="flex flex-col gap-2 text-sm text-text-secondary">
                  <span className="flex items-center gap-1.5 font-semibold text-text-primary">
                    <Clock className="w-4 h-4 text-text-muted" />
                    {currentEntry.start_time.slice(0, 5)} - {currentEntry.end_time.slice(0, 5)}
                  </span>
                  {currentEntry.room && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-text-muted" />
                      {currentEntry.room.name} {currentEntry.room.building && `(${currentEntry.room.building})`}
                    </span>
                  )}
                  {currentEntry.type !== 'break' && currentEntry.professor && (
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-text-muted" />
                      {currentEntry.professor.name}
                      {currentEntry.professor.short_name && ` (${currentEntry.professor.short_name})`}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-6 text-center text-text-secondary py-4">
                <p className="text-sm font-medium">No class happening right now.</p>
                <p className="text-xs text-text-muted mt-1">Enjoy your free time!</p>
              </div>
            )}
          </div>

          {currentEntry && (
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-primary-accent">
                  {getFormattedRemainingTime(currentEntry)}
                </span>
                <span className="text-text-secondary font-medium">
                  {Math.round(getProgressBarPercentage(currentEntry))}%
                </span>
              </div>
              <div className="w-full bg-background rounded-full h-2 overflow-hidden border border-border/20">
                <div 
                  className="bg-primary-accent h-full transition-all duration-1000 ease-linear rounded-full"
                  style={{ width: `${getProgressBarPercentage(currentEntry)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* NEXT Class */}
        <div className="bg-surface border border-border shadow-sm rounded-card p-6 flex flex-col justify-between min-h-[220px]">
          <div>
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider block">
              Next Class
            </span>
            
            {nextEntry ? (
              <div className="mt-4 space-y-3">
                <h3 className="text-2xl font-semibold text-text-primary tracking-tight">
                  {nextEntry.type === 'break' 
                    ? (nextEntry.label || 'Break') 
                    : (nextEntry.subject?.name || 'Class Event')}
                </h3>
                <div className="flex flex-col gap-2 text-sm text-text-secondary">
                  <span className="flex items-center gap-1.5 font-semibold text-text-primary">
                    <Clock className="w-4 h-4 text-text-muted" />
                    {nextEntry.start_time.slice(0, 5)} - {nextEntry.end_time.slice(0, 5)}
                  </span>
                  {nextEntry.room && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-text-muted" />
                      {nextEntry.room.name} {nextEntry.room.building && `(${nextEntry.room.building})`}
                    </span>
                  )}
                  {nextEntry.type !== 'break' && nextEntry.professor && (
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-text-muted" />
                      {nextEntry.professor.name}
                      {nextEntry.professor.short_name && ` (${nextEntry.professor.short_name})`}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-6 text-center text-text-secondary py-4">
                <p className="text-sm font-medium">No more classes today.</p>
                <p className="text-xs text-text-muted mt-1">You've completed your schedule today! 🎉</p>
              </div>
            )}
          </div>

          {nextEntry && (
            <div className="mt-6 border-t border-border pt-4 flex items-center justify-between text-xs font-semibold text-primary-accent">
              <span>{getFormattedTimeUntilNext(nextEntry)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Today's Timeline Schedule */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-text-primary">Today's Timeline</h3>
        
        <div className="bg-surface border border-border shadow-sm rounded-card overflow-hidden divide-y divide-border">
          {todaysSchedule.length === 0 ? (
            <div className="p-12 text-center text-text-secondary">
              <p className="text-sm font-medium">No classes scheduled for today 🎉</p>
              <p className="text-xs text-text-muted mt-1">Enjoy a free day.</p>
            </div>
          ) : (
            todaysSchedule.map((entry) => {
              const status = getClassStatus(entry, dayOfWeek, currentMinutes);
              const isCompleted = status === 'COMPLETED';
              const isCurrent = status === 'CURRENT' || status === 'BREAK';
              const isBreak = entry.type === 'break';
              
              return (
                <div 
                  key={entry.id} 
                  className={`p-6 flex items-start gap-4 transition-colors ${
                    isCurrent 
                      ? 'bg-accent-soft/25 border-l-4 border-primary-accent' 
                      : isCompleted 
                        ? 'opacity-65 bg-background/30' 
                        : 'hover:bg-background/25'
                  }`}
                >
                  {/* Status indicator */}
                  <div className="mt-0.5 flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-success fill-success/10" />
                    ) : isCurrent ? (
                      <div className="w-5 h-5 rounded-full border-2 border-primary-accent flex items-center justify-center">
                        <span className="w-2.5 h-2.5 rounded-full bg-primary-accent animate-pulse" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-border" />
                    )}
                  </div>

                  {/* Class Info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-sm font-semibold tracking-tight ${
                        isCompleted ? 'text-text-secondary line-through' : 'text-text-primary'
                      }`}>
                        {isBreak ? (entry.label || 'Break') : (entry.subject?.name || 'Class Event')}
                      </span>
                      {isCurrent && (
                        <span className="inline-flex px-1.5 py-0.5 rounded text-[8px] font-bold bg-success-soft text-success">
                          LIVE
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4 text-xs text-text-secondary">
                      <span className="font-semibold text-text-primary flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-text-muted" />
                        {entry.start_time.slice(0, 5)} - {entry.end_time.slice(0, 5)}
                      </span>
                      {entry.room && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-text-muted" />
                          {entry.room.name}
                        </span>
                      )}
                      {!isBreak && entry.professor && (
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-text-muted" />
                          {entry.professor.name}
                          {entry.professor.short_name && ` (${entry.professor.short_name})`}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
