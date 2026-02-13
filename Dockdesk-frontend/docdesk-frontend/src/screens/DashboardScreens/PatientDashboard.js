import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

import { useLogout } from "../../hooks/useLogout";
import { useAuthContext } from "../../hooks/useAuthContext";

import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";

const PatientDashboard = ({ navigation }) => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const [greeting, setGreeting] = useState("");

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

    setGreeting(getCurrentGreeting());
  }, []);

  React.useEffect(() => {
    console.log("User from Dashboard", user);
    //TODO add a waiting modal if user is not found
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topPanel}>
        <View style={styles.mainbar}>
          <Text style={styles.titleMain}>DocDesk</Text>
          <TouchableOpacity
            style={styles.logOutButton}
            onPress={() => {
              logout();
              navigation.popToTop();
              navigation.navigate("WelcomeScreen");
            }}
          >
            <SimpleLineIcons name="logout" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => {
              navigation.navigate("MyprofileScreen");
            }}
          >
            <View style={styles.profileImageContainer}>
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
            {user.fName} <Text style={styles.emoji}>👋</Text>
          </Text>
        </View>
      </View>

      <View style={styles.dashboardContainer}>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.dashboardButton}
            onPress={() => {
              navigation.navigate("DisplayMedicalRecords");
            }}
          >
            <Image
              source={require("../../../assets/icons/record-icon.jpg")}
              style={styles.dashboardImage}
            />
            <Text style={styles.dashboardButtonText}>View Medical Records</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dashboardButton}
            onPress={() => {
              navigation.navigate("TestSelection");
            }}
          >
            <Image
              source={require("../../../assets/icons/test-icon.jpg")}
              style={styles.dashboardImage}
            />
            <Text style={styles.dashboardButtonText}>
              Perform Medical Tests
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity
            style={styles.dashboardButton}
            onPress={() => {
              navigation.navigate("MedicationView");
            }}
          >
            <Image
              source={require("../../../assets/icons/medicine-icon.jpg")}
              style={styles.dashboardImage}
            />
            <Text style={styles.dashboardButtonText}>
              View Medication Plans
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dashboardButton}
            onPress={() => {
              navigation.navigate("DocAccessHomeScreen");
            }}
          >
            <Image
              source={require("../../../assets/icons/doctor-icon.jpg")}
              style={styles.dashboardImage}
            />
            <Text style={styles.dashboardButtonText}>
              Give Access to Doctors
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity
            style={styles.dashboardButton}
            onPress={() => {
              navigation.navigate("ViewExternalTestResults");
            }}
          >
            <Image
              source={require("../../../assets/icons/result-icon.jpg")}
              style={styles.dashboardImage}
            />
            <Text style={styles.dashboardButtonText}>View Test Results</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dashboardButton}
            onPress={() => {
              navigation.navigate("BodyCompositionScreen");
            }}
          >
            <Image
              source={require("../../../assets/icons/result-icon.jpg")}
              style={styles.dashboardImage}
            />
            <Text style={styles.dashboardButtonText}>Your Health</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
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
    top: 45,
    left: 20,
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
  profileButton: {
    top: 45,
    width: 40,
    height: 40,
    right: 20,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#D9D9D9",
  },
  logOutButton: {
    top: 45,
    left: 50,
  },
  profileImageContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: "80%",
    height: "80%",
  },

  greetingContainer: {
    marginTop: 70,
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
    fontSize: 40,
    marginTop: -10,
  },
  dashboardContainer: {
    backgroundColor: "#FFFFFF",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
    paddingHorizontal: 15,
  },
  dashboardButton: {
    width: 160,
    height: 150,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    marginBottom: 20,
    marginHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",

    borderColor: "#00567D",
    borderWidth: 2,
  },
  dashboardImage: {
    width: "50%",
    height: "60%",
    resizeMode: "contain",
    backgroundColor: "#fff",
  },
  dashboardButtonText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    color: "#2c3e50",
  },
  roundedPlusButton: {
    position: "absolute",
    bottom: 50,
    right: 20,
    width: 60,
    height: 60,
    backgroundColor: "#3498db",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  plusButtonText: {
    fontSize: 40,
    color: "#fff",
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
  },
});

export default PatientDashboard;
