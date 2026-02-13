import React, { useState, useEffect } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons"; 

function Search({ patients, onSearch }) {
  const [input, setInput] = useState("");

  useEffect(() => {
    setInput(""); // reset when patients change
  }, [patients]);

  const handleSearch = () => {
    if (input.trim().length > 0) {
      const textParts = input.toUpperCase().split(" ");
      const newData = patients.filter((item) => {
        const itemData = `${item.firstName?.toUpperCase() ?? ""} ${
          item.lastName?.toUpperCase() ?? ""
        } ${item.nic?.toUpperCase() ?? ""} ${item.email?.toUpperCase() ?? ""}`;
        return textParts.every((part) => itemData.includes(part));
      });
      onSearch(newData, input); // ✅ send both filtered list & text
    } else {
      onSearch(patients, ""); // ✅ reset if input empty
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={input}
        onChangeText={setInput}
        placeholder="Search"
        placeholderTextColor="gray"
        style={styles.input}
      />
      <TouchableOpacity onPress={handleSearch} style={styles.iconWrapper}>
        <Ionicons name="search" size={20} color="gray" />
      </TouchableOpacity>
    </View>
  );
}

export default Search;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    height: 40,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
    backgroundColor: "white",
    paddingHorizontal: 10,
    marginTop: 20,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "black",
  },
  iconWrapper: {
    marginLeft: 8,
  },
});
