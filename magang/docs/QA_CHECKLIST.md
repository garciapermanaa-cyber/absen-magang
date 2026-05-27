# QA Checklist — MagangTrack

## Documentation QA
- [x] Are all required docs created (README, PROJECT_CONTEXT, PRD, ARCHITECTURE, ROADMAP, QA_CHECKLIST)?
- [x] Does PRD explain MVP clearly?
- [x] Does PRD define data stored and not stored?
- [x] Does PRD clearly state photos are not uploaded or stored?
- [x] Does PRD clearly state server/database timestamp is source of truth?
- [x] Does PRD clearly state GPS validation happens on backend?
- [x] Does PRD avoid application code?

## Product Logic QA (Future)
- [ ] Does the system reject attendance outside the radius?
- [ ] Is the "Late" status correctly assigned?
- [ ] Is the "Early Checkout" status correctly assigned?
- [ ] Does the camera activation work on mobile browsers?
- [ ] Is the GPS accuracy handled correctly?

## Security & Privacy QA (Future)
- [ ] Verify no images are sent in network requests.
- [ ] Verify no images exist in database/storage.
- [ ] Check RLS policies in Supabase.
- [ ] Ensure HTTPS is enforced.