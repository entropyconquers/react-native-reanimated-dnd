import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

interface Option {
  label: string;
  value: any;
  key?: string;
}

interface BottomSheetOptionProps {
  options: Option[];
  selectedOption: any;
  onSelect: (option: Option) => void;
}

export function BottomSheetOption({
  options,
  selectedOption,
  onSelect,
}: BottomSheetOptionProps) {
  return (
    <View>
      {options.map((option, index) => {
        const isSelected =
          option.value === selectedOption || option.key === selectedOption;

        return (
          <TouchableOpacity
            key={option.key || option.value || index}
            style={[styles.option, isSelected && styles.selectedOption]}
            onPress={() => onSelect(option)}
          >
            <Text
              style={[
                styles.optionText,
                isSelected && styles.selectedOptionText,
              ]}
            >
              {option.label}
            </Text>
            {isSelected && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderWidth: 1,
    borderColor: "#2C2C2E",
    borderRadius: 8,
    backgroundColor: "#1C1C1E",
    marginBottom: 8,
  },
  selectedOption: {
    borderColor: "#FF3B30",
    backgroundColor: "rgba(255, 59, 48, 0.1)",
  },
  optionText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  selectedOptionText: {
    color: "#FF3B30",
  },
  checkmark: {
    fontSize: 16,
    color: "#FF3B30",
    fontWeight: "600",
  },
});
