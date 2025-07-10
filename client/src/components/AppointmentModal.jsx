import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  TextField,
} from "@mui/material";
import axios from "axios";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const AppointmentModal = ({ open, onClose, doctorId, patientId }) => {
  const [date, setDate] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Reset when modal closes
  useEffect(() => {
    if (!open) {
      setDate(null);
      setSlots([]);
      setSelectedSlotId("");
    }
  }, [open]);

  // Fetch available slots
  useEffect(() => {
    const fetchSlots = async () => {
      if (!date || !doctorId) return;
      const formatted = dayjs(date).format("YYYY-MM-DD");

      try {
        const res = await axios.get(
          `http://localhost:5000/api/availability/${doctorId}?date=${formatted}`
        );

        let available = res.data.filter((s) => !s.isBooked);

        // 🕒 If today, filter out past-time slots
        const today = dayjs().format("YYYY-MM-DD");
        if (formatted === today) {
          const now = dayjs();
          available = available.filter((slot) =>
            dayjs(slot.startTime).isAfter(now)
          );
        }

        setSlots(available);
      } catch (err) {
        console.error("Failed to fetch slots:", err);
        setSlots([]);
      }
    };
    fetchSlots();
  }, [date, doctorId]);

  const handleBook = async () => {
    if (!date || !selectedSlotId) return;
    setLoading(true);
    try {
      const slot = slots.find((s) => s._id === selectedSlotId);
      if (!slot) throw new Error("Slot not found");

      await axios.post("http://localhost:5000/api/appointments", {
        doctorId,
        patientId,
        date: dayjs(date).format("YYYY-MM-DD"),
        startTime: slot.startTime,
        endTime: slot.endTime,
      });

      onClose();
      navigate("/patient/appointments");
    } catch (err) {
      console.error("Booking error:", err);
      alert("Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Book Appointment</DialogTitle>
      <DialogContent>
        <DatePicker
          label="Select Date"
          value={date}
          onChange={(val) => {
            setDate(val);
            setSelectedSlotId("");
          }}
          sx={{ width: "100%", mt: 1 }}
          disablePast
        />

        <TextField
          select
          fullWidth
          margin="normal"
          label="Available Time Slots"
          value={selectedSlotId || ""}
          onChange={(e) => setSelectedSlotId(e.target.value)}
        >
          {slots.length > 0 ? (
            slots.map((slot) => (
              <MenuItem key={slot._id} value={slot._id}>
                {`${dayjs(slot.startTime).format("hh:mm A")} - ${dayjs(
                  slot.endTime
                ).format("hh:mm A")}`}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No slots available</MenuItem>
          )}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleBook}
          disabled={loading || !selectedSlotId}
          variant="contained"
        >
          {loading ? "Booking..." : "Book Now"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AppointmentModal;
