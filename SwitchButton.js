import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const SwitchButton = ({ setSelectedIndex }) => {
  const buttonOptions = [
    { label: "Movies", index: 0 },
    { label: "Shows", index: 1 },
  ];

  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {buttonOptions.map(({ label, index }) => (
          <TouchableOpacity
            key={index}
            style={{
              flex: 1,
              height: 30,
              borderRadius: 15,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: selectedTab === index ? "#212020" : "#0B0B0B",
            }}
            onPress={() => {
              setSelectedTab(index);
              setSelectedIndex(index);
            }}
          >
            <Text style={selectedTab === index ? styles.text : styles.text2}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // position: "absolute",
    // top: 40,
    // justifyContent: "center",
    // alignItems: "center",
    paddingTop: 20,
  },
  innerContainer: {
    width: "90%",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  text: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
  },
  text2: {
    color: "white",
    fontSize: 15,
  },
});

export default SwitchButton;
