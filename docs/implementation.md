# Implementation Specification --- Campus Schedule

## 1. Project Overview

Build a modern, minimal, cross-platform personal schedule application
centered around a dynamic timetable.

The product is **not a college ERP** and must not become a
teacher-management, attendance-management, or institutional-management
system.

The core experience is:

> A static timetable becomes a living schedule that tells the user what
> class is happening now, what comes next, how much time remains, and
> what is scheduled for the rest of the day.

The system consists of:

1.  Android mobile app
2.  Android home-screen widgets with multiple sizes
3.  Responsive web app / PWA
4.  Backend and PostgreSQL database
5.  Secure authentication and role-based admin panel
6.  Future modules for tasks, announcements, and notifications

The first release must focus strongly on the timetable experience.
Future functionality must be designed as modular additions rather than
contaminating the core timetable architecture.

------------------------------------------------------------------------

# 2. Product Goals

## Primary goals

-   Make the timetable immediately understandable.
-   Clearly show the current class.
-   Clearly show the next class.
-   Show remaining time / countdown dynamically.
-   Make today's schedule scannable in seconds.
-   Provide useful Android widgets without opening the app.
-   Provide the same source of truth across Android and web.
-   Make timetable data editable through an admin panel instead of
    hard-coding it.
-   Keep the UI minimal, calm, modern, and highly readable.
-   Build a foundation that can later support tasks, announcements, and
    notifications.

## Non-goals for MVP

Do NOT implement:

-   Teacher management
-   College ERP functionality
-   Attendance management
-   Student management
-   Fees
-   Exams management
-   Full academic administration
-   Complex social features
-   Chat
-   Unnecessary gamification

------------------------------------------------------------------------

# 3. Core User Experience

When a user opens the app, they should immediately understand:

1.  What day is it?
2.  What class is currently happening?
3.  How much time is left?
4.  What is the next class?
5.  Where is the next/current class?
6.  What classes remain today?

The application should require almost no interaction for the most common
use case.

Example:

``` text
Monday, 24 August

CURRENT
M1 (T)
11:15 AM — 12:15 PM
Room 309-A

Ends in 32 min

NEXT
M1 (T)
12:45 PM — 1:45 PM
Starts in 1h 2m

TODAY
✓ BME
✓ IPDC
● M1
○ M1
○ DT
```

------------------------------------------------------------------------

# 4. Technology Stack

## Android

-   React Native CLI
-   TypeScript
-   React Navigation
-   TanStack Query
-   Zustand
-   MMKV
-   SQLite where richer offline persistence is required
-   react-native-android-widget
-   Native Kotlin only where Android-specific functionality cannot
    reasonably be handled from React Native

Do not use Expo for the main Android application because native widget
and Android-specific integration are important parts of the product.

## Web

-   Next.js
-   TypeScript
-   Tailwind CSS
-   shadcn/ui
-   TanStack Query
-   Zustand only where client-side global state is actually needed
-   PWA support

The web app must be responsive and usable on desktop, tablet, and
mobile.

## Backend

Use Supabase as the initial backend platform:

-   PostgreSQL
-   Supabase Auth
-   Row Level Security
-   Storage only if required later
-   Edge Functions for server-side operations when necessary

Do not create a separate Express backend unless a real requirement
appears that Supabase cannot handle cleanly.

## Hosting

-   Web: Vercel
-   Backend/database/auth: Supabase
-   Repository: GitHub

## Notifications --- future

-   Firebase Cloud Messaging for Android push notifications

------------------------------------------------------------------------

# 5. Architecture

Use one central backend/data source.

``` text
                         ┌──────────────────────┐
                         │      Supabase        │
                         │                      │
                         │ PostgreSQL           │
                         │ Auth                 │
                         │ RLS                  │
                         │ Edge Functions       │
                         └──────────┬───────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
             ┌──────▼───────┐                ┌──────▼───────┐
             │ Next.js Web  │                │ React Native │
             │ PWA          │                │ Android App  │
             └──────────────┘                └──────┬───────┘
                                                     │
                                              ┌──────▼───────┐
                                              │ Android      │
                                              │ Widgets      │
                                              └──────────────┘
```

The timetable must never be duplicated as separate hard-coded datasets
in each client.

The database is the source of truth.

------------------------------------------------------------------------

# 6. Repository Structure

Use a monorepo if practical.

Recommended:

``` text
/apps
  /web
  /mobile

/packages
  /types
  /api
  /timetable-core
  /ui-tokens
  /config

/supabase
  /migrations
  /functions
  /seed

/docs
  implementation.md
```

If a monorepo introduces unnecessary complexity at the beginning, use
separate applications while keeping shared TypeScript types and
timetable logic structurally compatible.

------------------------------------------------------------------------

# 7. Shared Timetable Logic

The most important business logic should be platform-independent.

Create a shared timetable-core package containing functions such as:

``` text
getCurrentClass()
getNextClass()
getPreviousClass()
getRemainingTime()
getTimeUntilNextClass()
getTodaysSchedule()
getScheduleForDate()
isClassActive()
isClassCompleted()
getClassStatus()
```

These functions must be deterministic and timezone-aware.

The Android app, web app, and widgets must use the same logic wherever
possible.

Do NOT implement slightly different current-class calculations on
Android and web.

------------------------------------------------------------------------

# 8. Data Model

Initial database entities:

## profiles

``` text
id
email
display_name
avatar_url
created_at
updated_at
```

## roles

``` text
id
name
description
```

Initial roles:

-   owner
-   admin
-   editor
-   user

## user_roles

``` text
user_id
role_id
```

## classes / sections

Represents the schedule's target class/section.

``` text
id
name
academic_year
section
created_at
updated_at
```

Example:

``` text
name: Computer
section: 13
academic_year: 2026-27
```

## subjects

``` text
id
name
short_name
code
created_at
updated_at
```

## rooms

``` text
id
name
building
created_at
updated_at
```

## timetables

``` text
id
class_id
name
effective_from
effective_until
is_active
created_at
updated_at
```

## timetable_entries

``` text
id
timetable_id
day_of_week
start_time
end_time
subject_id
room_id
type
label
notes
created_at
updated_at
```

`type` may eventually contain:

``` text
lecture
tutorial
lab
break
other
```

Keep the model extensible.

## Future tables

Do not implement unless required:

``` text
tasks
announcements
notifications
notification_preferences
```

------------------------------------------------------------------------

# 9. Time Handling

Time calculations are a critical part of the application.

Rules:

-   Store recurring timetable times as local clock times.
-   Store timestamps such as created_at and updated_at in UTC.
-   The active schedule must have an explicit timezone.
-   Never rely on device locale for determining class order.
-   The timetable engine must handle classes crossing midnight safely,
    even if the initial timetable does not use them.
-   Countdown values must update without requiring a screen refresh.

Example states:

``` text
UPCOMING
CURRENT
COMPLETED
BREAK
NO_CLASS
```

The UI must transition automatically as time passes.

------------------------------------------------------------------------

# 10. Android App Navigation

Recommended bottom navigation:

``` text
Home
Timetable
Tasks
More
```

For MVP, Tasks can remain disabled/hidden until implemented.

## Home

Primary dashboard.

Contains:

-   Greeting / date
-   Current class card
-   Live remaining-time indicator
-   Next class card
-   Today's schedule
-   Quick access to full timetable

## Timetable

Contains:

-   Day selector
-   Full daily schedule
-   Current class highlight
-   Completed/upcoming visual states
-   Optional week selector later

## Tasks --- future

Do not build initially.

## More

Contains:

-   Settings
-   About
-   Sync/account
-   Theme preference
-   Notification settings later

------------------------------------------------------------------------

# 11. Home Screen UI

The Home screen is the most important screen.

Recommended structure:

``` text
Header
  Greeting
  Date
  Notification/account action

Current Class Card
  status badge: LIVE
  subject
  time
  room
  progress bar
  remaining time

Next Class Card
  subject
  time
  room
  countdown

Today's Schedule
  timeline/list
  completed
  current
  upcoming
```

The current class should visually dominate the screen without being
huge.

------------------------------------------------------------------------

# 12. Timetable UI

Use a clean vertical schedule instead of trying to reproduce the
original PDF table exactly.

Example:

``` text
Monday, 24 August

09:15 ───────── BME (MCB)
             Room MCB-007
             ✓ Completed

10:15 ───────── IPDC (ST)
             Room ST-203
             ✓ Completed

11:15 ───────── M1 (T)
             Room 309-A
             ● LIVE
             Ends in 32 min

12:45 ───────── M1 (T)
             Room 309-A
             ○ Upcoming

01:45 ───────── DT (SRC)
             Room 309-A
             ○ Upcoming
```

Use clear time alignment and strong hierarchy.

------------------------------------------------------------------------

# 13. Current Class Behavior

The current class card should include:

``` text
LIVE
M1 (T)

11:15 AM — 12:15 PM
Room 309-A

Ends in 32 min
[██████████████░░░]
```

The progress bar must update continuously.

When the class ends:

1.  Mark it completed.
2.  Find the next schedule entry.
3.  Promote the next class to NEXT.
4.  If the next class has started, promote it to CURRENT.
5.  Update widgets automatically.

------------------------------------------------------------------------

# 14. Break Handling

The timetable contains a break period.

Breaks should not be treated as normal subjects.

Instead:

``` text
12:15 PM

BREAK
30 min
```

During a break, Home should show:

``` text
BREAK

Next class:
M1 (T)

Starts in 18 min
```

The break should have a visually distinct but subtle style.

------------------------------------------------------------------------

# 15. Android Widgets

Widgets are a major product feature.

Create at least three conceptual sizes.

## Small widget

Purpose: glanceable next/current class.

Example:

``` text
┌─────────────────────┐
│ M1 (T)              │
│ 11:15 AM             │
│ Room 309-A           │
│ in 23 min            │
└─────────────────────┘
```

## Medium widget

Purpose: current/next class.

``` text
┌─────────────────────────────┐
│ NEXT CLASS                  │
│                             │
│ M1 (T)                      │
│ 11:15 AM — 12:15 PM         │
│ Room 309-A                  │
│                             │
│ Starts in 23 min            │
└─────────────────────────────┘
```

## Large widget

Purpose: today's schedule.

``` text
TODAY · MONDAY

✓ 09:15  BME
✓ 10:15  IPDC
● 11:15  M1
○ 12:45  M1
○ 01:45  DT

Next: M1 · 12:45
```

Widgets must:

-   Update based on current time.
-   Work with cached timetable data.
-   Open the relevant app screen when tapped.
-   Handle no-class days.
-   Handle breaks.
-   Handle offline state gracefully.

Do not make widgets visually overloaded.

------------------------------------------------------------------------

# 16. Web App

The web app should feel like the desktop version of the same product,
not a separate product.

## Dashboard

Desktop layout:

``` text
Sidebar
  Home
  Timetable
  Tasks
  Announcements
  Settings

Main Content
  Header
  Current Class
  Next Class
  Today's Schedule
  Calendar/date selector
```

Use cards and whitespace rather than dense tables.

## Responsive behavior

Desktop:

``` text
Sidebar + multi-column dashboard
```

Tablet:

``` text
Compact sidebar / navigation
2-column cards
```

Mobile:

``` text
Bottom navigation
Single-column cards
```

------------------------------------------------------------------------

# 17. PWA

The web app should be installable as a PWA.

Requirements:

-   Manifest
-   App icon
-   Splash/launch behavior where supported
-   Responsive layout
-   Offline cached shell
-   Cached timetable where practical
-   Graceful offline state

The PWA is not a replacement for the native Android app. The native app
exists primarily because Android widgets and deeper platform integration
are important.

------------------------------------------------------------------------

# 18. Admin Panel

The admin panel is for managing the application's data.

It is NOT a college ERP.

Admin sections:

``` text
Dashboard
Timetables
Subjects
Rooms
Classes / Sections
Users
Roles
Settings
Audit Logs
```

Future:

``` text
Announcements
```

Do not add teacher management unless explicitly required later.

------------------------------------------------------------------------

# 19. Admin Dashboard

Show useful system information:

``` text
Active Timetable
Current Class
Number of Subjects
Number of Classes
Last Updated
Recent Changes
```

Keep it functional and minimal.

------------------------------------------------------------------------

# 20. Timetable Admin

Provide CRUD operations:

-   Create timetable
-   Select class/section
-   Select effective date
-   Add timetable entries
-   Edit entries
-   Delete entries
-   Duplicate a day
-   Duplicate an entire timetable
-   Reorder where needed
-   Preview timetable
-   Publish/activate timetable

Before destructive actions, show confirmation.

The admin should make schedule editing much easier than editing a
spreadsheet.

------------------------------------------------------------------------

# 21. Roles and Permissions

Initial roles:

## Owner

Everything.

Can:

-   Manage users
-   Manage roles
-   Manage timetable
-   Manage application settings
-   View audit logs

## Admin

Can:

-   Manage timetable
-   Manage subjects
-   Manage rooms
-   Manage classes
-   View relevant system data

Cannot:

-   Transfer ownership
-   Delete the entire system
-   Modify owner privileges

## Editor

Can:

-   View timetable
-   Create/edit timetable entries
-   Manage permitted schedule data

Cannot:

-   Manage users
-   Manage roles
-   Change security settings

## User

Can:

-   View timetable
-   Manage personal settings
-   Use future personal modules

Implement authorization with Supabase RLS. Frontend role checks are only
for UX; database policies must enforce security.

------------------------------------------------------------------------

# 22. Audit Logs

Every important admin mutation should eventually record:

``` text
user
action
entity
entity_id
old_value
new_value
timestamp
```

Example:

``` text
Purval
Updated timetable entry
M1 (T)
24 Aug 2026, 10:32 AM
11:15–12:15 → 12:45–1:45
```

This is useful for recovering from accidental edits.

------------------------------------------------------------------------

# 23. Authentication

Use Supabase Auth.

Initial authentication:

-   Email/password
-   Session persistence
-   Logout
-   Password reset

Do not build complicated authentication flows initially.

Admin access must be protected both in the UI and at the database level.

------------------------------------------------------------------------

# 24. Design System

The visual direction is:

> Minimal, bright, calm, modern, premium, highly readable.

Do NOT use:

-   Dark GFX aesthetic
-   Neon purple gradients
-   Excessive glow
-   Gaming UI
-   Huge decorative graphics
-   Excessive glassmorphism
-   Overly rounded everything

The product should feel closer to a polished productivity app.

------------------------------------------------------------------------

# 25. Color Palette

Use a mostly neutral palette with one restrained accent.

## Light theme

``` text
Background:       #F7F8FA
Surface:          #FFFFFF
Primary Text:     #111827
Secondary Text:   #6B7280
Muted Text:       #9CA3AF
Border:           #E5E7EB
Primary Accent:   #2563EB
Accent Soft:      #EFF6FF
Success:          #16A34A
Success Soft:     #F0FDF4
Warning:          #D97706
Warning Soft:     #FFFBEB
Danger:           #DC2626
Danger Soft:      #FEF2F2
```

Blue is the primary accent.

Use green primarily for LIVE/success states rather than as the main
brand color.

Avoid using every color simultaneously.

------------------------------------------------------------------------

# 26. Typography

Use a modern sans-serif.

Recommended:

-   Inter
-   Geist
-   SF Pro style fallback on Apple platforms
-   Roboto on Android where appropriate

Hierarchy:

``` text
Page title: 28–32px / semibold
Section title: 18–20px / semibold
Card title: 16–18px / semibold
Body: 14–16px / regular
Secondary: 12–14px / regular
Tiny metadata: 11–12px
```

Prioritize readability over decorative typography.

------------------------------------------------------------------------

# 27. Spacing

Use a consistent 4px/8px spacing system.

Preferred values:

``` text
4
8
12
16
20
24
32
40
48
```

Do not randomly use arbitrary spacing values.

------------------------------------------------------------------------

# 28. Cards

Cards should have:

-   White background
-   1px subtle border
-   Very light shadow only where useful
-   12--16px radius
-   Comfortable internal padding

Do not make every element a floating card.

Use sections and whitespace to create hierarchy.

------------------------------------------------------------------------

# 29. Status Design

Use consistent states.

## Current

-   Blue or subtle blue background
-   Small green LIVE badge
-   Accent border/indicator
-   Progress bar

## Completed

-   Muted text
-   Check icon
-   Reduced visual weight

## Upcoming

-   Normal text
-   Neutral icon

## Break

-   Soft neutral/warm treatment

## No class

-   Friendly empty state

------------------------------------------------------------------------

# 30. Icons

Use one icon family consistently.

Recommended:

-   Lucide
-   Material Symbols where native Android integration requires it

Icons should support text, not replace important labels.

------------------------------------------------------------------------

# 31. Motion

Animations should be subtle.

Use:

-   150--250ms transitions
-   Smooth current-class state transitions
-   Progress animation
-   Small page transitions
-   Press feedback

Avoid:

-   Excessive bouncing
-   Large entrance animations
-   Decorative animation
-   Constant movement

The countdown should feel alive without distracting the user.

------------------------------------------------------------------------

# 32. Accessibility

Requirements:

-   Sufficient contrast
-   Minimum comfortable touch target around 44px
-   Do not communicate state using color alone
-   Support dynamic font sizing where practical
-   Screen-reader labels for important controls
-   Keyboard accessibility on web
-   Visible focus states

------------------------------------------------------------------------

# 33. Offline Strategy

The timetable is useful even without internet.

The Android app should cache:

-   Current timetable
-   Recent timetable data
-   User preferences

If offline:

``` text
Last synced 18 min ago
```

The user should still be able to view the timetable and calculate
current/next class locally.

When connectivity returns:

``` text
Syncing...
Synced just now
```

------------------------------------------------------------------------

# 34. Data Synchronization

Use TanStack Query for server state.

Recommended flow:

``` text
API request
   ↓
TanStack Query cache
   ↓
UI
```

For mobile, persist important timetable data locally.

Avoid unnecessary requests every few seconds.

The countdown should be calculated locally.

Do NOT request the server every minute just to update:

``` text
23 min
22 min
21 min
```

------------------------------------------------------------------------

# 35. Widget Synchronization

Widgets should not continuously hit the backend.

Recommended:

``` text
Backend
   ↓
Mobile app sync
   ↓
Local cached timetable
   ↓
Widget
```

The widget uses local data to determine what should be shown.

Refresh when:

-   Timetable changes
-   App sync completes
-   Relevant time boundary is reached
-   Android widget refresh mechanism triggers

Respect Android background execution limits.

------------------------------------------------------------------------

# 36. Error and Empty States

Examples:

## No timetable

``` text
No timetable yet

Your schedule hasn't been configured.
```

## No class today

``` text
No classes today 🎉

Enjoy your free day.
```

## Offline

``` text
You're offline

Showing your last synced timetable.
```

## Sync error

``` text
Couldn't sync

We'll try again later.
```

Keep error messages human-readable.

------------------------------------------------------------------------

# 37. Future Tasks Module

Tasks should be a separate feature module.

Example:

``` text
Task
- title
- description
- due_date
- completed
- priority
- created_at
- updated_at
```

Possible future integration:

``` text
Today's classes
+
Today's tasks
```

Do not implement until the timetable MVP is stable.

------------------------------------------------------------------------

# 38. Future Announcements Module

Announcements could later come from the admin panel.

Example:

``` text
M1 classroom changed

Today's 12:45 PM class has moved
from Room 309-A to Room 204.
```

Announcements can later trigger notifications.

Do not build this into the timetable core.

------------------------------------------------------------------------

# 39. Future Notifications

Possible notifications:

``` text
Class starts in 15 minutes
Class starts in 5 minutes
Room changed
New announcement
Task due tomorrow
Task overdue
```

Use Firebase Cloud Messaging for push notifications.

Notifications must be user-configurable.

------------------------------------------------------------------------

# 40. API/Data Layer Principles

The client should not directly manipulate arbitrary database tables from
UI components.

Create a clean data-access layer.

Example:

``` text
timetableService.getToday()
timetableService.getWeek()
timetableService.getEntry()
timetableService.updateEntry()
```

React components should consume hooks such as:

``` text
useTodaySchedule()
useCurrentClass()
useNextClass()
useTimetable()
```

This keeps UI separate from backend implementation.

------------------------------------------------------------------------

# 41. Component Architecture

Reusable components should include:

``` text
CurrentClassCard
NextClassCard
ScheduleItem
ScheduleTimeline
DaySelector
Countdown
ProgressBar
StatusBadge
RoomLabel
EmptyState
OfflineBanner
SyncIndicator
```

Widgets should have their own presentation components where necessary.

Avoid creating huge monolithic screens.

------------------------------------------------------------------------

# 42. Development Phases

## Phase 0 --- Foundation

-   Repository setup
-   TypeScript
-   Environment variables
-   Supabase project
-   Database migrations
-   Auth
-   Shared types
-   Shared timetable logic

## Phase 1 --- Admin

-   Login
-   Roles
-   Classes
-   Subjects
-   Rooms
-   Timetable CRUD
-   Preview
-   Audit basics

## Phase 2 --- Web

-   Next.js
-   Design system
-   Dashboard
-   Timetable screen
-   Current/next class
-   Responsive layout
-   PWA

## Phase 3 --- Android

-   React Native CLI
-   Authentication
-   Timetable
-   Home screen
-   Current/next logic
-   Local cache
-   Offline support

## Phase 4 --- Widgets

-   Small widget
-   Medium widget
-   Large widget
-   Widget refresh
-   Deep links into app

## Phase 5 --- Polish

-   Loading states
-   Empty states
-   Error handling
-   Accessibility
-   Animations
-   Performance
-   App icon
-   Splash screen
-   Release builds

## Phase 6 --- Future features

Only after the core product is stable:

-   Tasks
-   Announcements
-   Notifications
-   Personal reminders
-   Additional widget types

------------------------------------------------------------------------

# 43. MVP Definition of Done

The MVP is complete when:

-   [ ] Admin can authenticate.
-   [ ] Owner can manage users/roles.
-   [ ] Admin can create and edit timetable data.
-   [ ] Data is stored in PostgreSQL.
-   [ ] RLS protects database operations.
-   [ ] Web app loads timetable dynamically.
-   [ ] Android app loads timetable dynamically.
-   [ ] No timetable data is hard-coded into UI components.
-   [ ] Current class is detected automatically.
-   [ ] Next class is detected automatically.
-   [ ] Remaining time updates locally.
-   [ ] Completed/current/upcoming states are clear.
-   [ ] Breaks are handled.
-   [ ] No-class days are handled.
-   [ ] Mobile app works with cached timetable offline.
-   [ ] Small Android widget works.
-   [ ] Medium Android widget works.
-   [ ] Large Android widget works.
-   [ ] Widget data reflects the latest synced timetable.
-   [ ] Web app is responsive.
-   [ ] PWA installation works.
-   [ ] UI follows the minimal design system.
-   [ ] Authentication and authorization are secure.
-   [ ] Basic error and empty states exist.

------------------------------------------------------------------------

# 44. Engineering Rules for the AI Agent

1.  Do not hard-code timetable entries into application components.
2.  Do not invent features outside the defined scope.
3.  Do not turn this into a college ERP.
4.  Do not add teacher management.
5.  Do not add attendance unless explicitly requested.
6.  Do not add tasks/announcements/notifications until the timetable
    foundation is stable.
7.  Keep timetable business logic shared.
8.  Keep API/data access separate from UI.
9.  Use TypeScript strictly.
10. Avoid `any` unless genuinely unavoidable.
11. Prefer small reusable components.
12. Keep the UI minimal and consistent.
13. Do not introduce unnecessary dependencies.
14. Prefer native platform behavior over hacks.
15. Never expose Supabase service-role credentials to clients.
16. Enforce permissions using database RLS.
17. Never rely only on frontend role checks.
18. Cache timetable data on mobile.
19. Calculate countdowns locally.
20. Do not poll the backend every minute for countdown updates.
21. Test time-boundary behavior carefully.
22. Test timezone behavior.
23. Keep environment secrets outside source control.
24. Write migrations rather than manually modifying production tables.
25. Keep the project buildable after every major phase.

------------------------------------------------------------------------

# 45. Product Personality

The app should feel:

-   Calm
-   Fast
-   Clean
-   Useful
-   Modern
-   Lightweight
-   Reliable

It should NOT feel:

-   Corporate ERP
-   Gaming dashboard
-   Neon GFX poster
-   Over-designed
-   Cluttered
-   Feature-heavy

The guiding principle is:

> **Show me what I need to know right now.**

The timetable is the heart of the product.

Everything else should support that experience.
