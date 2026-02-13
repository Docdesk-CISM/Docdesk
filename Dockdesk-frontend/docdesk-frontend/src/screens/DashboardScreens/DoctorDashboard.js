import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useLogout } from "../../hooks/useLogout";
import { useAuthContext } from "../../hooks/useAuthContext";
import { AntDesign } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";

const DoctorDashboard = ({ navigation }) => {
  const { user } = useAuthContext();
  console.log("User in DoctorDashboard:", user.fName);
  const { logout } = useLogout();
  const [greeting, setGreeting] = useState("");
  const [formattedDate, setFormattedDate] = useState({
    day: "",
    month: "",
    year: "",
  });

  useEffect(() => {
    const getCurrentGreeting = () => {
      const currentHour = new Date().getHours();
      if (currentHour < 12) {
        return "Good Morning";
      } else if (currentHour < 15) {
        return "Good Afternoon";
      } else {
        return "Good Evening";
      }
    };
    const getFormattedDate = () => {
      const date = new Date();
      const day = date.getDate();
      const month = date.toLocaleString("default", { month: "long" });
      const year = date.getFullYear();
      return { day, month, year };
    };
    setGreeting(getCurrentGreeting());
    setFormattedDate(getFormattedDate());
  }, []);
  const { day, month, year } = formattedDate;
  console.log("Day:", day, "Month:", month, "Year:", year);
  return (
    <View style={styles.container}>
      {/* // Top Panel */}
      <View style={styles.topPanel}>
        <View style={styles.mainbar}>
          <Text style={styles.titleMain}>DocDesk</Text>
          <TouchableOpacity
            style={styles.logOutButton}
            onPress={() => {
              logout();
              navigation.navigate("WelcomeScreen");
            }}
          >
            <SimpleLineIcons name="logout" size={30} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("DoctorProfileScreen");
            }}
          >
            <View style={styles.iconContainer}>
              <Image
                source={require("../../../assets/Person.png")}
                style={styles.profileImage}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>{greeting},</Text>
          <Text style={styles.greetingTextName}>
            Dr.{user.fName} <Text style={styles.emoji}>👋</Text>
          </Text>
        </View>
        <View style={styles.dataContainer}>
          <View style={styles.allPatientCon}>
            <AntDesign name="calendar" size={30} color="black" />
            <Text style={styles.day}>{day}</Text>
            <Text style={styles.month}>{month}</Text>
            <Text style={styles.year}>{year}</Text>
          </View>
        </View>
      </View>

      {/* // Dashboard Buttons */}
      <View style={styles.dashboardContainer}>
        <View style={styles.dashboardButtonContainer}>
          {/* /* // View Patient Summery Button * */}
          <TouchableOpacity
            style={styles.dashboardButtonMyPatient}
            onPress={() => {
              navigation.navigate("PatientsScreen");
            }}
          >
            <Fontisto name="stethoscope" size={60} color="black" />
            <Text style={styles.dashboardButtonTextMypatient}>My Patients</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FEFF",
  },
  topPanel: {
    flex: 1,

    backgroundColor: "#00567D",
    paddingHorizontal: 15,
  },
  mainbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleMain: {
    position: "absolute",
    top: 50,
    left: 20,
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
  greetingContainer: {
    marginTop: 20,
    marginLeft: 20,
  },
  greetingText: {
    fontSize: 35,
    top: 30,
    fontWeight: "bold",
    color: "white",
  },

  greetingTextName: {
    fontSize: 45,
    top: 30,
    fontWeight: "bold",
    color: "white",
  },
  emoji: {
    fontSize: 34,
    marginTop: -10,
  },
  dataContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    top: 100,
  },
  allPatientCon: {
    width: 110,
    height: 160,
    borderRadius: 40,
    color: "white",
    marginLeft: 0,
    borderColor: "#00567D",
    borderWidth: 3,
    backgroundColor: "#F7FEFF",
    justifyContent: "center",
    alignItems: "center",
  },
  day: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#E35977",
  },
  month: {
    fontSize: 18,
  },
  year: {
    fontSize: 18,
  },

  profileImage: {
    width: "80%",
    height: "80%",
  },

  dashboardContainer: {
    flex: 1,

    marginTop: 80,
    paddingHorizontal: 15,
  },

  dashboardButtonContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 70,
  },
  dashboardButtonMyPatient: {
    width: 170,
    height: 190,
    backgroundColor: "#F7FEFF",
    borderRadius: 15,
    marginBottom: 60,
    borderColor: "#00567D",
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },

  dashboardImage: {
    width: "80%",
    height: "70%",

    backgroundColor: "#fff",
  },
  dashboardButtonTextMypatient: {
    marginTop: 30,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#2c3e50",
  },
  dashboardButtonTextLogOut: {
    fontSize: 18,
    left: 10,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
    marginHorizontal: 10,
  },

  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    right: 20,
    marginTop: 45,
    width: 45,
    height: 45,
    borderRadius: 50,

    backgroundColor: "#eee",
  },
  logOutButton: {
    top: 25,
    left: 250,
  },
});

export default DoctorDashboard;
