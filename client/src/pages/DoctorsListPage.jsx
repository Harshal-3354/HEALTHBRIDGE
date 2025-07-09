import React, { useEffect, useState } from "react";
import axios from "axios";
import DoctorCard from "../components/DoctorCard";
import { Grid, Typography, CircularProgress } from "@mui/material";

const DoctorsListPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem("token"); // 🔑 Get JWT
        const res = await axios.get("http://localhost:5000/api/doctors", {
          headers: {
            Authorization: `Bearer ${token}`, // 🔐 Pass token
          },
        });
        setDoctors(res.data);
      } catch (err) {
        console.error("Error fetching doctors", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center mt-20">
        <CircularProgress />
      </div>
    );

  return (
    <div className="p-6">
      <Typography variant="h5" className="mb-6 text-center">
        Browse Doctors
      </Typography>
      <Grid container spacing={3}>
        {doctors.map((doctor) => (
          <Grid item xs={12} sm={6} md={4} key={doctor._id}>
            <DoctorCard doctor={doctor} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default DoctorsListPage;
