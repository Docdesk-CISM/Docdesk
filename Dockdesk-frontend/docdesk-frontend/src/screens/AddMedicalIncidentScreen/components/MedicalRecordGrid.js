import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Linking,
  Text,
  Pressable,
  Animated,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ToochableIconDown from "../../ViewPatientSummaryHome Screen/Components/TouchableIconDown";
import api from "../../../Services/AuthService";
import { baseUrl } from "../../../constants/constants";
import { MaterialIcons } from "@expo/vector-icons";

// Utility function to format date
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

const truncateText = (text, maxLength) => {
  if (text && text.length > maxLength) {
    return `${text.substring(0, 30)}...`;
  }
  return text;
};

function MedicalRecordGrid({
  recordName,
  recordID,

  recordDescription,
  incidents = [],
}) {
  const [expanded, setExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(100); // Initial height
  const [medicalincidents, setMedicalincidents] = useState([]);
  const heightAnim = useRef(new Animated.Value(100)).current;

  const calculateContentHeight = () => {
    const baseHeight = 120; // Base height without incidents
    const testIncidentHeight =
      (medicalincidents.testIncidents?.length || 0) * 200;
    const symptomIncidentHeight =
      (medicalincidents.symptomIncidents?.length || 0) * 200;
    const appointmentIncidentHeight =
      (medicalincidents.appointmentIncidents?.length || 0) * 200;
    const prescriptionIncidentHeight =
      (medicalincidents.prescriptionIncidents?.length || 0) * 200;

    return (
      baseHeight +
      testIncidentHeight +
      symptomIncidentHeight +
      appointmentIncidentHeight +
      prescriptionIncidentHeight
    );
  };

  const fetchMedicalIncidents = async () => {
    try {
      const response = await api.get(`${baseUrl}/medicalRecord/getRecord`, {
        params: {
          recordID: recordID,
        },
      });
      setMedicalincidents(response.data.currentRecord.incidents); // Update state with fetched records
    } catch (error) {
      console.log("Error fetching medical incidents:", error);
    }
  };

  useEffect(() => {
    if (expanded) {
      fetchMedicalIncidents();
    }
  }, [expanded]);

  useEffect(() => {
    if (expanded) {
      const newHeight = calculateContentHeight();
      setContentHeight(newHeight);
      Animated.timing(heightAnim, {
        toValue: newHeight,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      setContentHeight(100); // Reset to initial height
      Animated.timing(heightAnim, {
        toValue: 100,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [expanded, medicalincidents]);

  const handlePress = () => {
    setExpanded(!expanded);
  };

  const navigation = useNavigation();

  // console.log(medicalincidents.symptomIncidents);

  const handleAddNew = () => {
    navigation.navigate("MedicalIncidentHomeScreen", {
      recordName,
      recordDescription,

      recordID,
    });
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
                `${baseUrl}/medicalIncident/${incidentType}/delete/${recordID}/${incidentID}`
              );
              if (response.status === 200) {
                // Remove the incident from the state
                setMedicalincidents((prevIncidents) => {
                  const updatedIncidents = { ...prevIncidents };
                  updatedIncidents[incidentType] = updatedIncidents[
                    incidentType
                  ].filter((incident) => incident._id !== incidentID);
                  return updatedIncidents;
                });
              }
            } catch (error) {
              console.log("Error deleting incident:", error);
            }
          },
        },
      ]
    );
  };

  return (
    <Animated.View
      style={[
        styles.tile,
        expanded && styles.expandedContainer,
        { height: heightAnim },
      ]}
    >
      <View style={styles.titleGrid}>
        <Text style={styles.title}>{recordName}</Text>
      </View>
      <View style={styles.icon}>
        <ToochableIconDown
          onPress={handlePress}
          iconName={expanded ? "up" : "down"}
          iconSize={20}
          iconColor="white"
        />
      </View>
      <View>
        <Text style={styles.description}>{recordDescription}</Text>
      </View>
      {/* Render Test Incidents */}
      {expanded &&
        medicalincidents.testIncidents &&
        medicalincidents.testIncidents.length > 0 && (
          <View style={styles.incidentContainer}>
            {medicalincidents.testIncidents.map((incident, index) => (
              <View
                key={index}
                style={[styles.subcom, { backgroundColor: "#FEFFE0" }]}
              >
                <View
                  style={[styles.innertile, { backgroundColor: "#FFEBA5" }]}
                >
                  <Text style={styles.innertext}>TEST</Text>
                </View>
                <Text style={styles.date}>{formatDate(incident.date)}</Text>
                <Text style={styles.subtext}>{incident.testType}</Text>
                <Text style={styles.provider}>
                  Tested On: {formatDate(incident.testDate)}{" "}
                </Text>
                <Text style={styles.provider}>
                  Test Provider:{incident.provider}{" "}
                </Text>
                <Text style={styles.provider}>Result: {incident.result} </Text>
                {incident.resultLink && (
                  <TouchableOpacity
                    onPress={() => handleLinkPress(incident.resultLink)}
                  >
                    <Text style={[styles.provider, { color: "blue" }]}>
                      {incident.resultLink}{" "}
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() =>
                    deleteHandler(incident._id, recordID, "testIncidents")
                  }
                  style={styles.deletebutton}
                >
                  <MaterialIcons name="delete" size={24} color="black" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      {/* Render Symptom Incidents */}
      {expanded &&
        medicalincidents.symptomIncidents &&
        medicalincidents.symptomIncidents.length > 0 && (
          <View style={styles.incidentContainer}>
            {medicalincidents.symptomIncidents.map((incident, index) => (
              <View
                key={index}
                style={[styles.subcom, { backgroundColor: "#FFEBEB" }]}
              >
                <View
                  style={[styles.innertile, { backgroundColor: "#FF9999" }]}
                >
                  <Text style={styles.innertext}>SYMPTOM</Text>
                </View>
                <Text style={styles.date}>
                  {formatDate(incident.symptomDate)}
                </Text>
                <Text style={styles.subtext}>{incident.symptomType}</Text>
                <Text
                  style={[styles.provider, { width: "60%", color: "brown" }]}
                >
                  Note:{incident.symptomDescription}
                </Text>
                <Text style={styles.provider}>
                  Frequency: {incident.symptomFrequency}
                </Text>
                <Text style={styles.provider}>
                  Severity: {incident.severity}
                </Text>
                <Text style={styles.provider}>
                  Duration: {incident.symptomDuration}
                </Text>
                <Text style={styles.provider}>
                  appetite: {incident.appetite}
                </Text>
                <Text style={styles.provider}>weight: {incident.weight}</Text>
                <TouchableOpacity
                  onPress={() =>
                    deleteHandler(incident._id, recordID, "symptomIncidents")
                  }
                  style={styles.deletebutton}
                >
                  <MaterialIcons name="delete" size={24} color="black" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      {/* Render Appointment Incidents */}
      {expanded &&
        medicalincidents.appointmentIncidents &&
        medicalincidents.appointmentIncidents.length > 0 && (
          <View style={styles.incidentContainer}>
            {medicalincidents.appointmentIncidents.map((incident, index) => (
              <View
                key={index}
                style={[styles.subcom, { backgroundColor: "#E0FFE0" }]}
              >
                <View
                  style={[styles.innertile, { backgroundColor: "#99FF99" }]}
                >
                  <Text style={styles.innertext}>APPOINTMENT</Text>
                </View>
                <Text style={styles.date}>{formatDate(incident.date)}</Text>
                <Text style={styles.subtext}>Dr.{incident.doctorName}</Text>
                <Text style={styles.provider}>
                  Scheduled On: {formatDate(incident.appointmentDateTime)}
                </Text>
                <Text style={styles.provider}>
                  Type: {incident.appointmentType}
                </Text>
                <Text
                  style={[styles.provider, { width: "60%", color: "brown" }]}
                >
                  Note:{incident.description}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    deleteHandler(
                      incident._id,
                      recordID,
                      "appointmentIncidents"
                    )
                  }
                  style={styles.deletebutton}
                >
                  <MaterialIcons name="delete" size={24} color="black" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      {/* Render Prescription Incidents */}
      {expanded &&
        medicalincidents.prescriptionIncidents &&
        medicalincidents.prescriptionIncidents.length > 0 && (
          <View style={styles.incidentContainer}>
            {medicalincidents.prescriptionIncidents.map((incident, index) => (
              <View
                key={index}
                style={[styles.subcom, { backgroundColor: "#ebded4" }]}
              >
                <View
                  style={[styles.innertile, { backgroundColor: "#c4a092" }]}
                >
                  <Text style={styles.innertext}>PRESCRIPTION</Text>
                </View>
                <Text style={styles.date}>{formatDate(incident.date)}</Text>
                <Text style={styles.subtext}>Dr. {incident.doctorName}</Text>
                <Text style={styles.provider}>
                  Prescripted Date: {formatDate(incident.PrescriptionDate)}
                </Text>
                <Text
                  style={[styles.provider, { color: "brown", width: "60%" }]}
                >
                  Note: {incident.description}
                </Text>
                {incident.link && (
                  <TouchableOpacity
                    onPress={() => handleLinkPress(incident.link)}
                  >
                    <Text
                      style={[
                        styles.provider,
                        { marginLeft: "38%", color: "blue" },
                      ]}
                    >
                      {incident.link}{" "}
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() =>
                    deleteHandler(
                      incident._id,
                      recordID,
                      "prescriptionIncidents"
                    )
                  }
                  style={styles.deletebutton}
                >
                  <MaterialIcons name="delete" size={24} color="black" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      {expanded && (
        <Pressable style={styles.btn} onPress={handleAddNew}>
          <Text style={styles.btntext}>+ New Incident</Text>
        </Pressable>
      )}
    </Animated.View>
  );
}

export default MedicalRecordGrid;

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    width: "90%",
    marginBottom: "2%",
    marginTop: "2%",
    marginLeft: "5%",
    marginRight: "5%",
    borderRadius: 20,
    elevation: 2,
    backgroundColor: "white",
    shadowColor: "black",
    shadowOpacity: 0.25,
    textShadowRadius: 8,
  },
  btn: {
    backgroundColor: "#DEFFFB",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    width: "30%",
    alignSelf: "center",
    marginTop: "1%",
  },
  btntext: {
    color: "#00567D",
    fontSize: 14,
    margin: 2,
    fontWeight: "bold",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 7,
    marginLeft: 25,
    color: "white",
  },
  description: {
    paddingLeft: 25,
    fontSize: 15,
    paddingBottom: 5,
    marginTop: 10,
    fontWeight: "600",
  },
  icon: {
    position: "absolute",
    right: 10,
    top: 20,
  },
  subtile: {
    width: "90%",
    marginBottom: "2%",
    marginTop: "3%",
    marginLeft: "5%",
    marginRight: "5%",
    height: 97,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "black",
    shadowOpacity: 0.25,
    textShadowRadius: 8,
  },
  innertile: {
    width: "33%",
    marginBottom: "2%",
    marginTop: "2%",
    marginLeft: "1%",
    marginRight: "3%",
    height: 22,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "black",
    shadowOpacity: 0.25,
    textShadowRadius: 8,
  },
  innertext: {
    fontSize: 14,
    marginTop: 2,
    fontWeight: "bold",
    alignSelf: "center",
  },
  subtext: {
    paddingLeft: 2,
    marginLeft: "38%",

    marginTop: "-20%",
    fontWeight: "900",
    // maxWidth: "77%",
  },
  subcom: {
    flexDirection: "column",
    borderRadius: 10,
    elevation: 2,
    shadowColor: "black",
    shadowOpacity: 0.25,
    textShadowRadius: 8,
    width: "100%",
    marginBottom: "2%",
  },
  date: {
    marginLeft: "5%",
    fontSize: 14,
    marginTop: "5%",
    fontWeight: "700",
  },
  titleGrid: {
    width: "100%",
    backgroundColor: "#575757",
    marginTop: "4%",
    paddingBottom: "2%",
    borderRadius: 10,
  },
  incidentContainer: {
    marginTop: 10, // Adjust as needed
  },
  provider: {
    marginLeft: "38%",
    fontWeight: "600",
    // marginTop: "-6%",
    width: "70%",
  },
  deletebutton: {
    marginLeft: "88%",
    marginTop: "3%",
    marginBottom: "3%",
  },
});
