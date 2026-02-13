import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";

import { baseUrl } from "../../../constants/constants";

import api from "../../../Services/AuthService";

const OTPVerificationScreen = ({ route, navigation }) => {
  const [otp, setOTP] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [otpSent, setOTPSent] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [verifyButton, setVerifyButton] = useState(false); 
  const [countdown, setCountdown] = useState(60); 

  const { email } = route.params;

  const startCountdown = () => {
    const intervalId = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 0) {
          clearInterval(intervalId);
          setDisableButton(false); 
          setResendLoading(false); 
          setVerifyButton(false);

          return 60; 
        }
        return prevCountdown - 1;
      });
    }, 1000);
  };

  const handleVerifyOTP = async () => {
    setLoading(true);

    api
      .post(baseUrl + "/verifyOtpPatient", { email, otp })
      .then((response) => {
        if (response.status == 200) {
          Alert.alert("Success", response.data.message);
          navigation.navigate("PatientLogin");
        } else {
          Alert.alert("Error", response.data.error);
        }
      })
      .catch((error) => {
        console.log("Error verifying OTP:", error);
        Alert.alert("Error", error.response.data.error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleGetOTP = async () => {
    setResendLoading(true);
    setOTPSent(true);
    setDisableButton(true); 
    startCountdown(); 
    api
      .post(baseUrl + "/getOTP", { email })
      .then((response) => {
        if (response.status == 200) {
          Alert.alert("Success", response.data.message);
          setDisableButton(true); 
            setVerifyButton(true);

        } else {
          Alert.alert("Error", response.data.error);
        }
      })
      .catch((error) => {
        console.log("Error getting OTP:", error);
        Alert.alert("Error", error.response.data.error);
      })
      .finally(() => {
        setResendLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOTP}
        editable={!resendLoading}
      />

      {otpSent && verifyButton && (
        <TouchableOpacity
          style={[styles.button]}
          onPress={handleVerifyOTP}
          disabled={loading || resendLoading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Verify OTP</Text>
          )}
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.button, disableButton && styles.disabledButton]}
        onPress={handleGetOTP}
        disabled={disableButton || resendLoading}
      >
        {resendLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {disableButton ? `Resend OTP in ${countdown} sec` : "Get OTP"}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.link}>Back</Text>
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
  disabledButton: {
    backgroundColor: "#CCCCCC", 
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

export default OTPVerificationScreen;
