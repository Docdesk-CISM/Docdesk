import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import DisplayTime from "../../components/StopwatchDisplay";
import BreathingTestDataStore from "./BreathingTestDataStore";

import api from "../../../../Services/AuthService";

import { useAuthContext } from "../../../../hooks/useAuthContext";
import { baseUrl } from "../../../../constants/constants";
import { LineChart } from "react-native-chart-kit";

const HoldButton = () => {
  const { user } = useAuthContext();

  const padtoTwo = (number) => (number <= 9 ? `0${number}` : number); //display two digits 0-9
  var date = new Date().getDate(); //To get the Current Date
  var month = new Date().getMonth() + 1; //To get the Current Month
  var year = new Date().getFullYear(); //To get the Current Year
  let sDate = `${padtoTwo(date)}/${padtoTwo(month)}/${year}`; //set date 29/04/2024 format
  const [isPressing, setIsPressing] = useState(false); //press the button or not, default not
  const [result, setResult] = useState([]); //store breathing test results
  const [time, setTime] = useState({ s: 0, m: 0, h: 0 });
  const [currentTime, setCurrentTime] = useState("");
  const intervalRef = useRef(null); //get interval reference in time
  const [pID, setPID] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTestData, setSelectedTestData] = useState([]);

  //integrate get result API
  const getResults = (id) => {
    api
      .get(`${baseUrl}/breathingTests/${id}`)
      .then((response) => {
        setResult(response.data || []);
        // console.log("Results", response.data);
      })
      .catch((error) => {
        console.log("Axios Error : ", error);
      });
  };

  //post result API integration
  const addResults = (data) => {
    console.log("PID", pID);
    const payload = {
      pID: pID,
      date: data.date,
      systime: data.systime,
      stopwatchTime: data.stopwatchTime,
    };

    api
      .post(`${baseUrl}/breathingTests`, payload)
      .then(() => {
        getResults(pID);
      })
      .catch((error) => {
        console.log("Axios Error : ", error);
      });
  };

  //delete all results API integration
  const deleteResults = () => {
    api
      .delete(`${baseUrl}/breathingTests/PatientData/${pID}`)
      .then(() => {
        getResults(pID);
      })
      .catch((error) => {
        console.log("Axios Error : ", error);
      });
  };

  const deleteOneResult = (id) => {
    console.log("Delete ID", id);
    api
      .delete(`${baseUrl}/breathingTests/SingleTest/${id}`)
      .then(() => {
        getResults(pID);
      })
      .catch((error) => {
        console.log("Axios Error : ", error);
      });
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    }, 1000); // Update every second

    return () => clearInterval(intervalId);
  }, []);

  //load when start
  useEffect(() => {
    console.log("User from Test", user);
    setPID(user._id);
    getResults(user._id);
  }, []);

  var updatedS = time.s,
    updatedM = time.m,
    updatedH = time.h;

  //when button press and hold
  const handlePressIn = () => {
    setIsPressing(true);
    intervalRef.current = setInterval(run, 1000);
    console.log("Button pressed and held!");
  };

  //when button release
  const handlePressOut = () => {
    if (isPressing) {
      setIsPressing(false);
      console.log("Button released after being pressed and held!");
      showDecisionBox();
      clearInterval(intervalRef.current);
    }
  };
  const sTime = `${padtoTwo(updatedH)}:${padtoTwo(updatedM)}:${padtoTwo(
    updatedS
  )}`; //set time 00:00:00 format

  //alert when release the button
  const showDecisionBox = () => {
    Alert.alert("Save Details", "Do you want to save your test result?", [
      {
        text: "Cancel",
        onPress: () => {
          resetTime();
        },
      },
      {
        text: "Save",
        onPress: () => {
          addResults({
            date: sDate,
            systime: currentTime,
            stopwatchTime: sTime,
          });
          resetTime();
        },
      },
    ]);
  };

  //confirmation to delete table
  const deleteTableAlert = () => {
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

  //stopwatch
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
    const day = date.substring(0, 2);
    const month = date.substring(3, 5);

    // Combine day and month components
    const formattedDate = `${month}/${day}`;

    return formattedDate;
  };

  // Function to map stopwatch time to scale
  const mapStopwatchTimeToScale = (stopwatchTime) => {
    const lastTwoDigits = parseInt(stopwatchTime.slice(-2));

    return lastTwoDigits; // Map it to a scale of 0 to 20
  };
  const yAxisLabels = selectedTestData.map((data) =>
    mapStopwatchTimeToScale(data.stopwatchTime)
  );

  return (
    <ScrollView>
      <View style={styles.container}>
        <DisplayTime time={time} />
        <Text style={styles.advice1}>
          {isPressing ? "" : "Take a Deep Breath"}
        </Text>
        <Text style={styles.advice2}>
          {isPressing ? "" : "Press the Button while holding the breath"}
        </Text>
        <TouchableWithoutFeedback
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <View style={[styles.button, isPressing && styles.buttonPressed]}>
            <Text style={styles.buttonText}>
              {isPressing ? "Release" : "Press and Hold"}
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.table}>
          <BreathingTestDataStore
            sampleData={result}
            deleteOne={deleteOneResult}
          />
        </View>
        <View style={styles.resetTable}>
          <TouchableOpacity
            onPress={deleteTableAlert}
            style={{ paddingBottom: 20 }}
          >
            <Text style={{ color: "#990000" }}>Reset Results</Text>
          </TouchableOpacity>
        </View>
        <View
          style={[styles.buttonGraph, isPressing && styles.ispressbuttonGraph]}
        >
          <TouchableOpacity onPress={() => testResultGraphModal(result)}>
            <Text style={styles.buttonTextGraph}>View</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Breathing Test Graph</Text>
            <LineChart
              data={{
                labels: selectedTestData
                  .map((data) => extractMonthAndDay(data.date))
                  .reverse(),
                datasets: [
                  {
                    data: selectedTestData
                      .map((data) =>
                        mapStopwatchTimeToScale(data.stopwatchTime)
                      )
                      .reverse(),
                  },
                ],
              }}
              width={350}
              height={270}
              yAxisLabel=""
              yAxisSuffix=""
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
                  stroke: "",
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
              <Text style={styles.overlayText}>Time (s)</Text>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom:100
  },

  button: {
    padding: 35,
    width: 220,
    height: 100,
    backgroundColor: "#D5FFCA",
    borderRadius: 5,
    borderRadius: 10,
  },
  buttonPressed: {
    marginTop: -60,
    backgroundColor: "#FFCACA",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },
  advice1: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#F23939",
  },
  advice2: {
    fontSize: 16,
    paddingTop: 5,
    paddingBottom: 10,
    color: "black",
  },
  table: {
    width: "100%",
  },
  resetTable: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
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
    top: 255,
    right: 50,
  },
  ispressbuttonGraph: {
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
    top: 200,
    right: 50,
  },
  buttonTextGraph: {
    fontSize: 18,

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
    top: 160,
    left: -5,
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
    top: 310,
    left: 150,
  },
});

export default HoldButton;
