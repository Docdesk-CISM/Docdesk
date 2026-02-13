import React, { useState } from "react";
import { View, Text, Button, StyleSheet, TextInput, Alert } from "react-native";
import PainRating from "../PainRating";
import SymptomTypeDropdown from "../SymptomTypeDropdown";
import { baseUrl } from "../../../../constants/constants";
import { useNavigation } from "@react-navigation/native"; // Import navigation hook
import AppetiteRating from "../AppetiteRating";
import SymptomFrequencyDropdown from "../SymptomFrequencyDropdown";
import SymptomDurationDropdown from "../SymptomDurationDropdown";
import api from "../../../../Services/AuthService";
import Calendar from "../Calendar";


const SymptomModal = ({

  selectedOption,
  onClose,
  recordID,
  recordName,
  description,
}) => {
  const [selectedSymptomType, setSelectedSymptomType] = useState(null);
  const [selectedSymptomFrequency, setSelectedSymptomFrequency] = useState(null);
  const [symptomDescription, setSymptomDescription] = useState("");
  const [painRating, setPainRating] = useState(0);
  const [selectedSymptomDuration, setSelectedSymptomDuration] = useState(null);
  const [appetiteRating, setAppetiteRating] = useState(0);
  const [weight, setWeight] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState("");

  const navigation = useNavigation(); // Get navigation object

  console.log(recordID);

  const saveSymptomIncident = () => {
    api
      .post(`${baseUrl}/medicalIncident/symptomIn/create`, {
        type: "symptom",
        recordID: recordID,
        symptomDate: selectedStartDate,
        symptomType: selectedSymptomType,
        symptomFrequency: selectedSymptomFrequency,
        symptomDescription: symptomDescription,
        severity: painRating,
        symptomDuration: selectedSymptomDuration,
        appetite: appetiteRating,
        weight: weight,
      })
      .then((response) => {
        console.log("Success:", response.data);
        Alert.alert("Success", "Symptom Added Successfully");

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
      <Text style={styles.modalText}>Add Symptom Details</Text>

      <View style={styles.contentContainer}>
        <Text style={styles.label}>Symptom Type*</Text>
        <View style={styles.dropdowncontainer}>
          <SymptomTypeDropdown
            options={[
              "Cough",
              "Chest Pain",
              "Fever",
              "Wheezing",
              "Chest tightness",
              "Difficulty breathing (dyspnea)",
              "Sore throat",
              "Sneezing",
              "Frequent respiratory infections"

            ]}
            placeholderText="Select from the list"
            selectedSymptomType={selectedSymptomType}
            setSelectedSymptomType={setSelectedSymptomType}
          />
        </View>
        <View style={styles.inputcontainer}>
          <Text style={styles.label}>Symptom Description </Text>
          <TextInput
            style={styles.input}
            placeholder="Maximum 30 characters"
            onChangeText={(text) => setSymptomDescription(text)}
          />
        </View>
        <Text style={styles.label}>Frequency* </Text>

        <View style={styles.dropdowncontainer}>
          <SymptomFrequencyDropdown
            options={[
              "Rarely (less than once a month)",
              "Occasionally (a few times a month)",
              "Sometimes (a few times a week)",
              "Often (daily)",
              "Multiple times a day",
              "Constantly",
              "Not sure"
            ]}
            placeholderText="Select from the list"
            selectedSymptomFrequency={selectedSymptomFrequency}
            setSelectedSymptomFrequency={setSelectedSymptomFrequency}
          />
        </View>
        <Text style={styles.label}>Severity* : Out of 10</Text>
        <PainRating
          text="Pain level"
          icon="thermometer-half"
          painRating={painRating}
          setPainRating={setPainRating}
        />
        <Text style={[styles.label, { marginTop: "2%" }]}>Duration* </Text>
        <View style={styles.dropdowncontainer}>
          <SymptomDurationDropdown
            options={[
              "Less than a day",
              "1-2 days",
              "3-5 days",
              "Intermittent/ On and off",
              "Chronic (ongoing for several months)",
              "Not sure"

            ]}
            placeholderText="Select from the list"
            selectedSymptomDuration={selectedSymptomDuration}
            setSelectedSymptomDuration={setSelectedSymptomDuration}
          />
        </View>
        <Text style={styles.label}>Appetite* : Out of 10 </Text>
        <AppetiteRating
          appetiteRating={appetiteRating}
          setAppetiteRating={setAppetiteRating}
        />
        <View style={styles.inputcontainer}>
          <Text style={styles.label}>Weight* </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter weight in kg s"
            onChangeText={(text) => setWeight(text)}
          />
        </View>
        <View style={styles.inputcontainer}>
          <Text style={[styles.label, { marginBottom: "2%" }]}>Symptom Date* </Text>
          <Calendar
            selectedStartDate={selectedStartDate}
            setSelectedStartDate={setSelectedStartDate}
          />
        </View>
        <View style={[styles.inputcontainer, { marginTop: "10%" }]}>
          <Text style={styles.label2}>*Required fields </Text>
        </View>

      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <Button title="Close" onPress={onClose} color="#00567D" />
        </View>
        <View style={styles.buttonWrapper}>
          <Button title="OK" onPress={saveSymptomIncident} color="#00567D" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: "55%",
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
    fontSize: 23,
    fontWeight: "900",
    top: 0,
    position: "absolute",
    padding: 10,
    color: "#013d59",
  },
  contentContainer: {
    width: "100%",
    top: 5,
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
    marginVertical: "-16%",
    marginTop: 2,
    width: "105%"
  },

  input: {
    borderColor: "#8e8e8e",
    borderWidth: 1,
    padding: 10,
    width: "88%",
    height: 38,
    marginBottom: 40,
    marginLeft: "3%",
    marginTop: 10,
    borderRadius: 10,
    fontSize: 16,
  },
  dropdowncontainer: {
    marginLeft: "0%",
    marginVertical: "-6%",
    marginTop: "1%",
  },
});

export default SymptomModal;
