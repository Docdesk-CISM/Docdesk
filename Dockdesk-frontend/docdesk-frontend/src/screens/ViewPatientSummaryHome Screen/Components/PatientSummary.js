import {
  Pressable,
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
} from "react-native";

function calculateAge(birthday) {
  const birthDate = new Date(birthday);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

function PatientSummary({
  id,
  firstName,
  lastName,
  blood,
  email,
  weight,
  height,
  gender,
  nic,
  profileImage,
  birthday,
}) {
  const defaultProfileImage = require("../../../../assets/personProfile.png");

  const imageSource =
    profileImage && profileImage.startsWith("http")
      ? { uri: profileImage }
      : defaultProfileImage;

  const age = calculateAge(birthday);
  console.log("Age:", age);
  return (
    <View style={styles.innerContainer}>
      <View style={styles.first}>
        <View style={styles.tid}>
          <Text style={styles.title}>
            {firstName} {lastName}
          </Text>
          <Image source={imageSource} style={styles.image} />
        </View>

        <View style={styles.mainlineOne}>
          <View style={styles.category}>
            <View>
              <Text style={styles.textYrs}> Age</Text>
              <Text style={styles.gender}>{age} yrs</Text>
            </View>
            <View>
              <Text style={styles.textGen}> Gender</Text>
              <Text style={styles.gender}>{gender}</Text>
            </View>
          </View>
        </View>
        <View style={styles.mainlineTwo}>
          <View style={styles.categaryDown}>
            <Text style={styles.TextLineDownweight}>Weight</Text>
            <Text style={styles.weight}>{weight} kg</Text>
          </View>
          <View style={styles.categaryDown}>
            <Text style={styles.TextLineDownheight}>Height</Text>
            <Text style={styles.Height}>{height} cm</Text>
          </View>
          <View style={styles.categaryDown}>
            <Text style={styles.TextLineDownblood}>Blood Group</Text>
            <Text style={styles.blood}>{blood}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
export default PatientSummary;
const styles = StyleSheet.create({
  innerContainer: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 15,
  },
  first: {
    justifyContent: "center",
    alignItems: "center",
  },
  tid: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: -20,

    width: 50,
    height: 50,
  },

  content: {
    flexDirection: "row",
  },
  nic: {
    fontSize: 20,
    marginLeft: 10,
    color: "#00567D",
    fontWeight: "bold",
  },
  gender: {
    fontSize: 20,
    marginLeft: 60,
    color: "#00567D",
    fontWeight: "bold",
  },

  id: {
    fontSize: 15,
    marginTop: 10,
    marginLeft: 150,
  },
  id2: {
    fontSize: 20,
    marginLeft: 70,
    color: "#00567D",
    fontWeight: "bold",
  },

  categaryDown: {
    flexDirection: "column",
  },
  text1: {
    fontSize: 15,
    marginLeft: 60,
  },
  egory: {
    flexDirection: "column",
  },
  mainlineOne: {
    flexDirection: "row",
    marginTop: 20,
    marginRight: "10%",
  },

  weight: {
    fontSize: 20,
    color: "#00567D",
    fontWeight: "bold",
    marginLeft: 120,
  },
  Height: {
    fontSize: 20,
    color: "#00567D",
    fontWeight: "bold",
    marginLeft: 50,
  },
  blood: {
    fontSize: 20,
    color: "#00567D",
    fontWeight: "bold",
    marginLeft: 70,
  },

  textGen: {
    fontSize: 15,
    marginLeft: 55,
  },
  textYrs: {
    fontSize: 15,
    marginLeft: 65,
  },
  text2: {
    fontSize: 15,
    marginLeft: 55,
  },
  text3: {
    fontSize: 15,
  },

  mainlineTwo: {
    flexDirection: "row",
    marginTop: 20,
    marginRight: "22%",
  },
  cat4: {
    flexDirection: "column",
    marginLeft: 30,
  },
  cat5: {
    flexDirection: "column",
  },

  text4: {
    fontSize: 15,
    marginLeft: 40,
  },

  text5: {
    fontSize: 15,
    marginLeft: 60,
  },
  TextLineDownweight: {
    fontSize: 15,
    marginLeft: 120,
  },
  TextLineDownheight: {
    fontSize: 15,
    marginLeft: 60,
  },
  TextLineDownblood: {
    fontSize: 15,
    marginLeft: 40,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
  category: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
