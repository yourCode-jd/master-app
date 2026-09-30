# Gym Intelligence Demo

Local-first Gym Intelligence is a PostgreSQL-backed operational demo for member state, staff follow-through, outcomes, member experience, floor operations, reception, and community accountability.

## Prerequisites

- Node.js 20+
- PostgreSQL reachable from the `DATABASE_URL` in `.env`

Copy `.env.example` to `.env`, provide a long local `SESSION_SECRET`, then install dependencies and create the schema:

```bash
npm install
npm run db:push
```

## Demo reset and credentials

Reset all local demo business data and recreate the intentional scenarios:

```bash
npm run db:seed
```

All demo users use password `demo123`:

- `owner@demo.gym`
- `manager@demo.gym`
- `trainer@demo.gym`
- `reception@demo.gym`
- `member@demo.gym`

This seed contains synthetic data only. It includes declining, onboarding, plateau, progress, renewal, experience, equipment-safety, reception, and community scenarios.

## Run locally

```bash
npm run dev -- --hostname 0.0.0.0 --port 3001
```

Open `http://localhost:3001`. The UI explicitly labels local/simulated behavior, including floor occupancy; it does not connect to external messaging, payments, or hardware.

## Verification and local workers

```bash
npm run typecheck
npm test
npm run lint
npm run build
npm run worker:intelligence
npm run worker:outcomes
npm run worker:experience
```

## Architecture

- Next.js App Router server pages and server actions
- Prisma/PostgreSQL persistence with tenant (`gymId`) scoping
- Shared design-system components and responsive card-first layouts
- Signed HTTP-only local sessions and server-side permission checks
- Deterministic intelligence rules and local simulator workers

## Known limitations

- This is a local demo, not a production deployment or medical system.
- Occupancy is manually simulated and stored as historical snapshots; it is not sensor data.
- Notifications are in-app records only. Payments, messaging, and access control are simulated/manual.

## Role access

| Role | Default dashboard | Navigation scope |
| --- | --- | --- |
| Owner | Decision dashboard | Full operational and settings access |
| Manager | Decision dashboard | Operational management, without settings |
| Trainer | Trainer actions | Assigned-member work, journeys, floor, community, notifications |
| Reception | Reception dashboard | Front-desk work, safe member lookup, floor, notifications |
| Member | Own profile | Own dashboard/profile and community only |

Direct access is server-gated for settings (owner), reception (owner/manager/reception), attention (owner/manager/trainer), experience (owner/manager/trainer/reception), and member directory (owner/manager/trainer/reception). Trainer member queries are scoped to assigned members.

## Demo Training Mode

Open **Training Center** from the sidebar after logging in. Start with Member Training, then Trainer, Reception, Manager, Owner, Full Gym Scenario, and Practice Gym Demo. Each account uses password `demo123`.

A gold **TRAINING MODE** pill means a guided scenario is active; it is distinct from the green **DEMO MODE** simulator label. Owner and Manager can reset training progress from Training Center. Reset does not reset the application or delete normal demo data.

