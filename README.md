# MediTrakk

**MediTrakk** is a full-stack patient health record & appointment system built with Node.js, Express, MongoDB, and React (frontend coming soon). It allows patients to book appointments, doctors to manage their schedules, and admins to monitor system-wide stats and roles.


---

# User Roles
**Patient**:

    Register/Login

    Book & cancel appointments

    Upload & view reports

    View profile

**Doctor**:

    View appointments

    View reports of their patients

    View profile

**Admin**:

    View all users
    
    Update user roles (WIP)
    
    View system stats (WIP)

---

## Tech Stack

- **Frontend:**  React, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT (JSON Web Token)
- **File Uploads:** Multer
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

Create a `.env` file in the `/server` and `/frontend` directory with the following:

server:
```env
PORT=5000
MONGO_URI=your_mongo_uri_here
JWT_SECRET=your_jwt_secret_here
```

frontend:
```
VITE_API_URL=http://localhost:5000/api
```


Setup Instructions

1. Clone the repo
```bash
git clone https://github.com/your-username/mediTrakk.git
cd mediTrakk
```
2. Set up Backend
```bash
cd server
npm install
npm run dev
```
3. Set up Frontend
```bash
cd client
npm install
npm run dev
```


Features Implemented

✅ JWT-based Authentication & Authorization

✅ Role-based access control

✅ Patient Appointment Booking & Cancellation

✅ Report Upload (PDF/JPG/PNG)

✅ Doctor can view reports of their assigned patients

✅ User-friendly UI with reusable components

✅ RESTful API design

✅ Protected Routes on Frontend


 To Do (In Progress)

⏳ Admin Dashboard

⏳ Forgot Password Flow

⏳ Search/Filter Appointments

⏳ Pagination for reports

Contributing
Pull requests are welcome! For major changes, open an issue first.

👤 **Author**  
[Priyansh Patel](https://www.linkedin.com/in/priyansh-patel-091b3824b/)




📄 **License**  
This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
