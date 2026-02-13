import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import Header from "../../MedicalTestHomeScreen/components/Header";
import api from "../../../Services/AuthService";

import { baseUrl } from "../../../constants/constants";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useIsFocused } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

//navigate to medication adding form
const MedicationView = ({ navigation, route }) => {
  const { user } = useAuthContext();
  // const { refresh } = route.params ? route.params : { refresh: false };
  const [currentUserID, setCurrentUserID] = useState(undefined);
  const [medidetail, setmedidetail] = useState([]);
  const [loading, setLoading] = useState(true);
  const [docMode, setDocMode] = useState(false);

  // console.log("Doc", docMode)

  const updateUser = () => {
    if (route.params?.PID === undefined) {
      console.log("PID is undefined");
      setCurrentUserID(user._id);
    } else {
      setCurrentUserID(route.params.PID);
      setDocMode(true);
      console.log("User", user.fName);
      console.log("PID is defined", route.params.PID);
    }
  };

  useEffect(() => {
    console.log("Medication View Page");
    updateUser();
  }, []);

  useEffect(() => {
    console.log("Current User ID", currentUserID);
    if (currentUserID !== undefined) {
      getmedication();
    }
  }, [currentUserID]);

  //API integration for get results
  const getmedication = () => {
    setLoading(true);
    // console.log("Current User ID", currentUserID);
    api
      .get(`${baseUrl}/medication/getOne/${currentUserID}`)
      .then((response) => {
        // console.log("Medication Data : ", response.data);
        setmedidetail(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Axios Error : ", error);
        setLoading(false);
      });
  };

  //API integration for delete a specific medication
  const deleteOneResult = (id) => {
    console.log(id);
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this medication?",
      [
        {
          text: "Cancel",
          onPress: () => {
            console.log("Cancel deletion");
          },
        },
        {
          text: "OK",
          onPress: () => {
            api
              .delete(`${baseUrl}/medication/${id}`)
              .then(() => {
                getmedication();
              })
              .catch((error) => {
                console.log("Axios Error : ", error);
              });
          },
        },
      ]
    );
  };

  const updateMedication = (id) => {
    const selectedItem = medidetail.find((item) => item._id === id);
    navigation.navigate("AddMedication", {
      refreshMedicationView: true,
      selectedItem,
      PID: docMode ? currentUserID : null,
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <Header name="Medications Entries" />
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading...</Text>
        </View>
      ) : medidetail.length === 0 ? (
        <View style={styles.centered}>
          <Text>No medications</Text>
        </View>
      ) : (
        <FlatList
          data={medidetail}
          renderItem={({ item }) => (
            <View style={styles.listContainer}>
              <Text style={styles.medicineNametext}>
                {item.medicine} - {item.meditype} ({item.unit})
              </Text>
              <Text>Medication from : {item.addedDate}</Text>
              <Text style={styles.daystext}>
                For {item.days} {item.duration}
              </Text>
              <View style={styles.detailContainer}>
                <Text style={styles.pilltext}>
                  {item.pills}{" "}
                  {item.meditype === "Tablet" ? <Text>tablet/s</Text> : <Text>ml</Text>}
                </Text>
                <Text style={styles.timestext}>
                  {item.times} time/s per {item.frequency}
                </Text>
                <Text style={styles.bawtext}>{item.baw} meal</Text>
              </View>
              {item.description !== null && item.description !== "" && (
                <Text style={styles.descriptiontext}>{item.description}</Text>
              )}
              <View style={styles.listbottom}>
                <View style={styles.byContainer}>
                  <Text style={styles.bytext}>added by : {item.addedBy}</Text>
                  <Text style={styles.bytext}>{item.sDate}</Text>
                </View>
                <View style={styles.editdeleteContainer}>
                  <TouchableOpacity
                    disabled={
                      docMode
                        ? item.addedBy !== user.fName
                        : item.addedBy !== "Patient"
                    }
                    onPress={() => {
                      updateMedication(item._id);
                    }}
                  >
                    <Feather
                      style={[
                        styles.edittext,
                        docMode
                          ? item.addedBy !== user.fName
                          : item.addedBy !== "Patient",
                      ]}
                      name="edit-2"
                      size={16}
                      color="black"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      deleteOneResult(item._id);
                    }}
                  >
                    <MaterialIcons
                      name="delete-outline"
                      size={16}
                      color="black"
                      style={styles.deletetext}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    width: "90%",
    marginBottom: 5,
    backgroundColor: "#dedee0",
    borderRadius: 10,
    alignSelf: "center",
    marginTop: 5,
    padding: 10,
    elevation: 4,
  },
  medicineNametext: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#00567D",
  },
  daystext: {
    marginTop: -20,
    marginLeft: 220,
  },
  detailContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    marginTop: 2,
    marginBottom: 2,
  },
  pilltext: {
    paddingRight: 30,
  },
  timestext: {
    paddingRight: 30,
  },
  descriptiontext: {
    paddingLeft: 10,
    padding: 5,
    backgroundColor: "white",
    color: "black",
    borderRadius: 10,
    elevation: 10,
    marginTop: 10,
  },
  listbottom: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
  },
  byContainer: {
    marginTop: 10,
  },
  bytext: {
    marginTop: 2,
    color: "gray",
    fontSize: 11,
  },
  editdeleteContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "right",
    alignSelf: "right",
    paddingLeft: 120,
    marginTop: 10,
  },
  edittext: {
    paddingLeft: 80,
    paddingRight: 5,
    padding: 5,
    color: "black",
    alignSelf: "center",
    alignContent: "center",
    borderRadius: 10,
  },
  disabledButton: {
    backgroundColor: "gray",
  },
  deletetext: {
    paddingLeft: 5,
    paddingRight: 10,
    padding: 5,
    color: "black",
    alignSelf: "center",
    alignContent: "center",
    borderRadius: 10,
    marginLeft: 10,
  },
});

export default MedicationView;
