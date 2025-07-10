import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import {
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";

const MyAppointmentsPage = () => {
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        const patientId = decoded.userId;

        const res = await axios.get(
          `http://localhost:5000/api/appointments/patient/${patientId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const now = new Date();
        const past = [];
        const upcoming = [];

        res.data.forEach((appt) => {
          const apptEnd = new Date(appt.endTime);
          if (apptEnd < now) {
            past.push(appt);
          } else {
            upcoming.push(appt);
          }
        });

        setUpcomingAppointments(upcoming);
        setPastAppointments(past);
      } catch (err) {
        console.error(err);
        setError("Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "cancelled":
        return "error";
      case "confirmed":
        return "info";
      default:
        return "warning";
    }
  };

  const renderSection = (title, appointments) => (
    <>
      <Typography variant="h6" className="mt-6 mb-2">
        {title}
      </Typography>
      {appointments.length === 0 ? (
        <Typography variant="body2" color="textSecondary">
          No {title.toLowerCase()}.
        </Typography>
      ) : (
        appointments.map((appt) => (
          <Card
            key={appt._id}
            className="mb-4 shadow-md border border-gray-100 hover:shadow-lg"
          >
            <CardContent className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <Avatar
                src={appt.doctorId.profilePicture}
                alt={appt.doctorId.name}
                sx={{ width: 64, height: 64 }}
              />

              <div className="flex-1 w-full">
                <Typography variant="h6">{appt.doctorId.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {appt.doctorId.specialization}
                </Typography>

                <Typography>
                  <strong>Date:</strong>{" "}
                  {dayjs(appt.startTime).format("MMM D, YYYY")}
                </Typography>

                <Typography>
                  <strong>Time:</strong>{" "}
                  {dayjs(appt.startTime).format("h:mm A")} –{" "}
                  {dayjs(appt.endTime).format("h:mm A")}
                </Typography>

                <Typography>
                  <strong>Mode:</strong> {appt.mode}
                </Typography>

                {appt.notes && (
                  <Typography>
                    <strong>Notes:</strong> {appt.notes}
                  </Typography>
                )}

                <Chip
                  label={`Status: ${appt.status}`}
                  color={getStatusColor(appt.status)}
                  size="small"
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Typography variant="h5" gutterBottom>
        My Appointments
      </Typography>

      {loading ? (
        <div className="mt-10 flex justify-center">
          <CircularProgress />
        </div>
      ) : error ? (
        <Alert severity="error" className="mt-4">
          {error}
        </Alert>
      ) : (
        <>
          {renderSection("Upcoming Appointments", upcomingAppointments)}
          {renderSection("Past Appointments", pastAppointments)}
        </>
      )}
    </div>
  );
};

export default MyAppointmentsPage;
