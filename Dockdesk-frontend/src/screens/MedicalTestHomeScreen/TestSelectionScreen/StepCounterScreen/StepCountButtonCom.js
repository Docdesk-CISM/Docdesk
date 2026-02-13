import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import DisplayTime from "../../components/StopwatchDisplay";
import StepCountDataStore from "./StepCountDataStore";
import { Pedometer } from "expo-sensors";
import { useAuthContext } from "../../../../hooks/useAuthContext";

// import axios from "axios";
import api from "../../../../Services/AuthService";
import CircularProgress from "react-native-circular-progress-indicator";
import { baseUrl } from "../../../../constants/constants";
import { LineChart } from "react-native-chart-kit";

const StepCountButton = () => {
  const { user } = useAuthContext();

  //run when loading the app
  useEffect(() => {
    console.log("User from Test", user);
    setPID(user._id);
    testpedoAvailable();
    getResults(user._id);
  }, []);

  const padtoTwo = (number) => (number <= 9 ? `0${number}` : number);
  var date = new Date().getDate();
  var month = new Date().getMonth() + 1;
  var year = new Date().getFullYear();
  let sDate = `${padtoTwo(date)}/${padtoTwo(month)}/${year}`;
  const [result, setResult] = useState([]);
  const [isStarted, setIsStarted] = useState(false);
  const [time, setTime] = useState({ s: 0, m: 0, h: 0 });
  const intervalRef = useRef(null);
  const [pedoAvailability, setpedoAvailability] = useState("");
  const [stepcount, setstepcount] = useState(0);
  const [pID, setPID] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTestData, setSelectedTestData] = useState([]);

  //get distance using step count
  var dist = stepcount / 1300;
  var distance = dist.toFixed(4); //round off for 4 decimal places
  var cal = distance * 60;
  var calories = cal.toFixed(4);
  var updatedS = time.s,
    updatedM = time.m,
    updatedH = time.h;

  const sTime = `${padtoTwo(updatedH)}:${padtoTwo(updatedM)}:${padtoTwo(
    updatedS
  )}`; //set time to 00:00:00 format

  //API integration for get results
  const getResults = (id) => {
    api
      .get(`${baseUrl}/stepCounterTests/${id}`)
      .then((response) => {
        setResult(response.data || []);
      })
      .catch((error) => {
        console.log("Axios Error : ", error);
      });
  };

  //API integration for post result
  const addResults = (data) => {
    const payload = {
      pID: pID,
      date: data.date,
      stopwatchTime: data.stopwatchTime,
      steps: data.steps,
      distance: data.distance,
      calories: data.calories,
    };
    api
      .post(`${baseUrl}/stepCounterTests`, payload)
      .then(() => {
        getResults(pID);
      })
      .catch((error) => {
        console.log("Axios Error : ", error);
      });
  };

  //API integration for delete all results related to Patient
  const deleteResults = () => {
    console.log("Delete Table");
    api
      .delete(`${baseUrl}/stepCounterTests/PatientData/${pID}`)
      .then(() => {
        getResults(pID);
      })
      .catch((error) => {
        console.log("Axios Error : ", error);
      });
  };

  //Delete single test result
  const deleteOneResult = (id) => {
    console.log(id);
    api
      .delete(`${baseUrl}/stepCounterTests/SingleTest/${id}`)
      .then(() => {
        getResults(pID);
      })
      .catch((error) => {
        console.log("Axios Error : ", error);
      });
  };

  const handleButtonClick = () => {
    if (isStarted) {
      clearInterval(intervalRef.current);
      addResults({
        date: sDate,
        stopwatchTime: sTime,
        steps: stepcount,
        distance: distance,
        calories: calories,
      });
      resetTime();
      setstepcount(0);
      console.log("Stoped");
    } else {
      subscribe();
      intervalRef.current = setInterval(run, 1000); //get miliseconds in seconds
      console.log("Started");
    }
    setIsStarted(!isStarted);
  };

  //stopwatch senario
  const run = () => {
    if (updatedS === 60) {
      updatedS = 0;
      updatedM++;
    }
    if (updatedM === 60) {
      updatedH++;
      updatedM = 0;
    }
    updatedS++;

    return setTime({ s: updatedS, m: updatedM, h: updatedH });
  };

  const resetTime = () => {
    setTime({ s: 0, m: 0, h: 0 });
  };

  //function to pedometer actions
  subscribe = () => {
    const subscription = Pedometer.watchStepCount((result) => {
      setstepcount(result.steps);
    });
  };
  testpedoAvailable = () => {
    Pedometer.isAvailableAsync().then(
      (result) => {
        setpedoAvailability(String(result));
      },
      (error) => {
        setpedoAvailability(error);
      }
    );
  };
  //alert to confirmation delete table
  const showDecisionBox = () => {
    Alert.alert("Delete Details", "Do you want to delete your test result?", [
      {
        text: "Cancel",
        onPress: () => {
          console.log("Cancel deletion");
        },
      },
      {
        text: "Delete",
        onPress: () => {
          deleteResults();
          console.log("Delete Table");
        },
      },
    ]);
  };

  const testResultGraphModal = (data) => {
    if (data.length === 0) {
      Alert.alert(
        "No test results to display",
        "Patient hasn't performed any tests to view the graph"
      );
      return;
    }
    // Sort the data based on date in ascending order
    const sortedData = data
      .slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    // Get the latest five entries
    const latestFiveData = sortedData.slice(0, 5);

    setSelectedTestData(latestFiveData);
    setModalVisible(true);
  };

  // Function to extract month and day from the date
  const extractMonthAndDay = (date) => {
    console.log("Date: ", date);
    const day = date.substring(0, 2);
    const month = date.substring(3, 5);

    // Combine day and month components
    const formattedDate = `${month}/${day}`;
    console.log("Formatted Date: ", formattedDate);

    return formattedDate;
  };
  // Function to map steps to scale
  const mapStepsToScale = (steps) => {
    const scaledValue = parseInt(steps); // Convert steps to integer
    return Math.floor(scaledValue / 500) * 500; // Map it to a scale of 0 to 6000 increasing by 500
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.pedotext}>
          Is Pedometer available on the device : {pedoAvailability}
        </Text>
        <DisplayTime time={time} />
        <View style={styles.testContainer}>
          <View>
            <CircularProgress
              value={stepcount}
              maxValue={6500}
              radius={70}
              activeStrokeColor={"#00567D"}
              inActiveStrokeColor={"#DEFFFB"}
              inActiveStrokeWidth={20}
              activeStrokeWidth={20}
              title={"Step Count"}
              titleStyle={{ fontWeight: "bold" }}
            />
          </View>
          <View style={styles.detailContainer}>
            <Text style={styles.testDetailTitle}>Target: 6500steps (5km)</Text>
            <View style={styles.disDetail}>
              <Text style={styles.testDetailTitles}>Distance</Text>
              <Text style={styles.testDetail}>{distance}</Text>
            </View>
            <View>
              <Text style={styles.testDetailTitles}>Calaries Burnt</Text>
              <Text style={styles.testDetail}>{calories}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.button, isStarted && styles.buttonClicked]}
          onPress={handleButtonClick}
        >
          <Text style={styles.buttonText}>{isStarted ? "Stop" : "Start"}</Text>
        </TouchableOpacity>
        <View style={styles.table}>
          <StepCountDataStore sampleData={result} deleteOne={deleteOneResult} />
        </View>
        <TouchableOpacity
          onPress={showDecisionBox}
          style={{ paddingBottom: 20 }}
        >
          <Text style={{ color: "#990000" }}>Reset Results</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonGraph}
          onPress={() => testResultGraphModal(result)}
        >
          <Text style={styles.buttonTextGraph}>View</Text>
        </TouchableOpacity>
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Step Counting Test Graph</Text>
              <LineChart
                data={{
                  labels: selectedTestData
                    .map((data) => extractMonthAndDay(data.date))
                    .reverse(),
                  datasets: [
                    {
                      data: selectedTestData
                        .map((data) => mapStepsToScale(data.steps))
                        .reverse(),
                    },
                  ],
                }}
                width={350}
                height={270}
                chartConfig={{
                  backgroundColor: "#ffffff",
                  backgroundGradientFrom: "#e0f7fa",
                  backgroundGradientTo: "#80deea",

                  yAxisLabelPosition: "topLeft",
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForVerticalLabels: {
                    fontWeight: "bold", // Set the font weight of vertical labels
                  },
                  propsForHorizontalLabels: {
                    fontWeight: "bold", // Set the font weight of horizontal labels
                  },
                  propsForBackgroundLines: {
                    stroke: "",
                  },
                  propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: "black",
                    fill: "black",
                  },
                }}
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
                withShadow={false}
                withInnerLines={false}
                withOuterLines={false}
              />
              <View style={styles.overlay}>
                <Text style={styles.overlayText}>Steps</Text>
              </View>
              <View style={styles.overlayDate}>
                <Text style={styles.overlayTextDate}>Month/Day</Text>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom:100
  },
  testContainer: {
    display: "flex",
    flexDirection: "row",
  },
  detailContainer: {
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    paddingLeft: 10,
  },
  disDetail: {
    paddingBottom: 15,
  },
  testDetailTitle: {
    fontSize: 15,
    color: "red",
    paddingBottom: 10,
  },
  testDetailTitles: {
    alignSelf: "center",
    fontWeight: "bold",
    fontSize: 16,
    color: "#00567D",
  },
  testDetail: {
    alignSelf: "center",
    fontSize: 15,
  },
  button: {
    padding: 35,
    width: 220,
    height: 100,
    backgroundColor: "#D5FFCA",
    borderRadius: 5,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonClicked: {
    backgroundColor: "#FFCACA",
  },
  buttonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },
  table: {
    width: "100%",
  },
  pedotext: {
    backgroundColor: "#FFCACA",
    padding: 3,
    marginTop: 2,
    fontWeight: "bold",
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
    backgroundColor: "#00567D",
    width: 80,
    height: 40,
    padding: 10,
    borderRadius: 20,
    marginTop: 20,
  },
  closeButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  overlay: {
    position: "absolute",
    top: 160, // Adjust as needed
    left: 10, // Adjust as needed
  },
  overlayText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
    transform: [{ rotate: "-90deg" }],
  },
  overlayTextDate: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
  },
  overlayDate: {
    position: "absolute",
    top: 310, // Adjust as needed
    left: 150, // Adjust as needed
  },
  buttonGraph: {
    backgroundColor: "#DEFFFB",
    height: 45,
    width: 120,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 20,
    borderWidth: 0.5,
    borderColor: "#00567D",
    position: "absolute",
    top: 375,
    right: 30,
  },
  buttonTextGraph: {
    fontSize: 18,

    fontWeight: "bold",
  },
});
export default StepCountButton;
