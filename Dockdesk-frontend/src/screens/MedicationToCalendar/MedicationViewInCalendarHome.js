import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Header from "../MedicalTestHomeScreen/components/Header";
import { Calendar } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";
import { baseUrl } from "../../constants/constants";
import { useEffect, useState } from "react";
import api from "../../Services/AuthService";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useIsFocused } from "@react-navigation/native";

//navigate to medication adding form
const MedicationView = ({ navigation, route }) => {
  const { user } = useAuthContext();
  // const { refresh } = route.params ? route.params : { refresh: false };
  const [currentUserID, setCurrentUserID] = useState(undefined);
  const [markedDates, setMarkedDates] = useState({});
  const [loading, setLoading] = useState(true);
  const [docMode, setDocMode] = useState(false);

  // console.log("Doc", docMode)

  const updateUser = () => {
    if (route.params?.PID === undefined) {
      console.log("PID is undefined");
      setCurrentUserID(user._id);
    } else {
      setCurrentUserID(route.params.PID);
      setDocMode(true);
      console.log("PID is defined", route.params.PID);
    }
  };

  useEffect(() => {
    updateUser();
  }, [useIsFocused]);

  useEffect(() => {
    if (currentUserID !== undefined) {
      getmedication();
    }
  }, [currentUserID]);

  //API integration for get results of dates
  const getmedication = () => {
    setLoading(true);
    console.log("Current User ID VIEW", currentUserID);
    api
      .get(`${baseUrl}/medication/getOne/${currentUserID}`)
      .then((response) => {
        markDates(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Axios Error : ", error);
        setLoading(false);
      });
  };

  //mark dates in calendar
  const markDates = (data) => {
    const markedDatesObj = {};
    const currentDate = new Date(); // Get current date
    const todayDateString = currentDate.toISOString().split("T")[0];
    data.forEach((item) => {
      if (Array.isArray(item.dayArray)) {
        item.dayArray.forEach((date) => {
          if (date < todayDateString) {
            // Check if the date is before today
            markedDatesObj[date] = { selected: true, selectedColor: "#dedee0" }; // Mark it in red
          } else {
            markedDatesObj[date] = { selected: true, selectedColor: "#00567D" }; // Mark it in blue
          }
        });
      }
    });
    setMarkedDates(markedDatesObj);
  };

  const addMedication = () => {
    navigation.navigate("AddMedication", {
      refreshMedicationView: true,
      PID: docMode ? route.params.PID : null,
    });
  };

  //navigate to medication view
  const viewMedication = (day) => {
    console.log("Doc", docMode);
    navigation.navigate("ViewMedication", {
      selectedday: day,
      PID: docMode ? route.params.PID : null,
    });
  };

  return (
    <View style={styles.container}>
      <Header name="Medication" />
      <Calendar
        style={{
          borderRadius: 10,
          marginRight: 10,
          marginLeft: 10,
          marginTop: 100,
          elevation: 4,
        }}
        onDayPress={(day) => {
          viewMedication(day);
          console.log(day);
        }}
        markedDates={markedDates}
      />
      <TouchableOpacity
        style={styles.pastEntriesButton}
        onPress={() => {
          navigation.navigate("ViewPastEntries", {
            PID: route.params?.PID === undefined ? undefined : route.params.PID,
          });
        }}
      >
        <Text style={styles.pastEntriesText}>Past Entries</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.roundedPlusButton}
        onPress={() => {
          addMedication();
        }}
      >
        <Ionicons name="add-circle" size={60} color="#00567D" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#D9F8FF",
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  roundedPlusButton: {
    position: "absolute",
    bottom: 40,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  pastEntriesButton: {
    position: "absolute",
    bottom: 45,
    right: 90,
    backgroundColor: "#00567D",
    padding: 15,
    borderRadius: 10,
  },
  pastEntriesText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
});

export default MedicationView;
