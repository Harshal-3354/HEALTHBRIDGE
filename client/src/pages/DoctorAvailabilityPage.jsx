import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Chip,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const DoctorAvailabilityPage = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [doctorId, setDoctorId] = useState(null);
  const token = localStorage.getItem("token");

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/availability/${doctorId}?date=${selectedDate.format(
          "YYYY-MM-DD"
        )}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSlots(res.data || []);
    } catch (err) {
      setError("Failed to load availability.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setError("Token not found. Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }
    try {
      const decoded = jwtDecode(token);
      if (decoded.userId) {
        setDoctorId(decoded.userId);
      } else {
        setError("Invalid token.");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch {
      setError("Token decoding failed.");
      setTimeout(() => navigate("/login"), 2000);
    }
  }, []);

  useEffect(() => {
    if (doctorId) {
      fetchAvailability();
    }
  }, [doctorId, selectedDate]);

  const handleAddSlot = async () => {
    if (!startTime || !endTime) {
      setError("Start and end time are required.");
      return;
    }

    if (dayjs(endTime).isBefore(startTime)) {
      setError("End time must be after start time.");
      return;
    }

    const now = dayjs();
    const slotDateTime = dayjs(selectedDate)
      .hour(dayjs(startTime).hour())
      .minute(dayjs(startTime).minute())
      .second(0);

    if (slotDateTime.isBefore(now)) {
      setError("You cannot add a time slot in the past.");
      return;
    }
    try {
      setError("");
      await axios.post(
        "http://localhost:5000/api/availability",
        {
          doctorId,
          date: selectedDate.format("YYYY-MM-DD"),
          slots: [
            {
              startTime: dayjs(startTime).toISOString(),
              endTime: dayjs(endTime).toISOString(),
            },
          ],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStartTime(null);
      setEndTime(null);
      fetchAvailability();
    } catch (err) {
      console.error("Error adding slot:", err);
      setError("Failed to add slot.");
    }
  };

  const handleDeleteSlot = async (slotId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/availability/${doctorId}/slot/${slotId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchAvailability();
    } catch {
      setError("Failed to delete slot.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Typography variant="h5" gutterBottom>
        Manage Availability
      </Typography>

      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Select Date"
          value={selectedDate}
          onChange={(newDate) => setSelectedDate(newDate)}
          disablePast
          sx={{ width: "100%", mb: 2 }}
        />

        <TimePicker
          label="Start Time"
          value={startTime}
          onChange={(newTime) => setStartTime(newTime)}
          sx={{ width: "100%", mb: 2 }}
        />

        <TimePicker
          label="End Time"
          value={endTime}
          onChange={(newTime) => setEndTime(newTime)}
          sx={{ width: "100%", mb: 2 }}
        />
      </LocalizationProvider>

      <Button
        variant="contained"
        color="primary"
        onClick={handleAddSlot}
        sx={{ mb: 3 }}
      >
        Add Slot
      </Button>

      <Typography variant="subtitle1" gutterBottom>
        Available Slots:
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Box display="flex" flexWrap="wrap" gap={1}>
          {slots.length > 0 ? (
            slots.map((slot) => (
              <Chip
                key={slot._id}
                label={`${dayjs(slot.startTime).format("hh:mm A")} - ${dayjs(
                  slot.endTime
                ).format("hh:mm A")}`}
                onDelete={() => handleDeleteSlot(slot._id)}
                color="primary"
              />
            ))
          ) : (
            <Typography variant="body2" color="textSecondary">
              No slots available.
            </Typography>
          )}
        </Box>
      )}
    </div>
  );
};

export default DoctorAvailabilityPage;
