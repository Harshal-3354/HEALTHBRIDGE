import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import DoctorsListPage from "./pages/DoctorsListPage";
import DoctorDetailPage from "./pages/DoctorDetailPage";
import DoctorAvailabilityPage from "./pages/DoctorAvailabilityPage";
import MyAppointmentsPage from "./pages/MyAppointmentsPage";
import DoctorAppointmentsPage from "./pages/DoctorAppointmentsPage";
// import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/patient/doctors" element={<DoctorsListPage />} />
        <Route path="/patient/doctors/:id" element={<DoctorDetailPage />} />
        <Route path="/patient/appointments" element={<MyAppointmentsPage />} />
        <Route
          path="/doctor/availability"
          element={<DoctorAvailabilityPage />}
        />
        <Route
          path="/doctor/appointments"
          element={<DoctorAppointmentsPage />}
        />
        <Route
          path="*"
          element={<div className="p-4 text-center">Page not found</div>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
