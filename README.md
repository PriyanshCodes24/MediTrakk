# MediTrakk

**MediTrakk** is a full-stack web application for managing patient health records, appointments, and prescriptions, with role-based access for **patients**, **doctors**, and **admins**.

---

## Features

- 🔐 JWT-based authentication & authorization
- 🧑‍⚕️ Role-based access control (patient, doctor, admin)
- 📅 Book & manage appointments
- 🔒 Secure password hashing with bcrypt
- 🌐 MongoDB Atlas integration

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Frontend:** React *(Planned)*
- **Authentication:** JWT, bcrypt
- **Deployment:** *(To be added)*

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



## Installation (Backend)

```bash
cd server
npm install
npm run dev
```



👤 **Author**  
[Priyansh Patel](https://www.linkedin.com/in/priyansh-patel-091b3824b/)




📄 **License**  
This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
