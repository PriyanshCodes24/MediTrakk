# MediTrakk

**MediTrakk** is a full-stack patient health record & appointment system built with Node.js, Express, MongoDB, and React (frontend coming soon). It allows patients to book appointments, doctors to manage their schedules, and admins to monitor system-wide stats and roles.


---

## Features

### 👤 Authentication & Authorization
- Register & login (Patient, Doctor)
- JWT protected routes
- Role-based access control (`admin`, `doctor`, `patient`)

### 📅 Appointment System
- Patients: Book appointments with doctors
- Doctors: Approve or reject appointments
- Admin: View all appointments
- All: Cancel own appointments (Admins can cancel any)

### 📊 Admin Dashboard
- View total users, doctors, patients, appointments
- Promote users to doctor
- Create new admins (only by admin)

### 👤 User Management
- Get own profile
- Update name or email

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT (JSON Web Token)
- **Validation:** express-validator
- **Middleware:** Custom role-based auth, centralized error handling
- **Testing Tool:** Postman

---

## API Endpoints (Sample)

- `POST /api/register` – Register a new user
- `POST /api/login` – Login and receive JWT token
- `POST /api/appointments` – Create appointment *(patient only)*
- `GET /api/users/me` – Get logged-in user's profile

---

## Environment Variables

Create a `.env` file in the `/server` directory with the following:

```env
PORT=5000
MONGO_URI=your_mongo_uri_here
JWT_SECRET=your_jwt_secret_here
```


🚀 Setup Instructions

1. Clone the repo
```bash
git clone https://github.com/your-username/mediTrakk.git
cd mediTrakk
```
2. Install dependencies
```bash
npm install
```
3. Start the server
```bash
npm run dev
```

## Installation (Backend)

```bash
cd server
npm install
npm run dev
```

📬 API Endpoints (Highlights)
Route	                        Method	Role	                Description
--------------------------------------------------------------------------------------------------------------------------
/api/auth/register	            POST	Public	                Register a patient or doctor
/api/auth/login	                POST	Public	                Login & receive token
/api/appointments	            POST	Patient	                Book appointment
/api/appointments/patient	    GET	    Patient	                View own appointments
/api/appointments/doctor	    GET	    Doctor	                View own appointments
/api/appointments/:id/status	PUT	    Doctor	                Approve/Reject
/api/appointments/:id	        DELETE  Patient/Doctor/Admin	Cancel appointment
/api/admin/stats	            GET	    Admin	                View app stats
/api/admin/create-admin	        POST	Admin	                Create new admin
/api/admin/:id/make-doctor	    PUT	    Admin	                Promote user to doctor

✅ All input data is validated using express-validator.


🧾 To-Do

 ✅Role-based auth middleware

 ✅Appointment management

 ✅Admin control panel (API)

 ✅Request validation

 ⬜React frontend (coming soon)

 ⬜Upload reports & prescriptions

 ⬜Filter & sort appointments

🤝 Contributing
Pull requests are welcome! For major changes, open an issue first.

👤 **Author**  
[Priyansh Patel](https://www.linkedin.com/in/priyansh-patel-091b3824b/)




📄 **License**  
This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
