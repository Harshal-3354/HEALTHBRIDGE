import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  CardActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();

  return (
    <Card
      className="transition-transform transform hover:-translate-y-1 hover:shadow-xl rounded-2xl border border-gray-200"
      sx={{
        padding: 2,
        backgroundColor: "#fff",
        borderRadius: 3,
      }}
    >
      <CardContent className="flex flex-col items-center text-center space-y-2">
        <Avatar
          src={
            doctor.profilePicture ||
            "https://cdn-icons-png.flaticon.com/512/3870/3870822.png"
          }
          alt={doctor.name}
          sx={{ width: 90, height: 90, marginBottom: 1 }}
        />
        <Typography variant="h6" className="font-semibold">
          {doctor.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          className="italic text-sm"
        >
          {doctor.specialization}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          className="text-gray-500"
        >
          {doctor.experience} years experience
        </Typography>
      </CardContent>

      <CardActions className="flex justify-center pb-4">
        <Button
          variant="contained"
          color="primary"
          size="small"
          className="rounded-full px-5 py-1 text-white capitalize tracking-wide"
          onClick={() => navigate(`/patient/doctors/${doctor._id}`)}
        >
          View Profile
        </Button>
      </CardActions>
    </Card>
  );
};

export default DoctorCard;
