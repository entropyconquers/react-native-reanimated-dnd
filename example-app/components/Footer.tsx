import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import { colors, fonts } from "../theme";

export function Footer() {
  const handlePress = () => {
    Linking.openURL("https://github.com/entropyconquers");
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>Made with </Text>
        <Text style={styles.heart}>❤️</Text>
        <Text style={styles.text}> by </Text>
        <TouchableOpacity onPress={handlePress} style={styles.linkContainer}>
          <Text style={styles.link}>Vishesh Raheja</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 13,
    fontFamily: fonts.bodyMedium,
    color: colors.textMuted,
  },
  heart: {
    fontSize: 13,
    color: colors.accent,
  },
  linkContainer: {},
  link: {
    fontSize: 13,
    fontFamily: fonts.bodySemiBold,
    color: colors.primary,
    textDecorationLine: "underline",
  },
});
