# Sports Facility Court Booking Platform

This is a full-stack demo implementation of the Sports Facility Court Booking assignment.

It supports:

- **Multi-Resource Scheduling**  
  - Court availability
  - Shared equipment stock (rackets, shoes)
  - Optional coach availability

- **Dynamic Pricing Engine**
  - Weekend surcharge
  - Peak-hour multiplier
  - Court-type surcharge
  - Equipment fees
  - Live price preview on the booking screen

- **Admin Dashboard**
  - Add courts and base prices
  - Add dynamic pricing rules
  - Add coaches and toggle their availability

---

## 1. Tech Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** MongoDB + Mongoose

---

## 2. Getting Started

### 2.1. Prerequisites

- Node.js (LTS)
- npm or yarn
- MongoDB running locally (or a MongoDB Atlas URI)

---

## 3. Backend Setup

```bash
cd backend
cp .env.example .env    # edit MONGO_URI if needed
npm install
npm run dev             # or: npm start
```

By default the API runs at: `http://localhost:5000`.

Main endpoints:

- `GET /api/courts`
- `POST /api/courts/admin`
- `GET /api/coaches`
- `POST /api/coaches/admin`
- `PATCH /api/coaches/admin/:id/toggle`
- `GET /api/equipment`
- `POST /api/equipment/admin`
- `GET /api/pricing-rules`
- `POST /api/pricing-rules/admin`
- `GET /api/bookings?date=YYYY-MM-DD`
- `POST /api/bookings/preview-price`
- `POST /api/bookings`

---

## 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Create a `.env` file in `frontend/` if you want to override the API base:

```bash
VITE_API_BASE=http://localhost:5000
```

Default: `http://localhost:5000`.

The dev site will run on: `http://localhost:5173`.

---

## 5. Basic Flow

1. **Admin:**
   - Open Admin Dashboard tab.
   - Add courts (with base price).
   - Add at least one pricing rule (e.g., weekend surcharge, peak hours).
   - Add coaches and mark them available.
   - Optionally add equipment from API (using tools like Postman):
     - `POST /api/equipment/admin` with `{ "name": "racket", "totalStock": 10 }`
     - `POST /api/equipment/admin` with `{ "name": "shoes", "totalStock": 8 }`

2. **Player Booking:**
   - Open Player Booking tab.
   - Select date, court, and time slot.
   - Choose number of rackets/shoes and optional coach.
   - Watch **Live Price** update dynamically.
   - Confirm booking; backend validates:
     - overlapping court bookings,
     - overlapping coach bookings,
     - global equipment stock for that slot.

3. **Pricing Breakdown:**
   - Each booking stores `pricingBreakdown` with all components:
     - `basePrice`
     - `weekendFee`
     - `peakHourFee`
     - `courtTypeFee`
     - `equipmentFee`
     - `total`

You can extend this with authentication, more complex rule types, holiday calendars, etc.
