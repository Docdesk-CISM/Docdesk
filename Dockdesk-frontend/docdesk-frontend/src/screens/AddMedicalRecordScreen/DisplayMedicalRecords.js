import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  SafeAreaView,
  FlatList,
  RefreshControl,
} from "react-native";
import Header from "../../components/Header";
import { baseUrl } from "../../constants/constants";
import api from "../../Services/AuthService";
import { useAuthContext } from "../../hooks/useAuthContext";

function DisplayMedicalRecords({ route, navigation }) {
  const { user } = useAuthContext();
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [PID, setPID] = useState(route.params?.PID);

  const fetchMedicalHistory = async () => {
    try {
      const response = await api.get(
        `${baseUrl}/medicalRecord/getRecordsPatient`,
        {
          params: {
            patientID: user.roles === "patient" ? user._id : PID,
          },
        }
      );
      // Sort records by recordDate in descending order
      const sortedRecords = response.data.patientRecords.medicalRecords.sort(
        (a, b) => new Date(b.recordDate) - new Date(a.recordDate)
      );
      setMedicalRecords(sortedRecords); // Update state with sorted records
    } catch (error) {
      console.log("Error fetching medical records:", error.response?.data);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    return `${year}/${month}/${day}`;
  };

  useEffect(() => {
    setPID(route.params?.PID ? route.params.PID : null);
    fetchMedicalHistory();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchMedicalHistory();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (route.params?.refresh) {
      fetchMedicalHistory();
    }
  }, [route.params?.refresh]);

  const handleRecordPress = (record) => {
    navigation.navigate("IncidentListScreen", { record });
  };

  const renderCategoryItem = ({ item }) => (
    <Pressable onPress={() => handleRecordPress(item)}>
      <View style={styles.recordItem}>
        <Text style={styles.recordName}>{item.recordName}</Text>
        <Text style={styles.recordDate}>{formatDate(item.recordDate)}</Text>
        <Text style={styles.recordDescription}>{item.description}</Text>
      </View>
    </Pressable>
  );

  const handleAddNew = () => {
    navigation.navigate("NewMedicalRecordScreen", {
      PID: user.roles === "patient" ? user._id : PID,
    });
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchMedicalHistory().then(() => {
      setRefreshing(false);
    });
  }, []);

  return (
    <SafeAreaView>
      <Header name="Records History" />
      <View style={styles.background}>
        <View style={styles.container}>
          <FlatList
            data={medicalRecords}
            keyExtractor={(item) => item._id}
            renderItem={renderCategoryItem}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
          <View style={styles.btn}>
            <Pressable onPress={handleAddNew}>
              <Text style={styles.btntext}>Add New Record</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default DisplayMedicalRecords;

const styles = StyleSheet.create({
  btn: {
    margin: "2%",
    backgroundColor: "#00567D",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    maxWidth: "100%",
    padding: 2,
  },
  btntext: {
    color: "#FFF",
    padding: 8,
    fontSize: 18,
    fontWeight: "bold",
  },
  container: {
    flexDirection: "column",
    width: "100%",
    height: "91%",
    backgroundColor: "#FFFF",
  },
  // background: {
  //   backgroundColor: "#DEFFFB",
  //   width: "100%",
  //   height: "100%",
  //   padding: 15,
  // },
  recordItem: {
    backgroundColor: "#f9f9f7",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "black",
    shadowOpacity: 0.25,
    textShadowRadius: 8,
  },
  recordName: {
    fontWeight: "900",
    fontSize: 18,
    color: "#00567D",
  },
  recordDescription: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: "600",
  },
  recordDate: {
    fontWeight: "800",
    textAlign: "right",
    marginTop: "-6%",
  },
});
