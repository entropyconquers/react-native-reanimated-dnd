import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fonts } from "../theme";
import { useToast } from "./toast";

interface ExampleHeaderProps {
  title: string;
  onBack: () => void;
}

export function ExampleHeader({ title, onBack }: ExampleHeaderProps) {
  const { dismissAll } = useToast();

  const handleBack = () => {
    dismissAll();
    onBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            testID="header-back-button"
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <Text style={styles.backIcon}>‹</Text>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <Text testID="header-title-text" style={styles.title} numberOfLines={1}>
              {title}
            </Text>
          </View>

          <View style={styles.spacer} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.bg,
  },
  headerContainer: {
    backgroundColor: colors.bg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
    color: colors.primary,
    fontWeight: "300",
    marginRight: 4,
    lineHeight: Platform.OS === "android" ? 32 : 28,
    textAlignVertical: Platform.OS === "android" ? "center" : "auto",
  },
  backText: {
    fontSize: 17,
    fontFamily: fonts.bodyMedium,
    color: colors.primary,
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
    fontFamily: fonts.displayBold,
    textAlign: "center",
    color: colors.textPrimary,
    lineHeight: Platform.OS === "android" ? 24 : 20,
    letterSpacing: -0.3,
  },
  spacer: {
    flex: 1,
  },
});
