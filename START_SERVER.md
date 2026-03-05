# 🏥 Hospital Management System - Complete Guide

## ✨ What's New

✅ **Modern Design** - Beautiful gradient UI with smooth animations  
✅ **Doctor Booking Modal** - Book appointments directly from doctor cards  
✅ **Patient Management** - View all patients in a clean grid layout  
✅ **Confirmation Messages** - See success messages after booking  
✅ **English Interface** - Full English text throughout  
✅ **No Dashboard** - Removed dashboard, focusing on core features  
✅ **Responsive Design** - Works perfectly on mobile, tablet, and desktop

---

## 🚀 How to Run the System

### **Quick Start (Recommended)**

Open **2 different PowerShell terminals**:

**Terminal 1 - Start Backend (JSON Server):**

```powershell
cd "c:\Users\Microsoft\Desktop\hospital_Project\Backend"
npx json-server --watch db.json --port 3000
```

**Terminal 2 - Start Frontend (Vite Dev Server):**

```powershell
cd "c:\Users\Microsoft\Desktop\hospital_Project\frontend"
npm run dev
```

---

## 🌐 Access the Website

Once both servers are running:

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000

---

## 📋 Features

### Home Page

- Beautiful hero section with call-to-action buttons
- Navigation with user profile (if logged in)
- Features section explaining the benefits
- Logout functionality for authenticated users

### Doctors Page

- Browse all available doctors
- View doctor specialization, rating, experience, and number of patients
- **Click "Book Appointment"** to open the booking modal
- Select date and time for your appointment
- See confirmation message after booking

### Patients Page

- View all registered patients
- Clean card layout with patient information
- Access to individual patient profiles

### Authentication

- Login page for existing users
- Register page to create new accounts
- Protected routes for authenticated users

---

## 🎨 Database

Your data is stored in `Backend/db.json`:

```json
{
  "patients": [
    {
      "id": "1",
      "name": "Ahmed Ali",
      "age": 35,
      "gender": "Male",
      "phone": "01012345678",
      "email": "ahmed.ali@example.com"
    }
  ],
  "doctors": [
    {
      "id": "1",
      "name": "Dr. Sarah Mitchell",
      "specialization": "Cardiology",
      "phone": "01122334455",
      "email": "sarah.mitchell@example.com",
      "bio": "Experienced cardiologist...",
      "rating": 4.8,
      "image": "https://...",
      "experience": "10 Years",
      "patients": 250
    }
  ],
  "appointments": [
    {
      "id": "c0f2",
      "patientId": "dbdf",
      "patientName": "hagar",
      "doctorId": "2",
      "doctorName": "Dr. Omar Hassan",
      "date": "2026-01-09T13:43",
      "status": "pending"
    }
  ]
}
```

---

## 🔐 Test Credentials

You can use any email/password to login:

- **Email:** test@example.com
- **Password:** Test123

---

## 🛠️ Troubleshooting

### Doctors not showing?

- Make sure Backend server is running on port 3000
- Check that `Backend/db.json` exists and has data

### Can't book appointment?

- Ensure you're logged in first
- Check browser console for errors (F12 → Console)

### Port already in use?

- Frontend: Change port in `vite.config.ts`
- Backend: Use `npx json-server --watch db.json --port 3001`

---

## 📱 Tech Stack

- **Frontend:** React + TypeScript + Vite
- **Backend:** JSON Server
- **Styling:** Modern CSS with gradients and animations
- **Routing:** React Router v6

---

## 👨‍💻 Project Structure

```
hospital_Project/
├── Backend/
│   ├── db.json (Your data)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/ (Home, Doctors, Patients, etc.)
│   │   ├── components/ (Reusable components)
│   │   ├── styles/ (CSS files)
│   │   ├── context/ (Auth context)
│   │   └── api/ (API client)
│   └── package.json
└── START_SERVER.md (This file)
```

---

## ✨ Enjoy Your Modern Hospital System!

Once both servers are running:

- **Frontend**: http://localhost:5175 (or shown port)
- **Backend API**: http://localhost:3000
  - Doctors: http://localhost:3000/doctors
  - Patients: http://localhost:3000/patients
  - Appointments: http://localhost:3000/appointments

---

## 🔍 Testing the Doctors List

1. Open http://localhost:5175
2. Click "Find Doctors" or "Browse Doctors"
3. You should now see all 5 doctors with:
   - Professional HD photos (600x600px)
   - Specialization
   - Rating
   - Years of experience
   - Number of patients

---

## ⚠️ Troubleshooting

**Problem**: Doctors list still shows empty

- **Solution**: Make sure **JSON Server is running** on port 3000
- Check: Open http://localhost:3000/doctors in your browser
- Should see JSON data with all doctors

**Problem**: Port 3000 is already in use

- **Solution**: Change port in the command:

```powershell
npx json-server --watch db.json --port 3001
```

Then update API calls in code to use port 3001

**Problem**: Frontend shows connection error

- **Solution**: Make sure backend is running first, then start frontend

---

## 📊 Database Structure

The system has 3 main endpoints:

1. **Doctors** - All medical specialists with images
2. **Patients** - Users registered in the system
3. **Appointments** - Bookings connecting patients and doctors

All data is stored in: `Backend/db.json`

---

## 🎉 You're All Set!

Your hospital management website is ready. Both servers must be running for the website to work properly.
