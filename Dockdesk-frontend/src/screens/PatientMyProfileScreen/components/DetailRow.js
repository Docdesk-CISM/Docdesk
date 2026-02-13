import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  Slider,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import api from "../../../Services/AuthService";
import { baseUrl } from "../../../constants/constants";
import Dropdown from "./Dropdown";
import DatePicker from "react-native-modern-datepicker";

import { useAuthContext } from "../../../hooks/useAuthContext";

const DetailRow = ({
  name,
  textLineOne,
  textLineTwo,
  category,
  refreshUserData,
  currentData,
}) => {
  const { user } = useAuthContext();
  const id = user ? user._id : null;

  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [mobileNumber, setmobileNumber] = useState("");
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [address, setAddress] = useState("");

  const [selectedGender, setSelectedGender] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  const [bloodGroup, setBloodGroup] = useState("");

  const [nic, setNic] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  // useEffect to update state when currentData changes
  useEffect(() => {
    if (currentData) {
      setEmail(currentData.email || "");
      setmobileNumber(currentData.mobileNumber || "");
      setFirst(currentData.firstName || "");
      setSecond(currentData.lastName || "");
      setAddress(currentData.address || "");
      setSelectedGender(currentData.gender || "");
      setWeight(currentData.weight || "");
      setHeight(currentData.height || "");
      setBloodGroup(currentData.blood || "");
      setNic(currentData.nic || "");
      setSelectedDate(currentData.birthday || null);
    }
  }, [currentData]);
  const today = new Date().toLocaleDateString("en-CA");
  console.log("Today:", today);

  const checkEmailExists = async (email) => {
    try {
      const response = await api.get(`${baseUrl}/checkEmail/:${email}`);
      return response.data.exists;
    } catch (error) {
      console.log("Error checking email:", error);
      throw error;
    }
  };

  const handleBloodGroupSelect = (selectedGroup) => {
    setBloodGroup(selectedGroup);
  };

  const handleDateChange = (date) => {
    // Convert date format from YYYY/MM/DD to YYYY-MM-DD
    const formattedDate = date.replace(/\//g, "-");
    setSelectedDate(formattedDate);
  };

  const handleUpdateProfile = async () => {
    // Check if the email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const weightRegex = /^[0-9]{1,3}$/;
    const heightRegex = /^[0-9]{1,3}$/;

    try {
      // Check if the email already exists in the database
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        Alert.alert(
          "Error",
          "This email is already in use. Please choose another one."
        );
        return;
      }
    } catch (error) {
      console.log("Failed to update patient information:", error);

      Alert.alert(
        "Error",
        "Failed to update patient information. Please try again later."
      );
    }

    let updatedData = {};
    switch (category) {
      case "fullName":
        if (first.trim() === "" || second.trim() === "") {
          Alert.alert("Error", "Please enter a valid name");
          return;
        } else {
          console.log("Updating profile with:", first, second);
          // Combine first and last names into one object
          updatedData = {
            firstName: first,
            lastName: second,
          };
          break;
        }

      case "email":
        if (email.trim() === "") {
        }
        if (!emailRegex.test(email)) {
          Alert.alert("Error", "Please enter a valid email address");
          return;
        } else {
          updatedData = { email: email };
          break;
        }
      case "nic":
        const nicRegex = /^(\d{9}[vVxX]|\d{12})$/;

        if (!nicRegex.test(nic.trim())) {
          Alert.alert("Error", "Please enter a valid NIC number");
          return;
        } else {
          updatedData = { nic: nic };
          break;
        }
      case "address":
        if (address.trim() === "") {
          Alert.alert("Error", "Please enter a valid Address");
          return;
        } else {
          updatedData = { address: address };
          break;
        }
      case "mobile":
        if (mobileNumber.trim() === "") {
        }
        if (!phoneRegex.test(mobileNumber)) {
          Alert.alert("Error", "Please enter a valid 10-digit phone number");
          return;
        } else {
          updatedData = { mobileNumber: mobileNumber };
          break;
        }

      case "birthday":
        if (selectedDate.trim() === "") {
        } else {
          updatedData = { birthday: selectedDate };
          break;
        }
      case "gender":
        if (selectedGender.trim() === "") {
          Alert.alert("Error", "Please choose a gender");
        } else {
          updatedData = { gender: selectedGender };
          break;
        }
      case "weight":
        if (weight.trim() === "") {
        }
        if (!weightRegex.test(weight)) {
          Alert.alert("Error", "Please enter a valid weight");
          return;
        } else {
          updatedData = { weight: weight };
          break;
        }

      case "height":
        if (height.trim() === "") {
        }
        if (!heightRegex.test(height)) {
          Alert.alert("Error", "Please enter a valid height");
          return;
        } else {
          updatedData = { height: height };
          break;
        }

      case "blood":
        if (bloodGroup.trim() === "") {
        } else {
          updatedData = { blood: bloodGroup };
          break;
        }
      default:
        break;
    }

    // Make an HTTP PUT request to update the patient's information
    api
      .put(`${baseUrl}/patients/${id}`, updatedData)
      .then((response) => {
        console.log(
          "Patient information updated successfully: ",
          response.data
        );
        refreshUserData();
      })
      .catch((error) => {
        console.log("Failed to update patient information: ", error);
      });

    // Close the modal
    setModalVisible(false);
  };

  const renderModalContent = () => {
    switch (category) {
      case "fullName":
        return (
          <View style={styles.modalContent}>
            <Text style={styles.title}>Edit Full Name</Text>
            <TextInput
              style={styles.input}
              value={first}
              onChangeText={(text) => setFirst(text)}
              placeholder="Enter first name"
            />
            <TextInput
              style={styles.input}
              value={second}
              onChangeText={(text) => setSecond(text)}
              placeholder="Enter last name"
            />
            <View style={styles.buttonWrapper}>
              <Button
                color="#00567D"
                title="Save"
                onPress={handleUpdateProfile}
              />
            </View>
            <View style={styles.buttonWrapper}>
              <Button
                color="#00567D"
                title="Cancel"
                onPress={() => setModalVisible(false)}
              />
            </View>
          </View>
        );
      case "email":
        return (
          <View style={styles.modalContent}>
            <Text style={styles.title}>Edit Email Address</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholder="Enter new email address"
            />
            <View style={styles.buttonWrapper}>
              <Button
                color="#00567D"
                title="Save"
                onPress={handleUpdateProfile}
              />
            </View>
            <View style={styles.buttonWrapper}>
              <Button
                color="#00567D"
                title="Cancel"
                onPress={() => setModalVisible(false)}
              />
            </View>
          </View>
        );
      case "nic":
        return (
          <View style={styles.modalContent}>
            <Text style={styles.title}>Edit NIC Number</Text>
            <TextInput
              style={styles.input}
              value={nic}
              onChangeText={(text) => setNic(text)}
              placeholder="Enter NIC Number"
            />
            <View style={styles.buttonWrapper}>
              <Button
                color="#00567D"
                title="Save"
                onPress={handleUpdateProfile}
              />
            </View>
            <View style={styles.buttonWrapper}>
              <Button
                color="#00567D"
                title="Cancel"
                onPress={() => setModalVisible(false)}
              />
            </View>
          </View>
        );
      case "address":
        return (
          <View style={styles.modalContent}>
            <Text style={styles.title}>Edit Address</Text>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={(text) => setAddress(text)}
              placeholder="Enter address"
            />
            <View style={styles.buttonWrapper}>
              <Button
                color="#00567D"
                title="Save"
                onPress={handleUpdateProfile}
              />
            </View>
            <View style={styles.buttonWrapper}>
              <Button
                color="#00567D"
                title="Cancel"
                onPress={() => setModalVisible(false)}
              />
            </View>
          </View>
        );
      case "mobile":
        return (
          <View style={styles.modalContent}>
            <Text style={styles.title}>Edit Mobile Number</Text>
            <TextInput
              style={styles.input}
              value={mobileNumber}
              onChangeText={(text) => setmobileNumber(text)}
              placeholder="Enter new mobile number"
            />
            <View style={styles.buttonWrapper}>
              <Button
                color="#00567D"
                title="Save"
                onPress={handleUpdateProfile}
              />
            </View>
            <View style={styles.buttonWrapper}>
              <Button
                color="#00567D"
                title="Cancel"
                onPress={() => setModalVisible(false)}
              />
            </View>
          </View>
        );

      case "birthday":
        return (
          <View style={styles.modalContent}>
            <Text style={styles.title}>Select Birthday</Text>
            <View style={styles.pickerContainer}>
              <DatePicker
                mode="calendar"
                maximumDate={today} // Set minimum date to today
                onSelectedChange={handleDateChange}
                options={{
                  backgroundColor: "#ffffff",
                  textHeaderColor: "#333333",
                  selectedTextColor: "#ffffff",
                  mainColor: "#f6d147",
                  textSecondaryColor: "#666666",
                  borderColor: "#f6d147",
                }}
              />
            </View>
            <View style={styles.buttonWrapper}>
              <Button
                color="#00567D"
                title="Save"
                onPress={handleUpdateProfile}
              />
            </View>
            <View style={styles.buttonWrapper}>
              <Button
                color="#00567D"
                title="Cancel"
                onPress={() => setModalVisible(false)}
              />
            </View>
          </View>
        );
      case "gender":
        return (
          <View style={styles.modalContent}>
            <Text style={styles.title}>Select Gender</Text>
            <TouchableOpacity
              style={styles.radioButton}
              onPress={() => setSelectedGender("Male")}
            >
              <Icon
                name={selectedGender === "Male" ? "dot-circle" : "circle"}
                size={20}
                color="black"
              />
              <Text style={styles.radioButtonText}>Male</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.radioButton}
              onPress={() => setSelectedGender("Female")}
            >
              <Icon
                name={selectedGender === "Female" ? "dot-circle" : "circle"}
                size={20}
                color="black"
              />
              <Text style={styles.radioButtonText}>Female</Text>
            </TouchableOpacity>
            <View style={styles.buttonWrapper}>
              <Button
                color="#00567D"
                title="Save"
                onPress={handleUpdateProfile}
              />
            </View>
            <View style={styles.buttonWrapper}>
              <Button
                color="#00567D"
                title="Cancel"
                onPress={() => setModalVisible(false)}
              />
            </View>
          </View>
        );
      case "weight":
        return (
          <View style={styles.modalContent}>
            <Text style={styles.title}>Edit Your Weight</Text>

            <TextInput
              style={styles.input}
              value={weight}
              onChangeText={(text) => setWeight(text)}
              placeholder="Enter your weight in kg"
            />
            <View style={styles.buttonWrapper}>
              <Button
                color="#00567D"
                title="Save"
                onPress={handleUpdateProfile}
              />
            </View>
            <View style={styles.buttonWrapper}>
              <Button
                color="#00567D"
                title="Cancel"
                onPress={() => setModalVisible(false)}
              />
            </View>
          </View>
        );

      case "height":
        return (
          <View style={styles.modalContent}>
            <Text style={styles.title}>Edit Your height</Text>
            <TextInput
              style={styles.input}
              value={height}
              onChangeText={(text) => setHeight(text)}
              placeholder="Enter your height in cm"
            />
            <View style={styles.buttonWrapper}>
              <Button
                color="#00567D"
                title="Save"
                onPress={handleUpdateProfile}
              />
            </View>
            <View style={styles.buttonWrapper}>
              <Button
                color="#00567D"
                title="Cancel"
                onPress={() => setModalVisible(false)}
              />
            </View>
          </View>
        );
      case "blood":
        return (
          <View style={styles.modalContent}>
            <Text style={styles.title}>Edit Blood Group</Text>
            <Dropdown
              options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
              placeholderText="Select from the list"
              onSelect={handleBloodGroupSelect}
            />

            <View style={styles.buttonWrapper}>
              <Button
                color="#00567D"
                title="Save"
                onPress={handleUpdateProfile}
              />
            </View>
            <View style={styles.buttonWrapper}>
              <Button
                color="#00567D"
                title="Cancel"
                onPress={() => setModalVisible(false)}
              />
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name={name} size={30} color="black" />
      </View>

      <View style={styles.textcontainer}>
        <Text style={styles.textLineOne}>{textLineOne}</Text>
        <Text style={styles.textLineTwo}>{textLineTwo}</Text>
        <View style={styles.horizontalLine} />
      </View>
      <TouchableOpacity
        style={styles.arrowRight}
        onPress={() => setModalVisible(true)}
      >
        <Icon name="chevron-right" size={15} color="black" />
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>{renderModalContent()}</View>
      </Modal>
    </View>
  );
};

export default DetailRow;
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",

    marginLeft: 30,
  },
  textcontainer: {
    flexDirection: "column",

    marginLeft: 40,
  },
  iconContainer: {
    marginTop: 0,
    flexDirection: "row",
    width: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  textLineOne: {
    fontSize: 16,
    color: "grey",
  },
  textLineTwo: {
    fontSize: 16,
    color: "black",
  },
  horizontalLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginVertical: 15,
    width: 230,
  },
  arrowRight: {
    marginTop: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  radioButtonText: {
    fontSize: 16,
    marginLeft: 10,
  },
  sliderContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  weightControl: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  heightControl: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedWeight: {
    fontSize: 18,
    marginHorizontal: 20,
  },
  selectedheight: {
    fontSize: 18,
    marginHorizontal: 20,
  },
  arrowButton: {
    padding: 10,
  },
  Button: {
    marginTop: 20,
  },
  pickerContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  picker: {
    flex: 1,
    height: 50,
    color: "black",
  },
  years: {
    color: "black",
  },
  pickeritem: {
    color: "black",
    width: 150,
  },

  buttonWrapper: {
    marginTop: 5,
    width: "100%", // Adjust as needed
  },
});
