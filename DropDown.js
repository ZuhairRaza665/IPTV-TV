import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

export let optionSelected = 1;

const CustomDropdown = ({ options, onOptionSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    onOptionSelect(option?.value); // Call the callback with the selected option value
    setIsOpen(false);
  };

  const length = Object.keys(options).length;
  // console.log("length from inside: ", length);

  let dropdownOptions = options;
  if (selectedOption?.value === options[0]?.value) {
    dropdownOptions = options?.slice(1);
  }

  return (
    <View style={styles.container}>
      <View style={styles.dropdownButton} onTouchStart={toggleDropdown}>
        <Text style={styles.dropdownButtonText}>
          {selectedOption ? selectedOption.label : "Season 1"}
        </Text>
        <Icon
          name={"angle-down"} // Adjust icon names
          size={18}
          color="white"
          onPress={toggleDropdown}
        />
      </View>

      <Modal
        animationType="slide" // You can adjust the animation type
        transparent={true}
        visible={isOpen}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View
              style={{
                borderBottomWidth: 3, // Add this line to specify the border width
                borderBottomColor: "white",
                paddingBottom: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 40,
                  color: "white",
                  alignSelf: "center",
                }}
              >
                Seasons
              </Text>
            </View>
            <ScrollView style={styles.optionsContainer}>
              <FlatList
                data={options}
                keyExtractor={(item, index) => index.toString()}
                numColumns={2} // Set the number of columns to 2
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    style={[
                      styles.btn,
                      index % 2 === 1 && { left: 30 }, // Apply left margin to odd indices (second column)
                    ]}
                    onPress={() => handleOptionSelect(item)}
                  >
                    <Text>Season {index + 1}</Text>
                  </TouchableOpacity>
                )}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "center", // Center horizontally
    width: 200, // Adjusted width
    top: 20,
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#212020",
    borderRadius: 5,
    backgroundColor: "#212020",
    width: "100%", // Full width of container
    height: "auto",
  },
  dropdownButtonText: {
    fontSize: 16,
    color: "white",
  },
  dropdownOptions: {
    position: "absolute",
    top: 42, // Positioned below button
    left: 0,
    width: "100%", // Full width of container
    backgroundColor: "#212020",
    borderWidth: 1,
    borderColor: "#212020",
    borderRadius: 5,
    elevation: 5,
  },
  optionItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#0B0B0B",
  },
  optionText: {
    fontSize: 16,
    color: "white",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    width: "90%",
    height: "40%",
    backgroundColor: "#212020",
    padding: 20,
    borderRadius: 10,
  },
  btn: {
    width: 100,
    height: 50,
    backgroundColor: "white",
    margin: 15,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CustomDropdown;
