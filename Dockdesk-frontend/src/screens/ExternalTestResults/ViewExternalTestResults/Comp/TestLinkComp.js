import { Link } from "@react-navigation/native";
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  SafeAreaView,
  Linking,
} from "react-native";

function DocCard({ navigation, link, TestName }) {
  // console.log("Link: ", link.toString());
  const name = link.toString();

  function onPressHandler() {
    // navigation.navigate("GiveDocAccessScreen", { name, DocID, id });
  }

  return (
    <SafeAreaView>
      <View style={styles.background}>
        <View style={styles.card}>
          <Pressable onPress={onPressHandler}>
            <Text
              onPress={(name) => {
                try {
                  Linking.openURL(name);
                } catch (e) {
                  console.log(e);
                }
              }}
              style={styles.cardIn}
            >
              Test Name: {TestName}
              {"\n"}
              Link: {link}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
export default DocCard;

const styles = StyleSheet.create({
  background: {
    // backgroundColor:'#00567D'
  },

  card: {
    width: 350,
    borderRadius: 10,
    padding: 5,
    marginHorizontal: 15,
    textAlign: "center",
    marginBottom: 10,
    backgroundColor: "#D9F8FF",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.17,
    shadowRadius: 2.54,
    elevation: 3,
  },
  cardIn: {
    // backgroundColor: '#D9F8FF',
    borderRadius: 20,
    padding: 5,
    marginHorizontal: 15,
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "bold",
  },
});
