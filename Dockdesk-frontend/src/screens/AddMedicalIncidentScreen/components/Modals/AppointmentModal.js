import React, { useState } from "react";
import { View, Text, Button, StyleSheet, TextInput, Alert } from "react-native";
import { baseUrl } from "../../../../constants/constants";
import { useNavigation } from "@react-navigation/native";
import api from "../../../../Services/AuthService";
import Calendar from "../Calendar";

const AppointmentModal = ({ recordID, onClose }) => {
  const [docID, setDocID] = useState("");
  const [healthProName, setHealthProName] = useState("");
  const [appType, setAppType] = useState("");
  const [appointmentPurpose, setAppointmentPurpose] = useState("");
  const [selectedStartDate1, setSelectedStartDate1] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState("");

  const navigation = useNavigation(); // Get navigation object

  const saveAppointmentIncident = () => {
    api
      .post(`${baseUrl}/medicalIncident/AppointmentIn/create`, {
        type: "appointment",
        recordID: recordID,
        doctorID: docID ? docID : null,
        doctorName: healthProName,
        appointmentDateTime: selectedStartDate,
        appointmentType: appType,
        description: appointmentPurpose,
        addedDate: selectedStartDate1
      })
      .then((response) => {
        console.log("Success:", response.data);
        Alert.alert("Success", "Appointment Added Successfully");

        // Navigate or perform other actions as needed
        navigation.navigate("DisplayMedicalRecords");
      })
      .catch((error) => {
        Alert.alert("Error saving incident", error.response.data.error);
        console.log("Error saving incident:", error);
      });
  };

  return (
    <View style={styles.modalContainer}>
      <Text style={styles.modalText}>Add Appointment Details</Text>
      {/* <ScrollView style={styles.scrollview}> */}
      <View style={styles.contentContainer}>
        <View style={styles.inputcontainer}>
          <Text style={styles.label}>Description:</Text>
          <TextInput
            style={styles.input}
            placeholder="Maximum 30 characters"
            onChangeText={(text) => setAppointmentPurpose(text)}
          />
        </View>

        <View style={styles.inputcontainer}>
          <Text style={styles.label}>Doctor's Name* :</Text>
          <TextInput
            style={styles.input}
            placeholder="Type Doctor's name"
            onChangeText={(text) => setHealthProName(text)}
          />
        </View>

        {/* <View style={styles.inputcontainer}>
          <Text style={styles.label}>Doctor ID:</Text>
          <TextInput
            style={styles.input}
            placeholder="Type the Doctor's ID"
            onChangeText={(text) => setDocID(text)}
          />
        </View> */}

        

        <View style={styles.inputcontainer}>
          <Text style={styles.label}>Appointment Type* : </Text>
          <TextInput
            style={styles.input}
            placeholder="Type of the Appointment"
            onChangeText={(text) => setAppType(text)}
          />
        </View>
        <View style={styles.inputcontainer}>
          <Text style={styles.label}>Date* : </Text>
          <Calendar
            selectedStartDate={selectedStartDate1}
            setSelectedStartDate={setSelectedStartDate1}

          />
        </View>

        <View style={[styles.inputcontainer, { marginTop: "12%" }]}>
          <Text style={styles.label}>Scheduled date* : </Text>
          <Calendar
            selectedStartDate={selectedStartDate}
            setSelectedStartDate={setSelectedStartDate}

          />
        </View>
        <View style={[styles.inputcontainer, { marginTop: "12%" }]}>
          <Text style={styles.label2}>*Required fields </Text>

        </View>
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <Button title="Close" onPress={onClose} color="#00567D" />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            title="OK"
            onPress={saveAppointmentIncident}
            color="#00567D"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: "54%",
    position: "absolute",
    height: "98%",
    left: 0,
    right: 0,
    bottom: 10,
    marginLeft: "3%",
    alignContent: "center",
    justifyContent: "center",
    elevation: 4,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 15,
    width: "94%",
  },

  topic: {
    paddingTop: 30,
    fontSize: 18,
    paddingLeft: 15,
    fontWeight: "800",
  },
  modalText: {
    fontSize: 23,
    fontWeight: "900",
    top: 0,
    position: "absolute",
    padding: 10,
    color: "#013d59",
  },
  contentContainer: {
    width: "100%",
    top: 6,
    position: "absolute",
    paddingTop: "6%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    width: "92%",
    left: 30,
    // right: 15,
    top: 780,
  },
  buttonWrapper: {
    width: "40%", // Adjust as needed
  },
  label: {
    marginTop: 25,
    fontSize: 16,
    fontWeight: "500",
    marginLeft: "4%",
  },
  label2: {
    marginTop: 25,
    fontSize: 14,
    color: "gray",
    marginLeft: "64%",
  },
  inputcontainer: {
    marginVertical: "-16%",
    marginTop: 2,
  },

  input: {
    borderColor: "#8e8e8e",
    borderWidth: 1,
    padding: 10,
    width: "88%",
    height: 38,
    marginBottom: 40,
    marginLeft: "4%",
    marginTop: 10,
    borderRadius: 10,
    fontSize: 16,
  },
});

export default AppointmentModal;
