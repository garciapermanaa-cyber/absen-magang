# Project Context — MagangTrack

## Project Background
This project originates from real-world internship challenges where attendance tracking was often ambiguous, leading to interns being unfairly reprimanded. The lack of a formal system allowed for inconsistencies in reporting check-in and check-out times.

## Problem Summary
- Unclear attendance records lead to disputes.
- Manual monitoring is inefficient and prone to error.
- Lack of accountability for late arrivals or early departures.
- No centralized system to verify intern presence at the office.

## Main Product Idea
A lightweight web application that allows interns to record their attendance by taking a local photo and providing GPS coordinates, which are then validated by the backend against the office location.

## Important Product Decisions
1. **Web-First:** Developed as a web application, not a native mobile app.
2. **Lightweight Frontend:** Optimized for quick loading and simple interaction.
3. **Local Photo Only:** Photos are used for session activation only and are never uploaded or stored.
4. **No Biometrics:** No face recognition or biometric processing in the MVP.
5. **Server-Side Truth:** Timestamps and GPS validation must be handled by the backend/database.
6. **Privacy Focused:** Minimal data storage, specifically excluding any image data.

## Data That May Be Stored
- User ID and Office ID.
- Attendance type (check-in/check-out).
- Server-generated timestamps.
- Latitude, longitude, and GPS accuracy.
- Calculated distance from office.
- Validation flags (location_valid, camera_verified).
- Attendance status (present, late, etc.).

## Data That Must Not Be Stored
- Photo files or images.
- Face embeddings or biometric data.

## MVP Scope
- User authentication.
- Intern and Admin dashboards.
- Check-in/Check-out flow with camera and GPS.
- Backend location validation.
- Attendance history and status reporting.

## Non-Goals
- Native mobile applications.
- Face recognition or identity verification via AI.
- Payroll or complex HR management features.
- QR code systems (for initial MVP).