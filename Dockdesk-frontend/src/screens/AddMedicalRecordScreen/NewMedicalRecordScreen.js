import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  Alert,
  SafeAreaView,
} from "react-native";
import api from "../../Services/AuthService";
import Header from "../../components/Header";
import { baseUrl } from "../../constants/constants";
import { useAuthContext } from "../../hooks/useAuthContext";
import Calendar from "../AddMedicalIncidentScreen/components/Calendar";

const NewMedicalRecordScreen = ({ route, navigation }) => {
  const { user } = useAuthContext();
  const [userID, setUserID] = useState(user._id);

  useEffect(() => {
    user.roles == "patient" ? setUserID(user._id) : setUserID(route.params.PID);
  }, []);

  function handleAddNew() {
    const postMedicalIncident = (recordName, recordDescription, date) => {
      api
        .post(`${baseUrl}/medicalRecord/create`, {
          recordName: recordName,
          recordDescription: recordDescription,
          date: selectedStartDate,
          patientID: userID,
        })
        .then((response) => {
          console.log("Success:", response.data);
          Alert.alert("Success", "Medical Record added successfully.");
          console.log("User ID:", userID);
          // Navigate or perform other actions as needed
          navigation.navigate("DisplayMedicalRecords", {
            recordName,
            recordDescription,
            date: selectedStartDate,
            patientID: userID,
          });
        })
        .catch((error) => {
          console.log("Error posting medical incident:", error);
        });
    };
    // Call the postMedicalIncident function with the provided arguments
    console.log("User ID:", userID);
    postMedicalIncident(recordName, recordDescription, selectedStartDate);
  }

  const [recordName, setRecordName] = useState("");
  const [recordDescription, setRecordDescription] = useState("");

  const [selectedStartDate, setSelectedStartDate] = useState("");

  return (
    <SafeAreaView>
      <Header name="Medical Record" />

      <View style={styles.background}>
        <View style={styles.container}>
          <View style={styles.inputcontainer}>
            <Text style={styles.text1}>Record Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Record Name"
              onChangeText={(text) => setRecordName(text)}
            />
          </View>
          <View style={styles.inputcontainer}>
            <Text style={styles.text1}>Description</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Description"
              onChangeText={(text) => setRecordDescription(text)}
            />
          </View>
          <View style={styles.inputcontainer}>
            <Text style={styles.text1}>Date: </Text>
            <View style={styles.calendar}>
              <Calendar
                selectedStartDate={selectedStartDate}
                setSelectedStartDate={setSelectedStartDate}
              />
            </View>
          </View>
        </View>
        <View style={styles.btn}>
          <Pressable onPress={handleAddNew}>
            <Text style={styles.btntext}>Save</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default NewMedicalRecordScreen;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    width: "100%",
    height: "87%",
    backgroundColor: "#FFFF",
  },
  btn: {
    backgroundColor: "#00567D",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    width: "95%",
    padding: 2,
    marginTop: "-2%",
    alignSelf: "center",

  },
  btntext: {
    color: "#FFF",
    padding: 8,
    fontSize: 16,
  },

  // background: {
  //   backgroundColor: "#DEFFFB",
  //   width: "100%",
  //   height: "100%",
  //   padding: 15,
  // },
  text1: {
    marginLeft: 28,
    fontWeight: "500",
    fontSize: 16,
    color: "#1e1e1e",
  },
  inputcontainer: {
    // flex: 0.4,
    paddingTop: "6%",
    justifyContent: "center",

  },
  text1: {
    marginLeft: 28,
    fontWeight: "500",
    fontSize: 16,
    color: "#1e1e1e",
    // fontFamily: 'poppins regular,',
  },
  input: {
    borderColor: "#8e8e8e",
    borderWidth: 1,
    padding: 10,
    width: "88%",
    height: 38,
    margin: 20,
    marginLeft: 25,
    // marginTop: 10,
    borderRadius: 10,
    fontSize: 16,
  },
  calendar: {
    marginLeft: "3%",
    marginTop: "-7%"
  }


});
