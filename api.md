# Fire Watcher - Backend API Specification (Django)

This document outlines the required backend structure, data models, and API endpoints needed to support the Fire Watcher frontend.

## 1. Data Models

### User (Custom User Model)
| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID/PK | Unique identifier |
| `name` | String | Full name |
| `email` | Email | Unique email address |
| `phone` | String | Contact number |
| `user_type` | Choice | `public`, `fire_team`, `admin` |
| `badge_number` | String | Optional (for Fire Team) |
| `fire_station` | String | Optional (for Fire Team) |
| `created_at` | DateTime | Auto-now-add |

### Incident
| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID/PK | Unique identifier |
| `reporter` | FK (User) | Incident reporter (null if anonymous) |
| `reporter_name`| String | Cache name for quick access |
| `reporter_phone`| String | Cache phone for quick access |
| `lat` | Decimal | Latitude (Precision: 9, Scale: 6) |
| `lng` | Decimal | Longitude (Precision: 9, Scale: 6) |
| `address` | Text | Human-readable address |
| `description` | Text | Details of the fire |
| `status` | Choice | `new`, `enroute`, `arrived`, `fighting`, `extinguished`, `closed` |
| `created_at` | DateTime | Auto-now-add |
| `updated_at` | DateTime | Auto-now |

### StatusUpdate (Audit/Timeline)
| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID/PK | Unique identifier |
| `incident` | FK (Incident) | Associated incident |
| `status` | Choice | New status |
| `updated_by` | FK (User) | Who made the update |
| `notes` | Text | Optional notes (e.g., "Team Alpha dispatched") |
| `timestamp` | DateTime | Auto-now-add |

### IncidentPhoto
| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID/PK | Unique identifier |
| `incident` | FK (Incident)| Associated incident |
| `image` | ImageField | Uploaded photo |
| `uploaded_at` | DateTime | Auto-now-add |

---

## 2. API Endpoints

### Authentication (using SimpleJWT or similar)
- `POST /api/auth/register/`: Register a new public user.
- `POST /api/auth/login/`: Obtain JWT tokens.
- `POST /api/auth/token/refresh/`: Refresh JWT token.
- `GET /api/auth/me/`: Get current logged-in user details.

### Incidents
- `GET /api/incidents/`: List incidents.
  - Filter by `status`, `reporter_id`.
  - Pagination required.
- `POST /api/incidents/`: Report a new incident.
  - Required: `lat`, `lng`, `description`, `address`.
  - Optional: `photos` (Multipart form-data).
- `GET /api/incidents/{id}/`: Get detailed information for a specific incident.
- `PATCH /api/incidents/{id}/status/`: Update incident status (Fire Team only).
  - Body: `{ "status": "fighting", "notes": "..." }`
- `GET /api/incidents/{id}/updates/`: Get history of status updates for an incident.

### Dashboard Stats (Fire Team Only)
- `GET /api/dashboard/stats/`: Returns summary of incidents.
  - Example: `{ "new": 5, "active": 2, "resolved": 10, "total": 17 }`

---

## 3. Authorization Rules

| Resource | Action | Permission |
|----------|--------|------------|
| Incidents | List (All) | Fire Team / Admin |
| Incidents | List (My) | Authenticated (Public User) |
| Incidents | Create | Authenticated / Anonymous (Optional) |
| Incidents | Update Status | Fire Team / Admin |
| Stats | View | Fire Team / Admin |

---

## 4. Suggested Implementation Strategy (Django/DRF)

1. **App structure**: `accounts`, `incidents`, `api`.
2. **Serializers**: Use `ModelSerializer` for Incident and User. Ensure `StatusUpdate` is nested or linked in Incident Detail view.
3. **Geo-Support**: While `DecimalField` works for Lat/Lng, `GeoDjango` with `PointField` is recommended if spatial queries (e.g., "find closest station") are needed later.
4. **Real-time**: Consider using **Django Channels** for real-time incident notifications to the Fire Team dashboard.
