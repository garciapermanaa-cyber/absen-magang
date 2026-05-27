# PRD — MagangTrack

## 1. Product Overview
MagangTrack is a web-based attendance system specifically designed for interns. It ensures accountability and transparency by requiring real-time camera activation and GPS location validation for every check-in and check-out event.

## 2. Background
The idea for MagangTrack stems from a recurring issue in internship programs: unclear attendance tracking. Interns were frequently reprimanded for perceived tardiness or early departures because there was no objective, structured system to record their presence. This lack of structure created friction between interns and supervisors.

## 3. Problem Statement
- **Monitoring Difficulty:** Manual attendance tracking is hard to maintain and verify.
- **Unreliable Records:** Verbal warnings or manual logs are insufficient for fair performance evaluation.
- **Lack of Transparency:** Interns may bypass informal tracking, leading to discipline issues.
- **Administrative Burden:** Supervisors need a clear, automated way to view attendance data.

## 4. Goals
- Provide a reliable check-in/check-out mechanism for interns.
- Validate intern location against office coordinates to ensure physical presence.
- Implement camera activation to ensure real-time participation without compromising privacy (no photo storage).
- Use server-side timestamps to prevent client-side time manipulation.
- Enable admins to monitor attendance patterns and reduce tardiness.

## 5. Non-Goals
- Native mobile application development for the MVP.
- Face recognition or AI-based identity verification.
- Storage of any photos or images.
- Biometric data processing.
- Payroll integration or complex HR workflows.
- QR code-based attendance in the first version.

## 6. User Roles
1. **Intern:** The primary user who records attendance.
2. **Admin / Supervisor:** The user who monitors attendance records and manages the system.

## 7. Intern User Flow
1. Intern logs into the web app.
2. Intern opens the dashboard.
3. Intern clicks the "Check-in" button.
4. The app requests access to the camera.
5. Intern takes a photo locally (processed in-browser only).
6. The photo is **not** uploaded to any server.
7. The app requests GPS permission.
8. The app collects latitude, longitude, and accuracy.
9. The frontend sends metadata (GPS data and `camera_verified=true`) to the backend.
10. The backend calculates the distance from the office and validates the location.
11. The backend saves the record using the server/database timestamp.
12. Intern receives immediate feedback (e.g., "Present", "Late", or "Rejected: Outside Radius").
13. The same flow is repeated for "Check-out".

## 8. Admin User Flow
1. Admin logs into the system.
2. Admin views the daily attendance dashboard.
3. Admin identifies who has checked in, who is late, and who is missing.
4. Admin identifies early check-outs.
5. Admin reviews historical attendance data for reporting and evaluation.

## 9. Attendance Rules
- **Location Requirement:** Both check-in and check-out must occur within a predefined office radius.
- **Distance Calculation:** The backend must perform the distance calculation from the office coordinates.
- **Status Logic:** The backend determines if a check-in is "Present" or "Late" based on office hours.
- **Early Checkout:** The backend flags check-outs that occur before the official end of the workday.
- **Source of Truth:** Only server/database timestamps are used for records; client device time is ignored.

## 10. Camera Activation Rule
- **Mandatory Step:** Users must activate the camera and take a local photo to proceed.
- **Local Processing:** The photo is used only to trigger the `camera_verified` flag in the browser.
- **No Storage:** The photo file is never sent to the backend, stored in a database, or saved in object storage.
- **No Recognition:** This is a simple activation check, not face recognition.

## 11. GPS Validation Rule
- **Permission:** The frontend must explicitly request and receive GPS permission.
- **Metadata:** Latitude, longitude, and accuracy are sent to the backend.
- **Backend Enforcement:** Validation must happen on the backend to prevent frontend spoofing.
- **Rejection:** Attendance is automatically rejected if the user is outside the allowed radius.

## 12. Data Stored
- `user_id`: Unique identifier for the intern.
- `office_id`: Identifier for the assigned office location.
- `attendance_type`: Enum (check_in, check_out).
- `timestamp`: Server-side date and time.
- `latitude` / `longitude`: Captured coordinates.
- `gps_accuracy`: Accuracy level of the captured GPS data.
- `distance_from_office`: Calculated distance in meters.
- `location_valid`: Boolean flag.
- `camera_verified`: Boolean flag (always true if submitted).
- `attendance_status`: Enum (present, late, early_checkout, etc.).
- `created_at`: Database record creation time.

## 13. Data Not Stored
- Photo files or raw image data.
- Selfie images or thumbnails.
- Face images or biometric templates.
- Face embeddings or any AI-generated facial data.

## 14. MVP Features
- User Authentication (Login/Logout).
- Intern Dashboard with Check-in/Check-out buttons.
- Camera API integration for local activation.
- Geolocation API integration.
- Backend API for GPS validation and record saving.
- Admin Dashboard for real-time monitoring.
- Attendance history view for both roles.

## 15. Future Features
- QR code validation at office desks.
- Leave/Permit/Sickness request system (`izin/sakit`).
- Exportable attendance reports (PDF/CSV).
- Progressive Web App (PWA) support for better mobile experience.
- Random selfie audit (where photos are temporarily stored for review).
- Support for multiple office locations.
- Push notifications and attendance reminders.

## 16. Success Criteria
- Interns can successfully check in when physically at the office.
- System accurately rejects attempts made outside the office radius.
- Zero photo data is transmitted or stored.
- All timestamps are consistent with the server time.
- Admins can clearly identify late arrivals and early departures.

## 17. Risks
- **GPS Spoofing:** Users might use apps to fake their location.
- **GPS Inaccuracy:** Tall buildings or poor weather might affect accuracy.
- **Permissions:** Users might deny camera or location access.
- **Connectivity:** Weak internet may prevent attendance submission.
- **Privacy:** Users might be concerned about location tracking.

## 18. Privacy Considerations
- **Minimalism:** Only essential metadata is stored.
- **No Images:** Strict "no-upload" policy for photos.
- **Access Control:** Data is only visible to the user and authorized admins.
- **Purpose Limitation:** Location data is used solely for attendance validation.

## 19. Technical Constraints
- Must be compatible with modern mobile browsers (Chrome, Safari).
- Requires HTTPS for Camera and Geolocation APIs.
- Backend must handle all validation logic.
- Database usage should fit within Supabase free-tier limits.

## 20. Open Questions
- What are the exact latitude/longitude coordinates for the office?
- What is the acceptable radius (e.g., 50m, 100m)?
- What are the official start and end times for interns?
- Should admins have the authority to manually override or edit records?
- Is there a "late tolerance" period (e.g., 5 or 10 minutes)?
- Is check-out mandatory for the record to be considered complete?