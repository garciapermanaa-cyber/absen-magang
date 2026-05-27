# Architecture — MagangTrack

## Planned Stack
- **Frontend:** React (Vite), TypeScript, Tailwind CSS.
- **Backend:** Express.js (Node.js).
- **Database:** Supabase (PostgreSQL).
- **Deployment:** Vercel.

## High-Level System Flow
1. **Client-Side:** Intern triggers attendance -> Camera activation (local) -> GPS capture -> Metadata sent to Backend.
2. **Server-Side:** Backend receives metadata -> Validates GPS against Office Coordinates -> Fetches Server Time -> Saves to Database.
3. **Database:** Stores attendance metadata and user information.

## Responsibilities
### Frontend
- User interface and experience.
- Handling Browser APIs (Camera, Geolocation).
- Local state management.
- Communicating with Backend API.

### Backend
- Authentication and Authorization.
- GPS validation logic (Distance calculation).
- Business logic for attendance status (Late/Present).
- Interfacing with Supabase.

### Database
- Persistent storage for users, offices, and attendance records.
- Ensuring data integrity.

*Note: Detailed architecture diagrams and component breakdowns will be expanded after PRD approval.*