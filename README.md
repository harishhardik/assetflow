# AssetFlow: Enterprise Asset & Resource Management System

A centralized ERP platform for tracking, allocating, and maintaining physical assets and shared resources across organizations.

---

##  Quick Overview

**What it does:**
- Register and track assets through their complete lifecycle
- Allocate assets to employees/departments with conflict prevention
- Book shared resources (rooms, vehicles, equipment) without overlaps
- Route maintenance requests through approval workflows
- Run audit cycles and generate discrepancy reports
- Surface overdue returns, maintenance alerts via notifications and dashboards

**Who uses it:**
- **Admin**: Sets up departments, asset categories, promotes roles
- **Asset Manager**: Registers assets, approves transfers & maintenance
- **Department Head**: Approves allocations within their department
- **Employee**: Views allocated assets, books resources, raises maintenance requests

---

##  Architecture Overview

### Tech Stack (Recommended)
- **Frontend**: React + TypeScript (Responsive UI)
- **Backend**: Node.js/Express + PostgreSQL (or your preference)
- **Database**: PostgreSQL with proper foreign keys and constraints
- **Auth**: Simple email/password with role-based access control (RBAC)

### Core Entities

```
1. Users (email, password, role: admin/asset_manager/department_head/employee)
2. Departments (name, head, parent_dept, status)
3. Asset_Categories (name, type-specific fields)
4. Employees (name, email, department, role, status)
5. Assets (tag, name, category, serial, condition, status, location, shared_flag)
6. Allocations (asset, employee, return_date, status)
7. Bookings (resource, employee, start_time, end_time, status)
8. Maintenance_Requests (asset, issue, priority, status, approver)
9. Audit_Cycles (scope, auditors, start_date, status)
10. Audit_Items (cycle, asset, auditor, finding: verified/missing/damaged)
11. Notifications (user, type, content, read_flag)
12. Activity_Logs (user, action, entity, timestamp)
```

---

##  8-Hour Implementation Plan

### **Hours 0–1: Setup & Database (Parallel)**

**Team allocation:**
- **Person A**: Frontend project setup (React, routing, auth UI)
- **Person B**: Backend setup (Node/Express, database schema, migrations)
- **Person C**: Database schema & ERD design
- **Person D**: API contract definitions, test data

**Deliverables:**
- [ ] Database created with 10 core tables + constraints
- [ ] Auth endpoints: signup, login, session validation
- [ ] Frontend app boots with routing (Home, Login, Dashboard, etc.)

---

### **Hours 1–4: Core Features (Modular)**

#### **Parallel Stream 1: Asset Management (Person A + B)**
- [ ] Asset registration form (name, category, serial, location, shared flag)
- [ ] Asset directory / search (filter by tag, serial, category, status)
- [ ] Asset lifecycle display (show current status: Available → Allocated → Under Maintenance, etc.)
- [ ] Per-asset history view (allocation history + maintenance log)

#### **Parallel Stream 2: Allocation & Transfers (Person C + D)**
- [ ] Allocate asset to employee/department form
- [ ] Conflict rule enforcement: block double-allocation, show current holder
- [ ] Transfer request workflow (Requested → Approved → Re-allocated)
- [ ] Return asset: mark returned, capture condition check-in notes, revert to Available

#### **Parallel Stream 3: Organization Setup (Person A)**
- [ ] Department management (create/edit/deactivate, assign head, hierarchy)
- [ ] Asset category management (with optional category-specific fields)
- [ ] Employee directory (name, email, dept, role, status)
- [ ] Role assignment (admin promotes to Department Head / Asset Manager)

#### **Parallel Stream 4: Bookings (Person B)**
- [ ] Calendar view of resource bookings
- [ ] Book resource form (select resource, start time, end time)
- [ ] Overlap validation (reject if times conflict, allow adjacent bookings)
- [ ] Booking status tracking (Upcoming → Ongoing → Completed / Cancelled)

**Deliverables by hour 4:**
- [ ] Asset CRUD fully working
- [ ] Allocation workflows (no double-allocation, transfer approval)
- [ ] Booking system with conflict detection
- [ ] Organization setup screens
- [ ] Basic dashboard with KPI cards

---

### **Hours 4–6: Advanced Features**

#### **Maintenance Workflow (Person C)**
- [ ] Raise maintenance request (select asset, issue, priority, photo)
- [ ] Workflow: Pending → Approved/Rejected → Assigned → In Progress → Resolved
- [ ] Auto-update asset status to "Under Maintenance" on approval
- [ ] Auto-revert to Available on resolution

#### **Audit Cycles (Person D)**
- [ ] Create audit cycle (scope, date range)
- [ ] Assign auditors
- [ ] Auditor marks assets: Verified / Missing / Damaged
- [ ] Auto-generate discrepancy report
- [ ] Close cycle: lock & update asset statuses (Lost items flagged, etc.)

#### **Notifications & Logs (Person A + B)**
- [ ] Toast notifications on key actions (Asset Assigned, Maintenance Approved, etc.)
- [ ] Activity log page (who did what, when)
- [ ] Overdue return alerts (past Expected Return Date)

**Deliverables by hour 6:**
- [ ] All core workflows end-to-end
- [ ] Maintenance approval system working
- [ ] Audit cycle creation + reporting
- [ ] Notification system live

---

### **Hours 6–7: Dashboard & Reports (Person A)**
- [ ] KPI cards: Assets Available, Assets Allocated, Maintenance Today, Active Bookings, Pending Transfers, Upcoming Returns
- [ ] Overdue returns highlighted
- [ ] Quick action buttons (Register Asset, Book Resource, Raise Maintenance)
- [ ] Basic analytics: asset utilization trends, maintenance frequency by category

**Deliverables by hour 7:**
- [ ] Dashboard displays real KPIs from database
- [ ] Report export to CSV
- [ ] Responsive layout

---

### **Hour 7–8: Polish, Testing & Demo**
- [ ] Cross-browser testing
- [ ] Business rule validation (no expired workflows, conflict detection works)
- [ ] UI refinement: spacing, colors, loading states
- [ ] Demo script: show asset lifecycle, booking conflict, maintenance approval, audit cycle

---

##  Database Schema (DDL Overview)

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  role VARCHAR CHECK (role IN ('admin', 'asset_manager', 'department_head', 'employee')),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE departments (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  head_id INT REFERENCES users(id),
  parent_id INT REFERENCES departments(id),
  status VARCHAR CHECK (status IN ('Active', 'Inactive')) DEFAULT 'Active'
);

CREATE TABLE employees (
  id INT PRIMARY KEY REFERENCES users(id),
  name VARCHAR NOT NULL,
  department_id INT REFERENCES departments(id),
  status VARCHAR CHECK (status IN ('Active', 'Inactive')) DEFAULT 'Active'
);

CREATE TABLE asset_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  type VARCHAR, -- e.g., 'Electronics', 'Furniture', 'Vehicles'
  metadata JSONB -- for category-specific fields
);

CREATE TABLE assets (
  id SERIAL PRIMARY KEY,
  tag VARCHAR UNIQUE NOT NULL, -- e.g., AF-0001
  name VARCHAR NOT NULL,
  category_id INT REFERENCES asset_categories(id),
  serial_number VARCHAR,
  acquisition_date DATE,
  acquisition_cost DECIMAL(10,2),
  condition VARCHAR CHECK (condition IN ('New', 'Good', 'Fair', 'Poor')) DEFAULT 'Good',
  location VARCHAR,
  status VARCHAR CHECK (status IN ('Available', 'Allocated', 'Reserved', 'Under Maintenance', 'Lost', 'Retired', 'Disposed')) DEFAULT 'Available',
  shared BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE allocations (
  id SERIAL PRIMARY KEY,
  asset_id INT REFERENCES assets(id) NOT NULL,
  employee_id INT REFERENCES employees(id),
  department_id INT REFERENCES departments(id),
  expected_return_date DATE,
  actual_return_date DATE,
  return_condition_notes TEXT,
  status VARCHAR CHECK (status IN ('Active', 'Returned', 'Overdue')) DEFAULT 'Active',
  allocated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  asset_id INT REFERENCES assets(id) NOT NULL,
  employee_id INT REFERENCES employees(id) NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  status VARCHAR CHECK (status IN ('Upcoming', 'Ongoing', 'Completed', 'Cancelled')) DEFAULT 'Upcoming',
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT no_overlap CHECK (start_time < end_time)
);

CREATE TABLE maintenance_requests (
  id SERIAL PRIMARY KEY,
  asset_id INT REFERENCES assets(id) NOT NULL,
  issue_description TEXT NOT NULL,
  priority VARCHAR CHECK (priority IN ('Low', 'Medium', 'High')) DEFAULT 'Medium',
  status VARCHAR CHECK (status IN ('Pending', 'Approved', 'Rejected', 'In Progress', 'Resolved')) DEFAULT 'Pending',
  approver_id INT REFERENCES users(id),
  assigned_technician_id INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP
);

CREATE TABLE audit_cycles (
  id SERIAL PRIMARY KEY,
  scope VARCHAR, -- e.g., 'Department-1', 'Building-A'
  start_date DATE,
  end_date DATE,
  status VARCHAR CHECK (status IN ('Draft', 'Active', 'Closed')) DEFAULT 'Draft',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE audit_items (
  id SERIAL PRIMARY KEY,
  cycle_id INT REFERENCES audit_cycles(id),
  asset_id INT REFERENCES assets(id),
  auditor_id INT REFERENCES users(id),
  finding VARCHAR CHECK (finding IN ('Verified', 'Missing', 'Damaged')) NOT NULL
);

CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  type VARCHAR, -- 'asset_assigned', 'maintenance_approved', etc.
  message TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE activity_logs (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  action VARCHAR, -- 'created', 'updated', 'deleted', 'approved'
  entity_type VARCHAR, -- 'asset', 'allocation', 'maintenance', etc.
  entity_id INT,
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

##  Critical Business Rules (MUST Implement)

1. **No double-allocation**: An asset already held by someone cannot be allocated again. System must show current holder and offer transfer instead.
2. **Conflict-free bookings**: Two bookings cannot overlap. Adjacent bookings (9:00–10:00 and 10:00–11:00) are allowed.
3. **Status auto-updates**:
   - Allocate → Asset status = "Allocated"
   - Approve maintenance → Asset status = "Under Maintenance"
   - Complete maintenance → Asset status = "Available" (unless Retired)
   - Return asset → Asset status = "Available"
4. **Overdue tracking**: Allocations past Expected Return Date are auto-flagged and appear on Dashboard.
5. **Role-based workflows**: Asset Manager approves transfers/maintenance; Department Head approves within their dept.
6. **Audit closure**: Closing an audit cycle locks it and updates asset statuses (Lost items flagged, etc.).

---

## 🛠️ Team Work Division (Recommended)

| Person | Role | Modules | Dependencies |
|--------|------|---------|--------------|
| **A** | Frontend Lead | UI/UX, Org Setup, Dashboard, Notifications | Depends on APIs from B |
| **B** | Backend Lead | Auth, Asset CRUD, Booking API, Maintenance API | Database schema from C |
| **C** | Database & Audit | Schema design, Audit cycles, Reports, ERD | Initial setup in hour 0 |
| **D** | Allocation & Workflows | Transfer logic, Conflict detection, Test suite | APIs from B, UI from A |

**Sync points:**
- Hour 1: All agree on API contract (endpoints, request/response shapes)
- Hour 3: Integration test (frontend calls backend successfully)
- Hour 6: All features merged, test full workflows end-to-end
- Hour 8: Final demo

---

## 📱 UI Screens (Priority Order)

### Tier 1 (Must Have by Hour 4)
1. Login / Signup
2. Dashboard (KPIs, quick actions)
3. Asset Registry & Search
4. Allocate Asset Form
5. Booking Calendar

### Tier 2 (Must Have by Hour 6)
6. Organization Setup (Departments, Categories, Employees)
7. Maintenance Request Form & Workflow
8. Audit Cycle Creation & Review

### Tier 3 (Nice to Have by Hour 8)
9. Department ESG Rankings (AssetFlow variant: asset utilization by dept)
10. Mobile-responsive refinement
11. Dark mode

---

##  Testing Checklist

By hour 8, validate:

- [ ] **Auth**: Login rejects invalid credentials, session persists
- [ ] **No double-allocation**: Trying to allocate an already-held asset shows error
- [ ] **Booking overlap**: Conflicting booking times rejected, adjacent allowed
- [ ] **Status transitions**: Asset status updates correctly through lifecycle
- [ ] **Maintenance approval**: Asset marked "Under Maintenance" on approval, "Available" on resolution
- [ ] **Overdue alerts**: Dashboard flags allocations past return date
- [ ] **Audit closure**: Closing cycle locks it and marks missing items "Lost"
- [ ] **Role-based access**: Employees cannot approve transfers; Asset Manager can
- [ ] **Notifications**: At least 3 notification types fire (Asset Assigned, Maintenance Approved, Overdue Alert)

---

##  How to Run

### Backend Setup
```bash
npm install
npm run migrate  # Run database migrations
npm start        # Starts on http://localhost:5000
```

### Frontend Setup
```bash
npm install
npm start        # Starts on http://localhost:3000
```

### Seed Data (Optional, for demo)
```bash
npm run seed
```

---

##  API Endpoints (Reference)

### Auth
- `POST /api/auth/signup` – Create employee account
- `POST /api/auth/login` – Email/password login
- `GET /api/auth/me` – Current user & role
- `POST /api/auth/logout` – Clear session

### Assets
- `POST /api/assets` – Register asset
- `GET /api/assets` – Search/filter (by tag, category, status, location)
- `GET /api/assets/:id` – Asset detail + history
- `PUT /api/assets/:id/status` – Update status (Admin/Manager only)

### Allocations
- `POST /api/allocations` – Allocate asset to employee
- `POST /api/allocations/:id/transfer` – Request transfer (shows conflict, offers transfer)
- `POST /api/allocations/:id/return` – Mark returned, capture condition
- `GET /api/allocations?status=overdue` – List overdue allocations

### Bookings
- `POST /api/bookings` – Create booking (validates overlap)
- `GET /api/bookings/:asset_id/calendar` – Calendar view
- `DELETE /api/bookings/:id` – Cancel booking

### Maintenance
- `POST /api/maintenance` – Raise request
- `PUT /api/maintenance/:id/approve` – Approve (Asset Manager)
- `PUT /api/maintenance/:id/resolve` – Mark resolved
- `GET /api/maintenance` – List by status

### Audits
- `POST /api/audits` – Create cycle
- `POST /api/audits/:id/items` – Mark asset (Verified/Missing/Damaged)
- `POST /api/audits/:id/close` – Lock cycle, generate report
- `GET /api/audits/:id/report` – Export discrepancy report

### Admin
- `POST /api/departments` – Create department
- `POST /api/categories` – Create asset category
- `POST /api/employees/:id/promote` – Promote to Manager/Head (Admin only)

---

##  Tips for Success

1. **Start with auth**: Everything depends on knowing who the user is. Lock this down first.
2. **Mock data early**: Create 5–10 fake assets, users, and allocations so you can test UI without waiting for APIs.
3. **Test business rules continuously**: Don't assume status transitions work; write small tests for each rule.
4. **Separate concerns**: API logic in backend, UI rendering in frontend, database triggers for data integrity.
5. **Use Postman/Insomnia**: Test API endpoints independently before wiring up the frontend.
6. **Commit every hour**: You can always revert; commit gives you a safety net.
7. **Leave an hour for integration**: The last hour should be "wire it all together and demo," not "implement new features."

---

##  Success Criteria (Judging)

By end of hackathon:
- ✅ Users can register, login, and see their role-based dashboard
- ✅ Assets can be registered, allocated, and returned (full lifecycle)
- ✅ Bookings prevent overlaps
- ✅ Maintenance requests flow through approval and update asset status
- ✅ Audit cycles run and flag discrepancies
- ✅ Database enforces business rules (no orphaned allocations, valid status transitions)
- ✅ At least one report exports (CSV)
- ✅ Notifications or activity log works
- ✅ Responsive UI on desktop (mobile bonus)

---

## 🎯 Bonus Features (If Time Permits)

- Department-wise asset utilization heatmap
- Mobile app (React Native)
- Email reminders for overdue returns
- Advanced filtering in Asset Registry
- PDF export for audit reports
- Dark mode
- QR code scanning for assets
- Attachment uploads (photos for maintenance)

---

## 📚 References

- **Problem Statement**: See uploaded `AssetFlow_problem_statement.pdf`
- **Mockup**: https://app.excalidraw.com/l/65VNwvy7c4X/5ceOBMjbDby
- **Git Repo**: (Set up your own GitHub org)






