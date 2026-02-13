import React, { useState } from "react";
import { View, Text, Button, StyleSheet, TextInput, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native"; // Import navigation hook
import CustomDropdown from "../CustomDropdown";
import TestProviderDropDown from "../TestProviderDropDown";
import { baseUrl } from "../../../../constants/constants";
import api from "../../../../Services/AuthService";
import Calendar from "../Calendar";

const TestModal = ({
  // selectedStartDate,
  selectedOption,
  onClose,
  recordID,
  recordName,
  description,
}) => {
  const [selectedOption1, setSelectedOption1] = useState(null);
  const [selectedOption2, setSelectedOption2] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [result, setResult] = useState("");
  const [resultLink, setResultLink] = useState("");
  const navigation = useNavigation(); // Get navigation object

  const saveIncident = () => {
    api
      .post(`${baseUrl}/medicalIncident/testIn/create`, {
        type: "test",
        recordID: recordID,
        testType: selectedOption1,
        provider: selectedOption2,
        description: description,
        testDate: selectedStartDate,
        result: result,
        resultLink: resultLink,
      })
      .then((response) => {
        console.log("Success:", response.data);
        Alert.alert("Success", "Test Added Successfully");

        // Navigate or perform other actions as needed
        navigation.navigate("DisplayMedicalRecords");
      })
      .catch((error) => {
        Alert.alert("Error saving incident", error.response.data.error);
        console.log("Error saving incident:", error);
      });


  };
  // Call the postMedicalIncident function with the provided arguments

  return (
    <View style={styles.modalContainer}>
      <Text style={styles.modalText}>Add Test Details</Text>
      <View style={styles.contentContainer}>
        <Text style={styles.label}>Test Type*</Text>
        <View style={styles.dropdowncontainer}>
          <CustomDropdown
            selectedOption1={selectedOption1}
            setSelectedOption1={setSelectedOption1}
            options={[
              "Rapid Antigen Test (RAT)",
              "Polymerase Chain Reaction(PCR) Test",
              "Spirometry",
              "Arterial Blood Gas (ABG) Test",
              "Bronchoscopy",
              "Chest X-ray",
              "Computed Tomography (CT) Scan",
              "Peak Expiratory Flow (PEF) Test",
              "Ventilation-Perfusion (V/Q) Scan"

            ]}
            placeholderText="Select from the list"
          />
        </View>
        <Text style={styles.label}>Test Provider*</Text>
        <View style={styles.dropdowncontainer}>
          <TestProviderDropDown
            selectedOption2={selectedOption2}
            setSelectedOption2={setSelectedOption2}
            options={[
              "HOSPITAL",
              "LAB",
              "CLINIC",
              "Community Health Center",
              "Pharmacy Clinic",
              "Telehealth Service"]}
            placeholderText="Select from the list"
          />
        </View>

        <View style={styles.inputcontainer}>
          <Text style={styles.label}>Result</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Result Here"
            onChangeText={(text) => setResult(text)}
          />
        </View>
        <View style={styles.inputcontainer}>
          <Text style={styles.label}>Result Link</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Result Link Here"
            value={resultLink}
            onChangeText={setResultLink}
          />
        </View>
        <View style={styles.inputcontainer}>
          <Text style={styles.label}>Test Date* </Text>
          <Calendar
            selectedStartDate={selectedStartDate}
            setSelectedStartDate={setSelectedStartDate}
          />
        </View>
        <View style={[styles.inputcontainer]}>
          <Text style={styles.label2}>*Required fields </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <Button title="Close" onPress={onClose} color="#00567D" />
        </View>
        <View style={styles.buttonWrapper}>
          <Button title="OK" onPress={saveIncident} color="#00567D" />
        </View>
      </View>


    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
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
  label2: {
    marginTop: 25,
    fontSize: 14,
    color: "gray",
    marginLeft: "64%",
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
    top: 780,
  },
  buttonWrapper: {
    width: "40%", // Adjust as needed
  },
  label: {
    paddingTop: 40,
    fontSize: 16,
    fontWeight: "500",
    marginLeft: "4%",
  },
  dropdowncontainer: {
    marginVertical: "-5%",
    // marginLeft: "-10%",
  },

  input: {
    borderColor: "#8e8e8e",
    borderWidth: 1,
    padding: 10,
    height: 38,
    marginVertical: "-5%",
    borderRadius: 10,
    fontSize: 16,
    marginLeft: "3%",
    marginTop: 10,
    width: "90%",
  },
});

export default TestModal;
