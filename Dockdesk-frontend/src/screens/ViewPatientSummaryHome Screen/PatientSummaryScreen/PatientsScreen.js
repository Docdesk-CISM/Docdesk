import { useState, useEffect } from "react";
import { FlatList, View, Text } from "react-native";
import PatientGridTile from "../Components/PatientGridTile";
import CustomHeader from "../Components/CustomHeader";
import api from "../../../Services/AuthService";
import { baseUrl } from "../../../constants/constants";
import { useAuthContext } from "../../../hooks/useAuthContext";

function PatientsScreen({ navigation }) {
  const { user } = useAuthContext();
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await api.get(
        `${baseUrl}/doctors/getPatientsWithAccess/${user._id}`
      );
      setPatients(response.data);
      console.log("Response from backend:", response.data);
    } catch (error) {
      console.log("Error fetching patients:", error);
    }
  };

  const handleSearch = (filteredData, text) => {
    setSearchText(text);
    setFilteredPatients(filteredData);
  };

  const renderCategoryItem = ({ item }) => {
    const presshandler = () => {
      console.log("Selected Patient:", item._id);
      navigation.navigate("PatientProfileScreen", { PID: item._id });
    };

    return (
      <View>
        <PatientGridTile
          id={item.patientId}
          firstName={item.firstName}
          lastName={item.lastName}
          nic={item.nic}
          email={item.email}
          profileImage={item.profileImage}
          onPress={presshandler}
        />
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <CustomHeader patients={patients} onSearch={handleSearch} />

      <FlatList
        data={searchText ? filteredPatients : patients}
        keyExtractor={(item) => item._id}
        renderItem={renderCategoryItem}
        style={{ flex: 1 }}
        ListEmptyComponent={
          <View style={{ padding: 20 }}>
            <Text>No patients found</Text>
          </View>
        }
      />
    </View>
  );
}

export default PatientsScreen;
