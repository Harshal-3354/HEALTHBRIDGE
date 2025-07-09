import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  MenuItem,
  Paper,
  Grid,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
    profilePicture: "",
    phone: "",
    address: "",
    specialization: "",
    qualifications: "",
    experience: "",
    bio: "",
    clinicAddress: "",
    age: "",
    gender: "", // ✅ no default value
    bloodGroup: "",
    medicalHistory: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Paper elevation={5} className="p-6 max-w-4xl w-full">
        <Typography variant="h4" align="center" gutterBottom>
          Create an Account
        </Typography>

        {error && (
          <Typography color="error" align="center" className="mb-4">
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Common Fields */}
            <Grid item xs={12} sm={6}>
              <TextField
                name="name"
                label="Full Name"
                fullWidth
                required
                value={form.name}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="email"
                label="Email"
                fullWidth
                required
                type="email"
                value={form.email}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="password"
                label="Password"
                type="password"
                fullWidth
                required
                value={form.password}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="role"
                select
                label="Register As"
                fullWidth
                value={form.role}
                onChange={handleChange}
              >
                <MenuItem value="patient">Patient</MenuItem>
                <MenuItem value="doctor">Doctor</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="phone"
                label="Phone Number"
                fullWidth
                value={form.phone}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                name="profilePicture"
                label="Profile Picture URL"
                fullWidth
                value={form.profilePicture}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="address"
                label="Address"
                fullWidth
                value={form.address}
                onChange={handleChange}
              />
            </Grid>

            {/* Gender Field (Visible for All) */}
            <Grid item xs={12} sm={6}>
              <TextField
                name="gender"
                select
                label="Gender"
                fullWidth
                required
                value={form.gender}
                onChange={handleChange}
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
            </Grid>

            {/* Doctor Fields */}
            {form.role === "doctor" && (
              <>
                <Grid item xs={12}>
                  <Divider>Doctor Information</Divider>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    name="specialization"
                    label="Specialization"
                    fullWidth
                    value={form.specialization}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    name="qualifications"
                    label="Qualifications"
                    fullWidth
                    value={form.qualifications}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    name="experience"
                    label="Experience (Years)"
                    type="number"
                    fullWidth
                    value={form.experience}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    name="bio"
                    label="Short Bio"
                    fullWidth
                    multiline
                    rows={2}
                    value={form.bio}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    name="clinicAddress"
                    label="Clinic Address"
                    fullWidth
                    value={form.clinicAddress}
                    onChange={handleChange}
                  />
                </Grid>
              </>
            )}

            {/* Patient Fields */}
            {form.role === "patient" && (
              <>
                <Grid item xs={12}>
                  <Divider>Patient Information</Divider>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    name="age"
                    label="Age"
                    type="number"
                    fullWidth
                    value={form.age}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    name="bloodGroup"
                    label="Blood Group"
                    fullWidth
                    value={form.bloodGroup}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    name="medicalHistory"
                    label="Medical History"
                    fullWidth
                    multiline
                    rows={2}
                    value={form.medicalHistory}
                    onChange={handleChange}
                  />
                </Grid>
              </>
            )}
          </Grid>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className="mt-6"
            sx={{ marginTop: "24px" }}
          >
            Register
          </Button>

          <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
            Already have an account?{" "}
            <span
              style={{ color: "#1976d2", cursor: "pointer" }}
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </Typography>
        </form>
      </Paper>
    </div>
  );
};

export default Register;
