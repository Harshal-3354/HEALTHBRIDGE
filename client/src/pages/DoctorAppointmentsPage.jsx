import React, { useEffect, useState } from "react";
import {
  Tabs,
  Tab,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CircularProgress,
  Avatar,
} from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const DoctorAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [tab, setTab] = useState("upcoming");
  const [loading, setLoading] = useState(true);
  const [doctorId, setDoctorId] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/appointments/doctor/${doctorId}`
      );
      setAppointments(res.data || []);
    } catch (err) {
      console.error("Error fetching appointments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return navigate("/login");
    try {
      const decoded = jwtDecode(token);
      setDoctorId(decoded.userId);
    } catch {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (doctorId) fetchAppointments();
  }, [doctorId]);

  const handleStatusUpdate = async (appointmentId, status) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/appointments/${appointmentId}`,
        {
          status,
        }
      );
      fetchAppointments();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const filteredAppointments = appointments.filter((a) => {
    const now = new Date();
    const start = new Date(a.startTime);
    if (tab === "upcoming") return start >= now && a.status === "pending";
    if (tab === "completed") return a.status === "completed";
    if (tab === "cancelled") return a.status === "cancelled";
    return true;
  });

  return (
    <Box className="p-6 max-w-5xl mx-auto">
      <Typography variant="h5" gutterBottom>
        My Appointments
      </Typography>

      <Tabs
        value={tab}
        onChange={(e, newVal) => setTab(newVal)}
        textColor="primary"
        indicatorColor="primary"
        sx={{ mb: 3 }}
      >
        <Tab label="Upcoming" value="upcoming" />
        <Tab label="Completed" value="completed" />
        <Tab label="Cancelled" value="cancelled" />
      </Tabs>

      {loading ? (
        <CircularProgress />
      ) : filteredAppointments.length === 0 ? (
        <Typography>No appointments in this category.</Typography>
      ) : (
        filteredAppointments.map((a) => (
          <Card key={a._id} className="mb-4">
            <CardContent>
              <Box className="flex items-center gap-4">
                <Avatar src={a.patientId?.photo} />
                <Box>
                  <Typography variant="subtitle1">
                    Patient: {a.patientId?.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Email: {a.patientId?.email}
                  </Typography>
                </Box>
              </Box>

              <Box className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Typography>
                  Date: {dayjs(a.startTime).format("DD MMM YYYY")}
                </Typography>
                <Typography>
                  Time: {dayjs(a.startTime).format("hh:mm A")} –{" "}
                  {dayjs(a.endTime).format("hh:mm A")}
                </Typography>
                <Typography>Status: {a.status}</Typography>
                <Typography>Mode: {a.mode}</Typography>
              </Box>

              {tab === "upcoming" && (
                <Box className="flex gap-3 mt-3">
                  <Button
                    variant="outlined"
                    color="success"
                    onClick={() => handleStatusUpdate(a._id, "completed")}
                  >
                    Mark Completed
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleStatusUpdate(a._id, "cancelled")}
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default DoctorAppointmentsPage;
