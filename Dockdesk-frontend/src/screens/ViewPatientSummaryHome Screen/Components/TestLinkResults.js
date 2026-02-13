import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  Linking,
} from "react-native";
import api from "../../../Services/AuthService";
import { baseUrl } from "../../../constants/constants";
import { DataTable } from "react-native-paper";

const TestLinkResults = ({ PID }) => {
  const [testResult, setTestResult] = useState([]);

  const getTestResults = async () => {
    console.log(PID);
    try {
      const response = await api.get(`/extTests/getLinks/`, {
        params: {
          patientID: PID,
        },
      });
      console.log(response.data);
      setTestResult(response.data);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "There was an error fetching test results.");
    }
  };

  useEffect(() => {
    getTestResults();
  }, []);
  const handleOpenURL = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", `Don't know how to open this URL: ${url}`);
      }
    } catch (error) {
      Alert.alert("Error", `Failed to open URL: ${url}`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titlecontainer}>
        <Text style={styles.title}>Test Result Links</Text>
      </View>
      <View style={styles.tablecontainer}>
        <Text style={styles.headtext}>Past Results</Text>
        <View style={styles.subson}>
          <Text style={styles.text}>Test Name</Text>
          <Text style={styles.text}>Test Link</Text>
        </View>
      </View>
      <DataTable>
        {testResult &&
          testResult.map((data, index) => (
            <DataTable.Row key={index}>
              <DataTable.Cell
                style={{
                  justifyContent: "center",
                  backgroundColor: "#d4ffde",
                  marginBottom: 5,
                  paddingRight: 10,
                  borderBottomLeftRadius: 10,
                  borderTopLeftRadius: 10,
                  width: "50%",
                  textAlign: "center",
                }}
              >
                {data.TestName}
              </DataTable.Cell>
              <DataTable.Cell
                style={{
                  justifyContent: "center",
                  backgroundColor: "#d4ffde",
                  marginBottom: 5,
                  borderBottomRightRadius: 10,
                  borderTopRightRadius: 10,
                  width: "50%",
                  textAlign: "center",
                }}
              >
                {/* {data.link} */}
                <TouchableOpacity onPress={() => handleOpenURL(data.link)}>
                  <Text style={styles.linkText}>{data.link}</Text>
                </TouchableOpacity>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
      </DataTable>
    </View>
  );
};

export default TestLinkResults;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  titlecontainer: {
    marginTop: 15,
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginLeft: 20,
  },
  tablecontainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#d4ffde",
    marginTop: 10,
    margin: "4%",
    marginBottom: 10,
    borderRadius: 20,
  },
  headtext: {
    fontSize: 20,
    padding: 10,
    paddingBottom: 10,
    fontWeight: "bold",
  },
  subson: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    margin: 10,
  },
  text: {
    fontSize: 14,
    padding: 10,
    justifyContent: "center",
    fontWeight: "bold",
    width: "50%",
    textAlign: "center",
  },
  rowContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#d4ffde",
    marginTop: 10,
    margin: "10%",
    borderRadius: 20,
  },
  button: {
    backgroundColor: "#d4ffde",
    height: 30,
    width: 70,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 20,
    top: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    width: "90%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: "#FBDABB",
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  overlay: {
    position: "absolute",
    top: 160,
    left: -5,
  },
  overlayText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    transform: [{ rotate: "-90deg" }],
  },
  overlayTextDate: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
  overlayDate: {
    position: "absolute",
    top: 310,
    left: 150,
  },
  linkText: {
    color: "blue",
    textDecorationLine: "underline",
  },
});
