import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Linking,
  Text,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
  Pressable,
  Modal,
  TextInput,
  Button,
  RefreshControl,
  KeyboardAvoidingView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import api from "../../Services/AuthService";
import { baseUrl } from "../../constants/constants";
import { MaterialIcons } from "@expo/vector-icons";
import Header from "../../components/Header";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);
  return `${year}/${month}/${day}`;
};

const handleLinkPress = (url) => {
  Linking.openURL(url).catch((err) => console.log("An error occurred", err));
};

const IncidentListScreen = ({
  route,
  navigation,
  recordName,
  recordID,
  recordDescription,
}) => {
  const { record } = route.params;
  const [medicalincidents, setMedicalincidents] = useState([]);
  const [sortedIncidents, setSortedIncidents] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [recordname, setRecordname] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const fetchMedicalIncidents = async () => {
    try {
      const response = await api.get(`${baseUrl}/medicalRecord/getRecord`, {
        params: {
          recordID: record._id,
        },
      });

      setMedicalincidents(response.data.currentRecord.incidents);
    } catch (error) {
      console.log("Error fetching medical records:", error);
    }
  };

  useEffect(() => {
    fetchMedicalIncidents();
  }, []);

  useEffect(() => {
    const combineAndSortIncidents = () => {
      const allIncidents = [
        ...(medicalincidents.testIncidents || []).map((incident) => ({
          ...incident,
          type: "testIncidents",
          date: new Date(incident.testDate),
        })),
        ...(medicalincidents.symptomIncidents || []).map((incident) => ({
          ...incident,
          type: "symptomIncidents",
          date: new Date(incident.symptomDate),
        })),
        ...(medicalincidents.appointmentIncidents || []).map((incident) => ({
          ...incident,
          type: "appointmentIncidents",
          date: new Date(incident.addedDate),
        })),
        ...(medicalincidents.prescriptionIncidents || []).map((incident) => ({
          ...incident,
          type: "prescriptionIncidents",
          date: new Date(incident.PrescriptionDate),
        })),
      ];

      allIncidents.sort((a, b) => b.date - a.date);
      setSortedIncidents(allIncidents);
    };

    combineAndSortIncidents();
  }, [medicalincidents]);

  const handleAddNew = () => {
    navigation.navigate("MedicalIncidentHomeScreen", {
      recordName,
      recordDescription,
      recordID: record._id,
    });
  };
  const deleteRecordHandler = (recordID) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this medical record?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              const response = await api.delete(
                `${baseUrl}/medicalRecord/record/${record._id}`
              );
              if (response.status === 200) {
                setMedicalRecords((prevRecords) => {
                  return prevRecords.filter(
                    (record) => record._id !== recordID
                  );
                });
                console.log("Medical Record deleted successfully");
              } else {
                console.log(
                  "Failed to delete medical record:",
                  response.data
                );
              }
              navigation.navigate("DisplayMedicalRecords");
            } catch (error) {
              console.log("Error deleting medical record:", error);
            }
          },
        },
      ]
    );
  };
  const updateRecordHandler = async (recordID) => {
    try {
      const updatedFields = {};

      if (recordname.trim() !== "") {
        updatedFields.recordName = recordname;
      }
      if (description.trim() !== "") {
        updatedFields.recordDescription = description;
      }
      if (date.trim() !== "") {
        updatedFields.date = date;
      }

      if (Object.keys(updatedFields).length === 0) {
        Alert.alert("Error", "Please fill at least one field to update.");
        return;
      }

      const response = await api.put(
        `${baseUrl}/medicalRecord/update/${record._id}`,
        updatedFields
      );

      if (response.status === 200) {
        Alert.alert("Success", "Record updated successfully");
        setModalVisible(false);
        setMedicalRecords((prevRecords) =>
          prevRecords.map((record) =>
            record._id === recordID
              ? {
                  ...record,
                  ...updatedFields,
                }
              : record
          )
        );
      } else {
        Alert.alert("Error", response.data.error || "Failed to update record");
      }
      navigation.navigate("DisplayMedicalRecords");
    } catch (error) {
      console.log("Error updating record:", error);
      Alert.alert("Error", "An error occurred while updating the record");
    }
  };

  const renderModalContent = () => {
    return (
      <View style={styles.modalContent}>
        <Text style={styles.title}>Edit Record</Text>
        <TextInput
          style={styles.input}
          value={recordname}
          onChangeText={(text) => setRecordname(text)}
          placeholder="Enter Record Name"
        />
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={(text) => setDescription(text)}
          placeholder="Enter Description"
        />
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={(text) => setDate(text)}
          placeholder="Enter Date"
        />
        <View style={styles.buttonContainer}>
          <View style={styles.buttonWrapper}>
            <Button
              color="#00567D"
              title="Save"
              onPress={updateRecordHandler}
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
      </View>
    );
  };

  const deleteHandler = (incidentID, recordID, incidentType) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this incident?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              const response = await api.delete(
                `${baseUrl}/medicalIncident/${incidentType}/delete/${record._id}/${incidentID}`
              );
              if (response.status === 200) {
                setMedicalincidents((prevIncidents) => {
                  const updatedIncidents = { ...prevIncidents };
                  updatedIncidents[incidentType] = updatedIncidents[
                    incidentType
                  ].filter((item) => item._id !== incidentID);
                  return updatedIncidents;
                });
              } else {
                console.log("Failed to delete incident:", response.data);
              }
            } catch (error) {
              console.log("Error deleting incident:", error);
            }
          },
        },
      ]
    );
  };

  console.log("Record:", record._id);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header name={record.recordName} />
      <ScrollView>
        <View style={styles.background}>
          <View style={styles.container}>
            <View style={styles.recordContainer}>
              <View>
                <Text style={styles.label}>Record Name:</Text>
                <Text style={styles.recordValue}>{record.recordName}</Text>
              </View>
              <View>
                <Text style={styles.label}>Description:</Text>
                <Text style={styles.recordValue}>{record.description}</Text>
              </View>
              <View>
                <Text style={styles.label}>Date:</Text>
                <Text style={styles.recordValue}>
                  {formatDate(record.recordDate)}
                </Text>
              </View>
              <View style={styles.recButtons}>
                <TouchableOpacity
                  onPress={() => deleteRecordHandler(recordID)}
                  style={styles.deletebuttonRec}
                >
                  <MaterialIcons name="delete" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setRecordname(record.recordName);
                    setDescription(record.description);
                    setDate(formatDate(record.recordDate));
                    setModalVisible(true);
                  }}
                  style={styles.editbutton}
                >
                  <MaterialIcons name="create" size={24} color="black" />
                </TouchableOpacity>
              </View>

              <Modal
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
                animationType="slide"
                transparent={true}
              >
                <SafeAreaView style={styles.safeAreaModal}>
                  <KeyboardAvoidingView style={styles.modalContainer}>
                    {renderModalContent()}
                  </KeyboardAvoidingView>
                </SafeAreaView>
              </Modal>
            </View>

            <View style={styles.incidentsContainer}>
              {sortedIncidents.length === 0 ? (
                <Text style={styles.noIncidentsText}>No incidents added</Text>
              ) : (
                sortedIncidents.map((incident, index) => (
                  <View
                    key={index}
                    style={[
                      styles.subcom,
                      {
                        backgroundColor:
                          incident.type === "testIncidents"
                            ? "#FEFFE0"
                            : incident.type === "symptomIncidents"
                            ? "#FFEBEB"
                            : incident.type === "appointmentIncidents"
                            ? "#E0FFE0"
                            : "#ebded4",
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.innertile,
                        {
                          backgroundColor:
                            incident.type === "testIncidents"
                              ? "#FFEBA5"
                              : incident.type === "symptomIncidents"
                              ? "#FF9999"
                              : incident.type === "appointmentIncidents"
                              ? "#99FF99"
                              : "#c4a092",
                        },
                      ]}
                    >
                      <Text style={styles.innertext}>
                        {incident.type === "testIncidents"
                          ? "TEST"
                          : incident.type === "symptomIncidents"
                          ? "SYMPTOM"
                          : incident.type === "appointmentIncidents"
                          ? "APPOINTMENT"
                          : "PRESCRIPTION"}
                      </Text>
                    </View>

                    {incident.type === "testIncidents" && (
                      <>
                        <Text style={styles.date}>
                          {formatDate(incident.testDate)}
                        </Text>
                        <Text style={styles.subtext}>{incident.testType}</Text>

                        <Text style={styles.provider}>
                          Test Provider: {incident.provider}{" "}
                        </Text>
                        <Text style={styles.provider}>
                          Result: {incident.result}{" "}
                        </Text>
                        {incident.resultLink && (
                          <TouchableOpacity
                            onPress={() => handleLinkPress(incident.resultLink)}
                          >
                            <Text style={[styles.provider, { color: "blue" }]}>
                              {incident.resultLink}
                            </Text>
                          </TouchableOpacity>
                        )}
                      </>
                    )}
                    {incident.type === "symptomIncidents" && (
                      <>
                        <Text style={styles.date}>
                          {formatDate(incident.symptomDate)}
                        </Text>
                        <Text style={styles.subtext}>
                          {incident.symptomType}
                        </Text>
                        <Text style={styles.provider}>
                          Note: {incident.symptomDescription}
                        </Text>
                        <Text style={styles.provider}>
                          Frequency: {incident.symptomFrequency}
                        </Text>
                        <Text style={styles.provider}>
                          Severity: {incident.severity} /10
                        </Text>
                        <Text style={styles.provider}>
                          Duration: {incident.symptomDuration}
                        </Text>
                        <Text style={styles.provider}>
                          Appetite: {incident.appetite} /10
                        </Text>
                        <Text style={styles.provider}>
                          Weight: {incident.weight}
                        </Text>
                      </>
                    )}
                    {incident.type === "appointmentIncidents" && (
                      <>
                        <Text style={styles.date}>
                          {formatDate(incident.addedDate)}
                        </Text>
                        <Text style={styles.subtext}>
                          Dr. {incident.doctorName}
                        </Text>
                        <Text style={styles.provider}>
                          Scheduled On:{" "}
                          {formatDate(incident.appointmentDateTime)}
                        </Text>
                        <Text style={styles.provider}>
                          Type: {incident.appointmentType}
                        </Text>
                        <Text style={styles.provider}>
                          Note: {incident.description}
                        </Text>
                      </>
                    )}
                    {incident.type === "prescriptionIncidents" && (
                      <>
                        <Text style={styles.subtext}>
                          Dr. {incident.doctorName}
                        </Text>
                        <Text style={styles.provider}>
                          Prescripted Date:{" "}
                          {formatDate(incident.PrescriptionDate)}
                        </Text>
                        <Text style={styles.provider}>
                          Note: {incident.description}
                        </Text>
                        {incident.link && (
                          <TouchableOpacity
                            onPress={() => handleLinkPress(incident.link)}
                          >
                            <Text style={[styles.provider, { color: "blue" }]}>
                              {incident.link}
                            </Text>
                          </TouchableOpacity>
                        )}
                      </>
                    )}
                    <TouchableOpacity
                      onPress={() =>
                        deleteHandler(incident._id, recordID, incident.type)
                      }
                      style={styles.deletebutton}
                    >
                      <MaterialIcons name="delete" size={24} color="black" />
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>
          </View>
        </View>
      </ScrollView>
      <Pressable style={styles.btn} onPress={handleAddNew}>
        <Text style={styles.btntext}>Add New Incident</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default IncidentListScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  safeAreaModal: {
    flex: 1,
  },
  recordContainer: {
    padding: 20,
    backgroundColor: "white",
    margin: 10,
    borderRadius: 10,
    elevation: 3,
  },
  container: {
    flexDirection: "column",
    width: "100%",
    backgroundColor: "white",
  },
  // background: {
  //   backgroundColor: "white",
  //   width: "100%",
  //   height: "100%",
  //   padding: 15,
  // },
  label: {
    fontWeight: "bold",
    fontSize: 16,
  },
  recordValue: {
    fontSize: 16,
    marginBottom: 10,
  },
  incidentsContainer: {
    padding: 20,
  },
  sectionHeader: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
  },
  subcom: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 3,
  },
  innertile: {
    padding: 5,
    borderRadius: 5,
    marginBottom: 10,
  },
  innertext: {
    fontWeight: "bold",
    fontSize: 15,
  },
  date: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: "500",
  },
  subtext: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: "500",
  },
  provider: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: "500",
  },
  deletebutton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  recButtons: {
    flexDirection: "row",
  },
  deletebuttonRec: {
    left: 295,
  },
  editbutton: {
    left: -20,
  },
  btn: {
    backgroundColor: "#00567D",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    width: "93%",
    padding: 2,
    marginBottom: "4%",
    alignSelf: "center",
  },
  btntext: {
    color: "#FFF",
    padding: 8,
    fontSize: 17,
    fontWeight: "bold",
  },
  noIncidentsText: {
    textAlign: "center",
    fontSize: 16,
    color: "gray",
    marginVertical: 20,
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
    paddingBottom: "16%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  input: {
    borderColor: "#8e8e8e",
    borderWidth: 1,
    padding: 10,
    height: 40,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    width: "92%",
    left: 30,
    top: 220,
  },
  buttonWrapper: {
    width: "40%", // Adjust as needed
  },
});
