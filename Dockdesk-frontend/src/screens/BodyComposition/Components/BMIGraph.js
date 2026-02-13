import React, { useState, useEffect, useMemo } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { baseUrl } from "../../../constants/constants";
import api from "../../../Services/AuthService";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { LineChart } from "react-native-chart-kit";
import BMIScale from "./BMIScale";

function BMIGraph() {
  const { user } = useAuthContext();
  const [details, setDetails] = useState([]);
  const [height, setHeight] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user._id) {
      getWeights(user._id);
    }
  }, [user]);

  const getWeights = (userId) => {
    api
      .get(`${baseUrl}/patients/${userId}`)
      .then((response) => {
        const weights = response.data.pastWeights || [];
        setDetails(weights);
        setHeight(response.data.height);
        setLoading(false);
        console.log("Weight Details: ", weights);
        console.log("Height: ", response.data.height);
      })
      .catch((error) => {
        console.log("Axios Error: ", error);
        setLoading(false);
      });
  };

  // Ensure details is always an array
  const safeDetails = Array.isArray(details) ? details : [];
  // Get the latest five entries and reverse them to show the most recent on the right side
  const latestFiveDetails = safeDetails
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
    .reverse();

  const weights = latestFiveDetails.map((entry) => entry.weight);

  const bmiValues = useMemo(() => {
    console.log("Height: ", height);
    if (!height) return [];

    const heightInMeters = height / 100;

    return latestFiveDetails.map((entry) => {
      const bmi = entry.weight / (heightInMeters * heightInMeters);
      const roundedBMI = Math.round(bmi * 100) / 100;
      return roundedBMI;
    });
  }, [latestFiveDetails, height]);
  console.log("BMI Values: ", bmiValues);

  const averageBMI = useMemo(() => {
    if (bmiValues.length === 0) return 0;

    const totalBMI = bmiValues.reduce((acc, bmi) => acc + bmi, 0);
    const average = totalBMI / bmiValues.length;

    // Use Math.round to round to 2 decimal places
    const averageBMIRounded = Math.round(average * 100) / 100;

    return averageBMIRounded.toString();
  }, [bmiValues]);
  console.log("Average BMI: ", averageBMI);

  const minBMI = useMemo(() => {
    if (bmiValues.length === 0) return null;

    // Calculate minimum BMI
    const min = Math.min(...bmiValues);

    // Use Math.round to round to 2 decimal places
    const minBMIRounded = Math.round(min * 100) / 100;

    return minBMIRounded.toString();
  }, [bmiValues]);

  const maxBMI = useMemo(() => {
    if (bmiValues.length === 0) return null;

    // Calculate maximum BMI
    const max = Math.max(...bmiValues);

    // Use Math.round to round to 2 decimal places
    const maxBMIRounded = Math.round(max * 100) / 100;

    return maxBMIRounded.toString();
  }, [bmiValues]);

  // Extract dates for the graph
  const dates = latestFiveDetails.map((entry) =>
    new Date(entry.date).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
    })
  );
  const datesNew = latestFiveDetails.map(
    (entry) =>
      new Date(entry.date)
        .toLocaleDateString("en-GB", {
          month: "short",
          day: "2-digit",
        })
        .replace(/\s/g, " ") //replace day and month
  );
  // Extract the first and last dates for the date range display
  const firstDate = datesNew.length > 0 ? datesNew[0] : null;
  const lastDate = datesNew.length > 0 ? datesNew[datesNew.length - 1] : null;
  if (weights.length !== 1) {
    return (
      <View style={styles.container}>
        {details.length === 0 && height === 0 && <Text>No data</Text>}
        <View style={styles.dateContainer}>
          {firstDate && lastDate && (
            <Text style={styles.dateRange}>
              {firstDate} – {lastDate} ({details.length} records)
            </Text>
          )}
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statsSubContainer}>
            {averageBMI ? (
              <>
                <Text style={styles.statsText}>Avg</Text>
                <Text style={styles.statsNumAvg}>{averageBMI}</Text>
              </>
            ) : (
              ""
            )}
          </View>
          <View style={styles.statsSubContainer}>
            {minBMI && maxBMI ? (
              <>
                <Text style={styles.statsText}>Min</Text>
                <Text style={styles.statsNumMIn}>{minBMI}</Text>
                <Text style={styles.statsText}>Max</Text>
                <Text style={styles.statsNumMax}>{maxBMI}</Text>
              </>
            ) : (
              ""
            )}
          </View>
        </View>

        {loading ? (
          <Text>Loading...</Text>
        ) : details.length > 0 ? (
          <LineChart
            data={{
              labels: dates,

              datasets: [
                {
                  data: bmiValues,
                },
              ],
            }}
            width={Dimensions.get("window").width - 16}
            height={440}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#FEFFE0",
              backgroundGradientTo: "#FEFFE0",

              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,

              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForBackgroundLines: {
                stroke: "",
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "",
              },
              propsForVerticalLabels: {
                fontWeight: "bold",
                fontSize: 14,
              },
              propsForHorizontalLabels: {
                fontWeight: "bold",
                fontSize: 14,
              },

              yAxisMinimum: Math.min(...bmiValues) - 5,
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
            withShadow={false}
            withInnerLines={false}
            withOuterLines={false}
          />
        ) : (
          <Text>No BMI data available</Text>
        )}

        <BMIScale bmi={bmiValues[bmiValues.length - 1]} />
      </View>
    );
  } else {
    return (
      <>
        <View style={styles.scale}>
          <BMIScale bmi={bmiValues[bmiValues.length - 1]} />
        </View>
      </>
    );
  }
}

export default BMIGraph;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    marginTop: 20,
  },
  dateContainer: {
    alignSelf: "flex-start",
    marginLeft: 30,
  },
  dateRange: {
    color: "black",
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  statsContainer: {
    marginBottom: 20,
    alignSelf: "flex-start",
    marginLeft: 30,
    flexDirection: "row",
    marginTop: 0,
  },
  statsSubContainer: {
    flexDirection: "row",
    marginRight: 20,
    alignItems: "baseline",
  },
  statsText: {
    fontSize: 16,
    color: "black",
    marginRight: 5,
  },
  statsNumAvg: {
    fontSize: 24,
    color: "green",
  },
  statsNumMIn: {
    fontSize: 24,
    color: "gold",
    marginRight: 10,
  },
  statsNumMax: {
    fontSize: 24,
    color: "red",
    marginRight: 10,
  },

  overlay: {
    position: "absolute",
    top: 120,
    left: 6,
  },
  overlayText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    transform: [{ rotate: "-90deg" }],
  },
  overlayTextDate: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
  overlayDate: {
    position: "absolute",
    top: 228,
    left: 150,
    paddingBottom: 10,
  },
  scale: {
    alignItems: "center",
  },
});
