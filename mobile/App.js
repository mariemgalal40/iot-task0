import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Dimensions, Button } from "react-native";
import React, { useEffect, useState } from "react";
import {
  LineChart
} from "react-native-chart-kit";

import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAMTbL3sJGUBfZRMv7X-rFv21eWFhnqawo",
  authDomain: "esp-database-1248a.firebaseapp.com",
  databaseURL: "https://esp-database-1248a-default-rtdb.firebaseio.com",
  projectId: "esp-database-1248a",
  storageBucket: "esp-database-1248a.appspot.com",
  messagingSenderId: "935198394692",
  appId: "1:935198394692:web:d018156d9230d452a8af11",
};

initializeApp(firebaseConfig);

const config = {
  backgroundColor: "#e26a00",
  backgroundGradientFrom: "#fb8c00",
  backgroundGradientTo: "#ffa726",
  decimalPlaces: 2, // optional, defaults to 2dp
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: "6",
    strokeWidth: "2",
    stroke: "#ffa726",
  },
};
const tempData = {
  labels: ["1", "2", "3", "4", "5", "6"],
  datasets: [
    {
      data: [1, 2, 3, 4, 5, 6],
    },
  ],
};
const humData = {
  labels: ["1", "2", "3", "4", "5", "6"],
  datasets: [
    {
      data: [1, 2, 3, 4, 5, 6],
    },
  ],
};
var ledStatus = 0;
export default function App() {
  const [tempIndex, setTempIndex] = useState(["1"]);
  const [tempArray, setTempArray] = useState([1, 2, 3, 4, 5, 6]);
  const [humIndex, setHumIndex] = useState(["1"]);
  const [humArray, setHumArray] = useState([1, 2, 3, 4, 5, 6]);
  const [toggleData, setToggleData] = useState(true);

  
  useEffect(() => {
    const fun = () => {
      const db = getDatabase();
      const reference = ref(db, "READINDS/humidity/");
      onValue(reference, (snapshot) => {
        const hum = snapshot.val();
        setHumArray(Object.values(hum));
      });
    };

    fun();
  }, []);
  useEffect(() => {
    const fun = () => {
      const db = getDatabase();
      const reference = ref(db, "READINDS/temperature/");
      onValue(reference, (snapshot) => {
        const temp = snapshot.val();
        setTempArray(Object.values(temp));
      });
    };

    fun();
  }, []);
  if (tempArray.length > 10) {
    tempData.datasets[0].data = tempArray.slice(
      tempArray.length - 10,
      tempArray.length
    );
    tempData.labels = tempIndex.slice(
      tempIndex.length - 10,
      tempIndex.length
    );
  }
  else {
    tempData.datasets[0].data = tempArray;
    tempData.labels = tempIndex;
  }
  if (humArray.length > 10) {
    humData.datasets[0].data = humArray.slice(
      humArray.length - 10,
      humArray.length
    );
    humData.labels = humIndex.slice(
      humIndex.length - 10,
      humIndex.length
    );
  } else {
    humData.datasets[0].data = humArray;
    humData.labels = humIndex;
  }

  ledAlarm = () => {
    if (ledStatus == 0) 
    {
      const db = getDatabase();
      const reference = ref(db, "status");
      set(reference, {
        status: 1
  });
  ledStatus = 1;
    }
    else if (ledStatus == 1) 
    {
      const db = getDatabase();
      const reference = ref(db, "status");
      set(reference, {
        status: 0
  });
  ledStatus = 0
    }
  }
  const changeData = () => {
    setToggleData(!toggleData);
    console.log(toggleData)
  }
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {toggleData? <LineChart
        data={tempData}
        width={Dimensions.get("window").width} // from react-native
        height={220}
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={config}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      /> : <LineChart
      data={humData}
      width={Dimensions.get("window").width} // from react-native
      height={220}
      yAxisInterval={1} // optional, defaults to 1
      chartConfig={config}
      bezier
      style={{
        marginVertical: 8,
        borderRadius: 16,
      }}
    />}
      <Button onPress={ledAlarm} title="Led-Alarm" color="orange"></Button>
      <View style={{marginTop: 10}}><Button onPress={changeData} title="Toggle Data" color="orange"></Button></View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
