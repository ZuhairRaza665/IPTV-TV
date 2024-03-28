import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";

const TransparentDropdown = ({ options }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  const toggleDropdown = () => {
    setIsVisible(!isVisible);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    toggleDropdown();
  };

  return (
    <View>
      <TouchableOpacity onPress={toggleDropdown}>
        <Text>{selectedOption || "Select an option"}</Text>
      </TouchableOpacity>
      <Modal
        visible={isVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={toggleDropdown}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View style={{ backgroundColor: "white", padding: 16 }}>
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => handleOptionSelect(option)}
                style={{ paddingVertical: 8 }}
              >
                <Text>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TransparentDropdown;
