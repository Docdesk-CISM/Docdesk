import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";

import { z } from "zod";
import api from "../../Services/AuthService";
import { baseUrl } from "../../constants/constants";

const ForgotPassword = ({ navigation, route }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  
  const userType = route.params.userType;

  const handleResetPassword = async () => {
    setLoading(true); // Set loading to true when initiating password reset request

    const validateEmail = z.string().email();
    const result = validateEmail.safeParse(email);
    if (!result.success) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }
    api
      .post(baseUrl + "/forgotPassword", { email, userType })
      .then((response) => {
        console.log("Response from forgot password:", response);
        if (response.status == 200) {
          Alert.alert("Success", response.data.message);
          navigation.navigate("OTPVerificationScreen", { email, userType });
        } else {
          Alert.alert("Error", response.data.error);
        }
      })
      .catch((error) => {
        console.log("Error resetting password:", error.response.data.error);
        Alert.alert(
          "Error",
          error.response.data.error,
        );
      })
      .finally(() => {
        setLoading(false); // Set loading to false regardless of success or failure
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleResetPassword}
        disabled={loading} // Disable button while loading
      >
        {loading ? (
          <ActivityIndicator color="#fff" /> // Show loading indicator if loading
        ) : (
          <Text style={styles.buttonText}>Reset Password</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.link}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7FEFF",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 40,
    borderWidth: 1,
    borderColor: "#00567D",
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#30A8DE",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  link: {
    marginTop: 20,
    color: "#30A8DE",
    textDecorationLine: "underline",
  },
});

export default ForgotPassword;
