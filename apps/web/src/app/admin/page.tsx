'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { 
  Layers, 
  BookOpen, 
  MapPin, 
  Calendar 
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();

  // Fetch counts from local database
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [
        { count: classesCount },
        { count: subjectsCount },
        { count: roomsCount },
        { count: timetablesCount }
      ] = await Promise.all([
        supabase.from('classes').select('*', { count: 'exact', head: true }),
        supabase.from('subjects').select('*', { count: 'exact', head: true }),
        supabase.from('rooms').select('*', { count: 'exact', head: true }),
        supabase.from('timetables').select('*', { count: 'exact', head: true })
      ]);

      return {
        classes: classesCount || 0,
        subjects: subjectsCount || 0,
        rooms: roomsCount || 0,
        timetables: timetablesCount || 0,
      };
    }
  });

  // Fetch classes details for mapping names
  const { data: classes = [] } = useQuery<any[]>({
    queryKey: ['admin-analytics-classes'],
    queryFn: async () => {
      const { data, error } = await supabase.from('classes').select('*');
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch telemetry logs
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analytics_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500);

      if (error) throw error;
      const events = data || [];

      let webViews = 0;
      let mobileViews = 0;
      const classSelections: Record<string, number> = {};

      events.forEach((ev) => {
        if (ev.event_type === 'page_view') {
          if (ev.platform === 'web') webViews++;
          if (ev.platform === 'mobile') mobileViews++;
        }
        if (ev.event_type === 'class_selected' && ev.metadata?.class_id) {
          const cid = ev.metadata.class_id;
          classSelections[cid] = (classSelections[cid] || 0) + 1;
        }
      });

      return {
        webViews,
        mobileViews,
        classSelections
      };
    }
  });

  const classBreakdown = Object.entries(analytics?.classSelections || {}).map(([id, count]) => {
    const cls = classes.find((c) => c.id === id);
    return {
      name: cls ? `${cls.name} (${cls.section})` : `Class ID: ${id.slice(0, 8)}...`,
      count
    };
  }).sort((a, b) => b.count - a.count);

  const cards = [
    { name: 'Active Timetables', count: stats?.timetables, icon: Calendar, color: 'text-primary-accent bg-blue-50' },
    { name: 'Academic Classes', count: stats?.classes, icon: Layers, color: 'text-orange-600 bg-orange-50' },
    { name: 'Subjects', count: stats?.subjects, icon: BookOpen, color: 'text-green-600 bg-green-50' },
    { name: 'Rooms & Locations', count: stats?.rooms, icon: MapPin, color: 'text-purple-600 bg-purple-50' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
          Welcome back, {user?.email?.split('@')[0] || 'Admin'}
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Here is an overview of your campus timetable system configuration.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div 
              key={card.name} 
              className="bg-surface border border-border shadow-sm rounded-card p-6 flex items-center justify-between"
            >
              <div className="space-y-1">
                <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                  {card.name}
                </span>
                <h3 className="text-2xl font-semibold text-text-primary">
                  {isLoading ? (
                    <span className="inline-block w-8 h-6 bg-border rounded animate-pulse" />
                  ) : (
                    card.count
                  )}
                </h3>
              </div>
              <div className={`p-3 rounded-button ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Telemetry Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Engagement Share Card */}
        <div className="bg-surface border border-border shadow-sm rounded-card p-6 space-y-4">
          <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">Platform Engagement Share</h3>
          {analyticsLoading ? (
            <div className="py-10 text-center text-text-secondary text-xs animate-pulse">Loading telemetry logs...</div>
          ) : (
            <div className="space-y-4">
              {/* Web Views */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-text-primary">Desktop Web Portal</span>
                  <span className="text-text-secondary">{analytics?.webViews || 0} page views</span>
                </div>
                <div className="h-2.5 w-full bg-background rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-accent rounded-full transition-all duration-500" 
                    style={{ 
                      width: `${(analytics?.webViews || 0) + (analytics?.mobileViews || 0) > 0 
                        ? ((analytics?.webViews || 0) / ((analytics?.webViews || 0) + (analytics?.mobileViews || 0))) * 100 
                        : 0}%` 
                    }} 
                  />
                </div>
              </div>

              {/* Mobile Views */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-text-primary">Native Mobile Client</span>
                  <span className="text-text-secondary">{analytics?.mobileViews || 0} page views</span>
                </div>
                <div className="h-2.5 w-full bg-background rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-600 rounded-full transition-all duration-500" 
                    style={{ 
                      width: `${(analytics?.webViews || 0) + (analytics?.mobileViews || 0) > 0 
                        ? ((analytics?.mobileViews || 0) / ((analytics?.webViews || 0) + (analytics?.mobileViews || 0))) * 100 
                        : 0}%` 
                    }} 
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Class Selection Popularity Card */}
        <div className="bg-surface border border-border shadow-sm rounded-card p-6 space-y-4">
          <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">Class Selection Popularity</h3>
          {analyticsLoading ? (
            <div className="py-10 text-center text-text-secondary text-xs animate-pulse">Loading telemetry logs...</div>
          ) : classBreakdown.length === 0 ? (
            <p className="text-xs text-text-secondary py-10 text-center">No selections tracked yet.</p>
          ) : (
            <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1">
              {classBreakdown.map((item) => {
                const maxCount = Math.max(...classBreakdown.map((x) => x.count));
                return (
                  <div key={item.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-text-primary truncate max-w-xs">{item.name}</span>
                      <span className="text-text-secondary">{item.count} selection hits</span>
                    </div>
                    <div className="h-2 w-full bg-background rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-orange-500 rounded-full transition-all duration-500" 
                        style={{ width: `${maxCount > 0 ? (item.count / maxCount) * 100 : 0}%` }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick Setup Card */}
      <div className="bg-surface border border-border shadow-sm rounded-card p-8">
        <h2 className="text-lg font-semibold text-text-primary mb-2">Getting Started with Flowtime</h2>
        <p className="text-sm text-text-secondary max-w-2xl mb-6">
          To display schedules correctly on mobile and web client interfaces, you must configure classrooms, input course subjects, define standard academic sections (classes), and draft timetables.
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href="/admin/classes"
            className="inline-flex items-center justify-center rounded-button bg-primary-accent px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-accent/90 transition-colors"
          >
            Create Class Section
          </a>
          <a
            href="/admin/timetables"
            className="inline-flex items-center justify-center rounded-button border border-border bg-surface px-4 py-2 text-sm font-semibold text-text-primary hover:bg-background transition-colors"
          >
            Manage Timetables
          </a>
        </div>
      </div>
    </div>
  );
}
