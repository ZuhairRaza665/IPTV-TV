import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { getDatabase, ref, onValue } from "firebase/database";
import app from "../firebase";

const SettingsScreen = () => {
  const [firebaseData, setFirebaseData] = useState([]);

  // useEffect(() => {
  //   const db = getDatabase(app);
  //   const dbRef = ref(db, "isLiked");
  //   onValue(dbRef, (snapshot) => {
  //     const data = snapshot.val();
  //     const dataArray = Object.values(data);
  //     setFirebaseData(dataArray);
  //   });
  // }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Setting</Text>
      <Text style={styles.text}>{JSON.stringify(firebaseData[3])}</Text>
      <FlatList
        data={firebaseData}
        renderItem={({ item }) => (
          <View>
            <Text style={styles.text}>{item.name}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: "20%",
    backgroundColor: "#0B0B0B",
  },
  text: {
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
  },
});

export default SettingsScreen;
