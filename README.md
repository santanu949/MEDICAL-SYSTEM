<div align="center">

<img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
<img src="https://img.shields.io/badge/TailwindCSS-3-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white" />
<img src="https://img.shields.io/badge/Framer_Motion-latest-FF0055?style=for-the-badge&logo=framer&logoColor=white" />
<img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />

<br/><br/>

<h1>🏥 ClinicalOS — Hospital Ward Management System</h1>

<p align="center">
  <b>A modern, role-based clinical task management platform built for hospital ward teams.</b><br/>
  Manage patients, dispatch tasks, track activity timelines, and receive real-time notifications — all in one place.
</p>

<br/>

![ClinicalOS Banner](https://img.shields.io/badge/Status-Live_Preview-brightgreen?style=flat-square)
![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-blue?style=flat-square)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🧑‍⚕️ **Role-Based Access** | Switch between Doctor, Nurse, and Lab roles — each with different permissions |
| 🛏️ **Patient Management** | View all ward patients with status, vitals, MRN, room, and blood type |
| ✅ **Task Dispatch System** | Doctors create clinical tasks and assign them to specific units |
| ⏱️ **Auto Delay Detection** | Tasks pending for over 30 seconds are automatically flagged as Delayed |
| 🕐 **Clinical Timeline** | A live, chronological activity log per patient |
| 🔔 **Real-Time Notifications** | Animated toast notifications for task updates, delays, and room changes |
| 🏠 **Editable Room Numbers** | Edit patient room assignments with an inline slider (1–100) |
| 📱 **Fully Responsive** | Works on mobile, tablet, and desktop with a dedicated mobile bottom nav |
| 💎 **Glassmorphism UI** | Premium frosted-glass aesthetic with smooth Framer Motion animations |

---

## 🖥️ Screenshots

### Dashboard View
```
┌─────────────────────────────────────────────┐
│           🏥 ClinicalOS  Navbar             │
├──────────────┬──────────────────────────────┤
│  Patient     │   PatientHero (vitals card)  │
│  Sidebar     ├───────────────┬──────────────┤
│  (Ward List) │   Timeline    │  Task Panel  │
│              │   (Events)    │  (Tasks)     │
└──────────────┴───────────────┴──────────────┘
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18 or higher
- **npm** v9 or higher

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/santanu949/MEDICAL-SYSTEM.git

# 2. Navigate into the project
cd MEDICAL-SYSTEM

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Open your browser and go to **`http://localhost:5173`**

### Build for Production

```bash
npm run build
```

---

## 🗂️ Project Structure

```
MEDICAL-SYSTEM/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx                      # App entry point
    ├── App.jsx                       # Root layout + React Router
    ├── index.css                     # Global design tokens (Tailwind)
    │
    ├── data/
    │   └── mockData.js               # Seed patients, tasks & timeline
    │
    ├── context/
    │   └── MedicalContext.jsx        # Global state (Context API)
    │
    ├── pages/
    │   ├── Dashboard.jsx             # Main ward dashboard  (/)
    │   ├── PatientsPage.jsx          # All patients grid    (/patients)
    │   └── TasksPage.jsx             # All tasks list       (/tasks)
    │
    └── components/
        ├── layout/
        │   ├── Navbar.jsx            # Floating glassmorphism navbar
        │   └── MobileFooter.jsx      # Mobile bottom navigation
        ├── patient/
        │   ├── PatientSidebar.jsx    # Ward overview + patient selector
        │   └── PatientHero.jsx       # Vitals card with room editor
        ├── tasks/
        │   ├── TaskPanel.jsx         # Dashboard task widget
        │   ├── TaskCard.jsx          # Individual task row
        │   └── CreateTaskModal.jsx   # Animated task creation modal
        ├── timeline/
        │   └── Timeline.jsx          # Chronological event log
        └── notifications/
            └── NotificationToast.jsx # Animated toast notifications
```

---

## 🧠 Architecture

The app uses **React Context API** as its state management layer — no Redux or external store needed.

```
MedicalContext (Global Brain)
│
├── State:  patients, tasks, timeline, notifications, role, selectedPatientId
├── Derived: selectedPatient, patientTasks, patientTimeline, unreadNotifications
└── Actions: createTask, updateTaskStatus, updatePatientRoom, dismissNotification
```

### ⏱️ Auto Delay System
Every **10 seconds**, the context polls all tasks:
- If a task has been `Pending` for **> 30 seconds** → status changes to `Delayed`
- A red error notification is fired automatically
- A `delayed` event is appended to the patient's timeline

---

## 👥 Role System

| Role | Can Create Tasks | Can Start/Complete Tasks |
|---|---|---|
| **Doctor** | ✅ Yes | ✅ Any task |
| **Nurse** | ❌ No | ✅ Tasks assigned to Nurse |
| **Lab** | ❌ No | ✅ Tasks assigned to Lab |

Switch roles using the **dropdown in the Navbar** (top-right).

---

## 📋 Task Lifecycle

```
Created (Pending)
    │
    │  [Auto after 30s if not started]
    ├──────────────────→ Delayed
    │
    │  [Staff clicks "Start"]
    ↓
In Progress
    │
    │  [Staff clicks "Complete"]
    ↓
Completed ✅
```

---

## 🎨 Design System

| Token | Color | Usage |
|---|---|---|
| `primary-brand` | `#005f87 → #0097c4` | Buttons, links, active states |
| `on-surface` | Dark grey | Primary text |
| `outline` | Medium grey | Secondary text, borders |
| `surface-container` | Light grey | Card backgrounds |
| `error` | Red | Critical status, error notifications |

**Style**: Glassmorphism — translucent white cards with `backdrop-blur`, smooth `border-radius`, and `box-shadow`.

**Animations**: Framer Motion (`motion/react`) — spring-based modal entrances, timeline slide-ins, toast pop-ups.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| ⚛️ Framework | React 18 |
| ⚡ Build Tool | Vite 5 |
| 🔀 Routing | React Router DOM v6 |
| 🗃️ State | React Context API |
| 🎨 Styling | Tailwind CSS v3 |
| 🎬 Animations | Framer Motion |
| 🔷 Icons | Lucide React |
| 💾 Data | In-memory mock data (no backend) |

---

## 📦 Key Dependencies

```json
{
  "react": "^18",
  "react-router-dom": "^6",
  "tailwindcss": "^3",
  "motion": "latest",
  "lucide-react": "latest"
}
```

---

## 🔮 Future Enhancements

- [ ] 🔐 Authentication & protected routes
- [ ] 🗄️ Backend API integration (Node.js / Firebase / Supabase)
- [ ] 📊 Analytics dashboard (task completion rates, response times)
- [ ] 🌙 Dark mode support
- [ ] 📤 Export patient reports as PDF
- [ ] 🔍 Advanced patient search & filtering
- [ ] 📅 Task scheduling & calendar view
- [ ] 💬 Inter-staff messaging system

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

```bash
# 1. Fork the repository
# 2. Create a feature branch
git checkout -b feature/your-feature-name

# 3. Commit your changes
git commit -m "feat: add your feature"

# 4. Push to your fork
git push origin feature/your-feature-name

# 5. Open a Pull Request
```

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with ❤️ for modern healthcare teams

⭐ **Star this repo** if you found it useful!

</div>
