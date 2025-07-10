import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Avatar,
  Typography,
  Paper,
  Button,
  CircularProgress,
} from "@mui/material";
import AppointmentModal from "../components/AppointmentModal";
import { jwtDecode } from "jwt-decode";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const DoctorDetailPage = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const token = localStorage.getItem("token");

  let loggedInUserId = null;
  if (token) {
    const decoded = jwtDecode(token);
    loggedInUserId = decoded.userId;
  }

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/doctors/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDoctor(res.data);
      } catch (err) {
        console.error("Failed to fetch doctor", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center mt-20">
        <CircularProgress />
      </div>
    );

  if (!doctor) return <Typography variant="h6">Doctor not found.</Typography>;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="flex justify-center p-6">
        <Paper className="p-6 w-full max-w-2xl">
          <div className="flex flex-col items-center">
            <Avatar
              src={doctor.profilePicture}
              sx={{ width: 100, height: 100 }}
              className="mb-4"
            />
            <Typography variant="h5">{doctor.name}</Typography>
            <Typography variant="body1" color="textSecondary">
              {doctor.specialization} • {doctor.experience} years experience
            </Typography>
            <Typography className="mt-2">{doctor.bio}</Typography>
            <Typography className="mt-2 text-sm text-gray-600">
              Qualifications: {doctor.qualifications}
            </Typography>
            <Typography className="text-sm text-gray-600">
              Clinic Address: {doctor.clinicAddress || "N/A"}
            </Typography>
            <Button variant="contained" onClick={() => setModalOpen(true)}>
              Book Appointment
            </Button>
          </div>
        </Paper>
        {/* Mounting modal at the same level as Paper avoids focus issues */}
        <AppointmentModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          doctorId={id}
          patientId={loggedInUserId}
        />
      </div>
    </LocalizationProvider>
  );
};

export default DoctorDetailPage;
