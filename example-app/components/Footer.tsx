import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import { BlurView } from "expo-blur";

interface FooterProps {
  blur?: boolean;
}

export function Footer({ blur = false }: FooterProps) {
  const handlePress = () => {
    Linking.openURL("https://github.com/entropyconquers");
  };

  const Container = blur ? BlurView : View;
  const containerProps = blur
    ? { intensity: 80, tint: "dark" as const }
    : {};

  return (
    <Container style={styles.container} {...containerProps}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>Made with </Text>
        <Text style={styles.heart}>❤️</Text>
        <Text style={styles.text}> by </Text>
        <TouchableOpacity onPress={handlePress} style={styles.linkContainer}>
          <Text style={styles.link}>Vishesh Raheja</Text>
        </TouchableOpacity>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 0.5,
    borderTopColor: "#2C2C2E",
    overflow: "hidden",
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 14,
    fontFamily: "KumbhSans_700Bold",
    color: "#8E8E93",
  },
  heart: {
    fontSize: 14,
    color: "#FF3B30",
  },
  linkContainer: {},
  link: {
    fontSize: 14,
    fontFamily: "KumbhSans_500Medium",
    color: "#FF3B30",
    textDecorationLine: "underline",
  },
});
