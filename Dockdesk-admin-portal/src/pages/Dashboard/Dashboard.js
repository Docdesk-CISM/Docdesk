import React from "react";
import { useEffect, useState } from "react";
import "./Dashboard.css";
import { useAuthContext } from "../../hooks/useAuthContext";
import { baseUrl } from "../../constants/constants";
import api from "../../services/AuthService";
import DoctorIcon from "../../assets/doctorIcon.png";
import UserIcon from "../../assets/userIcon.png";
import Paper from '@mui/material/Paper';
import PieChart from "../../components/DashboardCard/PieChart";
import Typography from "@mui/material/Typography";
import { MdOutlineHealthAndSafety } from "react-icons/md";

export default function Dashboard() {
  const { user } = useAuthContext();
  const [doc, setDoc] = useState();
  const [patient, setPatient] = useState();

  console.log(baseUrl);

  const getUsers = async (userType) => {
    api
      .get(`${baseUrl}/${userType}`, {})
      .then((res) => {
        if (res) {
          const userData = res.data;
          console.log(userData);
          if (userType == "doctors") {
            setDoc(userData);
          } else if (userType == "patients") {
            setPatient(userData);
          }
        }
      })
      .catch((error) => {
        console.log(error);
        return error.response;
      });
  };

  useEffect(() => {
    console.log("User:", user);
    getUsers("doctors");
    getUsers("patients");
  }, []);

  useEffect(() => {
    doc && console.log(doc.length);
    patient && console.log(patient.length);
  }, [doc, patient]);

  return (
    <div>
      <Typography
        variant="h6"
        sx={{ marginTop: "10px", marginBottom:"40px"}}
        className="poppins-regular">
        Hi! Welcome to DocDesk Dashboard
      </Typography>
      <div className="CardContainer">
        <Paper elevation={1} sx={{ width: "300px", height: "200px" }}>
          <Typography
            variant="h6"
            sx={{ textAlign: "center", marginTop: "10px" }}
            component="div"
          >
            PATIENTS
          </Typography>
          <Typography
            variant="h1"
            sx={{ textAlign: "center", marginTop: "10px" }}
            component="div"
          >

            {patient != null ? patient.length : "0"}
          </Typography>
        </Paper>
        <Paper elevation={1} sx={{ width: "300px", height: "200px" }}>

          <Typography
            variant="h6"
            sx={{ textAlign: "center", marginTop: "10px" }}
          >
            DOCTORS
          </Typography>
          <Typography
            variant="h1"
            sx={{ textAlign: "center", marginTop: "10px" }}
          >

            {doc != null ? doc.length : "0"}
          </Typography>
        </Paper>
      </div>
      <div className="">
        <Paper elevation={1} sx={{ width: "500px", height: "300px", paddingTop: "20px", marginTop: "50px" }}>
          <Typography
            variant="h6"
            sx={{ textAlign: "center", marginTop: "10px", marginBottom: "10px" }}
            component="div"
          >
            USER STATISTICS
          </Typography>
          <PieChart data={{ d: doc?.length ? doc.length : "0", p: patient?.length ? patient.length : "0" }} />
        </Paper>

      </div>
    </div>
  );
}
