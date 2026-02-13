import { View, StyleSheet, SafeAreaView } from "react-native";
import Header from "../../components/Header";
import IncidentTypeDropdown from "./components/IncidentTypeDropdown";
import React, { useState } from "react";

const MedicalIncidentHomeScreen = ({ route }) => {
  const { recordID, recordName, recordDescription } = route.params;

  console.log(recordID)
  return (
    <SafeAreaView>
      <Header name="New Medical Incident" />
      <View style={styles.background}>
        <View style={styles.container}>
          <IncidentTypeDropdown
            recordName={recordName}
            description={recordDescription}
            recordID={recordID}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
export default MedicalIncidentHomeScreen;

const styles = StyleSheet.create({
  text2: {
    marginLeft: 80,
    marginTop: 50,
    fontSize: 20,
    color: "#1e1e1e",
  },

  SafeAreaView: {
    flex: 1,
    backgroundColor: "white"
  },
  container: {
    flexDirection: "column",
    width: "100%",
    height: "100%",
    backgroundColor: '#FFFF',
  },

  // background: {
  //   backgroundColor: "#DEFFFB",
  //   width: "100%",
  //   height: "100%",
  //   padding: 15,
  // },

  input2: {
    borderColor: "#8e8e8e",
    borderWidth: 1,
    padding: 10,
    width: "88%",
    height: 94,
    margin: 20,
    marginTop: 10,
    borderRadius: 10,
    textAlignVertical: "top",
    fontSize: 16,
  },

  text1: {
    marginLeft: 28,

    fontSize: 20,
    color: "#1e1e1e",
  },
});
