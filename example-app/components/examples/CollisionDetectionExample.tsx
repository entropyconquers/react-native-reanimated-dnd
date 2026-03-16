import React, { useRef } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DropProvider, DropProviderRef } from "react-native-reanimated-dnd";
import { Droppable } from "react-native-reanimated-dnd";
import { Draggable } from "react-native-reanimated-dnd";
import { ExampleHeader } from "@/components/ExampleHeader";
import { Footer } from "@/components/Footer";
import { useToast } from "@/components/toast";

interface DraggableItemData {
  id: string;
  label: string;
  backgroundColor: string;
  collisionText?: string;
}

interface CollisionDetectionExampleProps {
  onBack: () => void;
}

export function CollisionDetectionExample({
  onBack,
}: CollisionDetectionExampleProps) {
  const dropProviderRef = useRef<DropProviderRef>(null);
  const { showToast } = useToast();

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <ExampleHeader title="Collision Detection" onBack={onBack} />

        <DropProvider ref={dropProviderRef}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            scrollEventThrottle={16}
          >
            <Text style={styles.description}>
              Three collision modes. Drag each card over the zones.
            </Text>

            <View style={styles.zoneArea}>
              <Droppable<DraggableItemData>
                droppableId="narrow-zone"
                style={[styles.dropZone, styles.dropZoneBlue, { flex: 0.4 }]}
                onDrop={(data) =>
                  showToast({
                    title: "Hit!",
                    subtitle: `Landed on Narrow Zone using ${data.collisionText}`,
                    autodismiss: true,
                  })
                }
              >
                <Text style={styles.zoneLabel}>Narrow Zone</Text>
                <Text style={styles.zoneSublabel}>Center / Intersect</Text>
              </Droppable>

              <Droppable<DraggableItemData>
                droppableId="contain-zone"
                style={[styles.dropZone, styles.dropZoneGreen, { flex: 0.6 }]}
                onDrop={(data) =>
                  showToast({
                    title: "Hit!",
                    subtitle: `Landed on Contain Zone using ${data.collisionText}`,
                    autodismiss: true,
                  })
                }
              >
                <Text style={styles.zoneLabel}>Contain Zone</Text>
                <Text style={styles.zoneSublabel}>Contain Demo</Text>
              </Droppable>
            </View>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ALGORITHMS</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.cardsArea}>
              {/* Center collision */}
              <Draggable<DraggableItemData>
                key="D-Collision-Center"
                data={{
                  id: "D-Col-Center",
                  label: "Center Collision Draggable",
                  backgroundColor: "#ffca3a",
                  collisionText: "'center' collision",
                }}
                collisionAlgorithm="center"
                style={styles.cardOuter}
              >
                <View
                  style={[
                    styles.card,
                    { borderColor: "rgba(255, 202, 58, 0.35)" },
                  ]}
                >
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: "rgba(255, 202, 58, 0.15)" },
                    ]}
                  >
                    <Text style={[styles.badgeText, { color: "#ffca3a" }]}>
                      CENTER
                    </Text>
                  </View>
                  <View style={styles.cardTextArea}>
                    <Text style={styles.cardLabel}>Center</Text>
                    <Text style={styles.cardHint}>
                      Triggers at draggable center
                    </Text>
                  </View>
                </View>
              </Draggable>

              {/* Intersect collision (default) */}
              <Draggable<DraggableItemData>
                key="D-Collision-Intersect"
                data={{
                  id: "D-Col-Intersect",
                  label: "Intersect Collision Draggable (Default)",
                  backgroundColor: "#8ac926",
                  collisionText: "'intersect' collision (default)",
                }}
                style={styles.cardOuter}
              >
                <View
                  style={[
                    styles.card,
                    { borderColor: "rgba(138, 201, 38, 0.35)" },
                  ]}
                >
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: "rgba(138, 201, 38, 0.15)" },
                    ]}
                  >
                    <Text style={[styles.badgeText, { color: "#8ac926" }]}>
                      INTERSECT
                    </Text>
                  </View>
                  <View style={styles.cardTextArea}>
                    <Text style={styles.cardLabel}>Intersect</Text>
                    <Text style={styles.cardHint}>Any overlap triggers (default)</Text>
                  </View>
                </View>
              </Draggable>

              {/* Contain collision */}
              <Draggable<DraggableItemData>
                key="D-Collision-Contain"
                data={{
                  id: "D-Col-Contain",
                  label: "Contain Collision Draggable",
                  backgroundColor: "#1982c4",
                  collisionText: "'contain' collision",
                }}
                collisionAlgorithm="contain"
                style={styles.cardOuterSmall}
              >
                <View
                  style={[
                    styles.cardSmall,
                    { borderColor: "rgba(25, 130, 196, 0.35)" },
                  ]}
                >
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: "rgba(25, 130, 196, 0.15)" },
                    ]}
                  >
                    <Text style={[styles.badgeText, { color: "#1982c4" }]}>
                      CONTAIN
                    </Text>
                  </View>
                  <Text style={styles.cardLabel}>Contain</Text>
                  <Text style={styles.cardHintSmall}>Must fit inside zone</Text>
                </View>
              </Draggable>
            </View>

            <View style={styles.legend}>
              <View style={styles.legendRow}>
                <View
                  style={[styles.legendDot, { backgroundColor: "#ffca3a" }]}
                />
                <Text style={styles.legendText}>
                  CENTER: Triggers when draggable center is over the drop zone
                </Text>
              </View>
              <View style={styles.legendRow}>
                <View
                  style={[styles.legendDot, { backgroundColor: "#8ac926" }]}
                />
                <Text style={styles.legendText}>
                  INTERSECT: Triggers when any part overlaps (default)
                </Text>
              </View>
              <View style={styles.legendRow}>
                <View
                  style={[styles.legendDot, { backgroundColor: "#1982c4" }]}
                />
                <Text style={styles.legendText}>
                  CONTAIN: Triggers when entire draggable is inside drop zone
                </Text>
              </View>
            </View>
          </ScrollView>
        </DropProvider>
        <Footer />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#08090E",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  description: {
    fontSize: 14,
    fontFamily: "Outfit_400Regular",
    color: "#94A3B8",
    lineHeight: 20,
    marginBottom: 16,
  },
  zoneArea: {
    flex: 1,
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
    minHeight: 140,
  },
  dropZone: {
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  dropZoneBlue: {
    borderColor: "#58a6ff",
    backgroundColor: "rgba(88, 166, 255, 0.08)",
  },
  dropZoneGreen: {
    borderColor: "#3fb950",
    backgroundColor: "rgba(63, 185, 80, 0.08)",
  },
  zoneLabel: {
    fontSize: 15,
    fontFamily: "Outfit_600SemiBold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  zoneSublabel: {
    fontSize: 12,
    fontFamily: "Outfit_400Regular",
    color: "#475569",
    marginTop: 2,
    textAlign: "center",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#1E2028",
  },
  dividerText: {
    fontSize: 11,
    fontFamily: "Outfit_600SemiBold",
    color: "#475569",
    letterSpacing: 1.5,
    marginHorizontal: 12,
  },
  cardsArea: {
    gap: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  cardOuter: {
    width: "100%",
  },
  cardOuterSmall: {
    width: 160,
    alignSelf: "center",
  },
  cardSmall: {
    alignItems: "center",
    backgroundColor: "#151823",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    gap: 6,
  },
  cardHintSmall: {
    fontSize: 11,
    fontFamily: "Outfit_400Regular",
    color: "#475569",
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#151823",
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 14,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 12,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: "Outfit_700Bold",
    letterSpacing: 0.5,
  },
  cardTextArea: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 15,
    fontFamily: "Outfit_600SemiBold",
    color: "#F1F5F9",
  },
  cardHint: {
    fontSize: 13,
    fontFamily: "Outfit_400Regular",
    color: "#475569",
    marginTop: 2,
  },
  legend: {
    marginBottom: 8,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  legendText: {
    fontSize: 12,
    fontFamily: "Outfit_400Regular",
    color: "#64748B",
    flex: 1,
    lineHeight: 16,
  },
});
