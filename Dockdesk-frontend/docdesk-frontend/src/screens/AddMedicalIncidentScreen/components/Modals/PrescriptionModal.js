import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native"; // Import navigation hook
import { baseUrl } from "../../../../constants/constants";
import api from "../../../../Services/AuthService";
import Calendar from "../Calendar";

const PrescriptionModal = ({ recordID, onClose }) => {
  const navigation = useNavigation(); // Get navigation object
  const [presLink, setPresLink] = useState("");
  const [doctorID, setDoctorID] = useState("");
  const [doctorName, setDoctorName] = useState("");
  // const [prescriptionDate, setPrescriptionDate] = useState("");
  const [prescriptionNote, setPrescriptionNote] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState("");

  const savePrescriptionIncident = () => {
    api
      .post(`${baseUrl}/medicalIncident/PrescriptionIn/create`, {
        type: "symptom",
        recordID: recordID,
        doctorID: doctorID,
        doctorName: doctorName,
        PrescriptionDate: selectedStartDate,
        description: prescriptionNote,
        link: presLink,
      })
      .then((response) => {
        console.log("Success:", response.data);
        Alert.alert("Success", "Prescription Added Successfully");

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
      <Text style={styles.modalText}>Add Prescription Details</Text>
      <View style={styles.contentContainer}>
        {/* <View style={styles.inputcontainer}>
          <Text style={styles.label}>Doctor ID:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter the Doctor ID"
            onChangeText={(text) => setDoctorID(text)}
          />
        </View> */}

        <View style={styles.inputcontainer}>
          <Text style={styles.label}>Doctor Name*</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Doctor's Name"
            onChangeText={(text) => setDoctorName(text)}
          />
        </View>

        <View style={styles.inputcontainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            placeholder="max 30 characters"
            onChangeText={(text) => setPrescriptionNote(text)}
          />
        </View>
        <View style={styles.container}>
          <Text style={styles.label}>Upload the link</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your prescription link"
            value={presLink}
            onChangeText={setPresLink}
          />
        </View>

        <View style={styles.inputcontainer}>
          <Text style={[styles.label, { marginTop: "-7%", marginBottom:"2%" }]}>Prescription Date* </Text>
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
            onPress={savePrescriptionIncident}
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
    marginTop: "50%",
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
  modalText: {
    fontSize: 22,
    fontWeight: "900",
    top: 0,
    position: "absolute",
    padding: 10,
    color: "#013d59",
  },
  contentContainer: {
    width: "100%",
    top: 9,
    position: "absolute",
    paddingTop: "6%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    width: "92%",
    left: 30,
    top: 780,
  },
  buttonWrapper: {
    width: "40%", // Adjust as needed
  },

  label: {
    marginTop: 25,
    fontSize: 16,
    fontWeight: "500",
    marginLeft: "3%",
  },
  inputcontainer: {
    marginVertical: "-14%",
    marginTop: 2,

  },
  label2: {
    marginTop: 25,
    fontSize: 14,
    color: "gray",
    marginLeft: "64%",
  },
  input: {
    borderColor: "#8e8e8e",
    borderWidth: 1,
    padding: 10,
    width: "90%",

    height: 38,
    marginBottom: 40,
    marginLeft: "3%",
    marginTop: 10,
    borderRadius: 10,
    fontSize: 16,
  },
});

export default PrescriptionModal;
