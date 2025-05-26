import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from "react-native";

interface ExampleHeaderProps {
  title: string;
  onBack: () => void;
}

export function ExampleHeader({ title, onBack }: ExampleHeaderProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Text style={styles.backIcon}>‹</Text>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
          </View>

          <View style={styles.spacer} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#000000",
  },
  headerContainer: {
    backgroundColor: "#000000",
    borderBottomWidth: 0.5,
    borderBottomColor: "#2C2C2E",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 8 : 6,
    paddingBottom: Platform.OS === "android" ? 8 : 6,
    minHeight: Platform.OS === "android" ? 56 : 44,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingRight: 16,
    flex: 1,
    minHeight: 44,
    justifyContent: "flex-start",
  },
  backIcon: {
    fontSize: 28,
    color: "#FF3B30",
    fontWeight: "300",
    marginRight: 4,
    lineHeight: Platform.OS === "android" ? 32 : 28,
    textAlignVertical: Platform.OS === "android" ? "center" : "auto",
  },
  backText: {
    fontSize: 17,
    color: "#FF3B30",
    fontWeight: "400",
    lineHeight: Platform.OS === "android" ? 24 : 20,
    textAlignVertical: Platform.OS === "android" ? "center" : "auto",
  },
  titleContainer: {
    alignItems: "center",
    flex: 2,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontFamily: "KumbhSans_700Bold",
    textAlign: "center",
    color: "#FFFFFF",
    lineHeight: Platform.OS === "android" ? 24 : 20,
  },
  redAccent: {
    width: 40,
    height: 3,
    backgroundColor: "#FF3B30",
    borderRadius: 1.5,
  },
  spacer: {
    flex: 1,
  },
});
