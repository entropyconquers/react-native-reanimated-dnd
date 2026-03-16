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
}

interface DragHandlesExampleProps {
  onBack: () => void;
}

export function DragHandlesExample({ onBack }: DragHandlesExampleProps) {
  const dropProviderRef = useRef<DropProviderRef>(null);
  const { showToast } = useToast();

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.container}>
        <ExampleHeader title="Drag Handles" onBack={onBack} />

        <DropProvider ref={dropProviderRef}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            scrollEventThrottle={16}
          >
            <Text style={styles.description}>
              Three handle types. Only highlighted areas initiate dragging.
            </Text>

            <View style={styles.dropZoneArea}>
              <Droppable<DraggableItemData>
                droppableId="handle-drop-zone"
                style={styles.dropZone}
                onDrop={(data) => {
                  showToast({
                    title: "Nice!",
                    subtitle: "Dropped on the target zone",
                    autodismiss: true,
                  });
                }}
              >
                <Text style={styles.dropZoneText}>Drop Target</Text>
                <Text style={styles.dropZoneSubText}>
                  Drag any card here
                </Text>
              </Droppable>
            </View>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerLabel}>HANDLE TYPES</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.cardsSection}>
              {/* Card 1: Full Handle */}
              <Draggable<DraggableItemData>
                key="handle-demo-item-1"
                draggableId="handle-demo-item-1"
                data={{
                  id: "handle-demo-item-1",
                  label: "Full Handle Item",
                  backgroundColor: "#2a9d8f",
                }}
                style={styles.cardOuter}
              >
                <Draggable.Handle>
                  <View style={styles.card1Inner}>
                    <View style={styles.card1Accent} />
                    <View>
                      <Text style={styles.cardLabel}>Full Handle</Text>
                      <Text style={styles.cardHint}>
                        Drag from anywhere on this card
                      </Text>
                    </View>
                  </View>
                </Draggable.Handle>
              </Draggable>

              {/* Card 2: Bar Handle */}
              <Draggable<DraggableItemData>
                key="handle-demo-item-2"
                draggableId="handle-demo-item-2"
                data={{
                  id: "handle-demo-item-2",
                  label: "Handle-Only Item",
                  backgroundColor: "#e9c46a",
                }}
                style={styles.card2Outer}
              >
                <View style={styles.card2Content}>
                  <Text style={styles.cardLabel}>Bar Handle</Text>
                  <Text style={styles.cardHint}>
                    Only the gold bar below initiates drag
                  </Text>
                </View>
                <Draggable.Handle>
                  <View style={styles.card2HandleBar}>
                    <Text style={styles.card2HandleText}>DRAG HERE</Text>
                  </View>
                </Draggable.Handle>
              </Draggable>

              {/* Card 3: Header Handle */}
              <Draggable<DraggableItemData>
                key="handle-demo-item-3"
                draggableId="handle-demo-item-3"
                data={{
                  id: "handle-demo-item-3",
                  label: "Card with Header Handle",
                  backgroundColor: "#606c38",
                }}
                style={styles.card3Outer}
              >
                <Draggable.Handle>
                  <View style={styles.card3Header}>
                    <Text style={styles.card3HeaderText}>Drag Card</Text>
                    <Text style={styles.card3HeaderIcon}>⬌</Text>
                  </View>
                </Draggable.Handle>
                <View style={styles.card3Body}>
                  <Text style={styles.card3BodyTitle}>Card Content</Text>
                  <Text style={styles.card3BodyText}>
                    This area is not draggable. Only the header can be used to
                    drag this card.
                  </Text>
                </View>
              </Draggable>
            </View>
          </ScrollView>
        </DropProvider>
      </View>
      <Footer />
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
  dropZoneArea: {
    marginBottom: 20,
  },
  dropZone: {
    height: 100,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "rgba(88, 166, 255, 0.3)",
    backgroundColor: "rgba(88, 166, 255, 0.05)",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  dropZoneText: {
    fontSize: 17,
    fontFamily: "Outfit_600SemiBold",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  dropZoneSubText: {
    fontSize: 13,
    fontFamily: "Outfit_400Regular",
    color: "#64748B",
    marginTop: 4,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
  },
  dividerLabel: {
    fontSize: 11,
    fontFamily: "Outfit_700Bold",
    color: "#475569",
    letterSpacing: 1.5,
    marginHorizontal: 12,
  },
  cardsSection: {
    flex: 1,
    gap: 12,
    justifyContent: "center",
  },

  /* Card 1 - Full Handle (teal) */
  cardOuter: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
  },
  card1Inner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#151823",
    borderWidth: 1.5,
    borderColor: "rgba(42, 157, 143, 0.35)",
    borderRadius: 12,
  },
  card1Accent: {
    width: 4,
    height: 32,
    borderRadius: 2,
    backgroundColor: "#2a9d8f",
    marginRight: 14,
  },
  cardLabel: {
    fontSize: 15,
    fontFamily: "Outfit_600SemiBold",
    color: "#F1F5F9",
    letterSpacing: 0.2,
  },
  cardHint: {
    fontSize: 13,
    fontFamily: "Outfit_400Regular",
    color: "#64748B",
    marginTop: 3,
  },

  /* Card 2 - Bar Handle (gold) */
  card2Outer: {
    width: "100%",
    backgroundColor: "#151823",
    borderWidth: 1.5,
    borderColor: "rgba(233, 196, 106, 0.35)",
    borderRadius: 12,
    overflow: "hidden",
  },
  card2Content: {
    padding: 16,
  },
  card2HandleBar: {
    backgroundColor: "rgba(233, 196, 106, 0.12)",
    paddingVertical: 10,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(233, 196, 106, 0.2)",
  },
  card2HandleText: {
    color: "#e9c46a",
    fontSize: 11,
    fontFamily: "Outfit_700Bold",
    letterSpacing: 1.5,
  },

  /* Card 3 - Header Handle (green) */
  card3Outer: {
    width: "100%",
    backgroundColor: "#151823",
    borderWidth: 1.5,
    borderColor: "rgba(96, 108, 56, 0.35)",
    borderRadius: 12,
    overflow: "hidden",
  },
  card3Header: {
    backgroundColor: "rgba(96, 108, 56, 0.2)",
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(96, 108, 56, 0.2)",
  },
  card3HeaderText: {
    fontSize: 15,
    fontFamily: "Outfit_600SemiBold",
    color: "#FFFFFF",
  },
  card3HeaderIcon: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  card3Body: {
    padding: 16,
  },
  card3BodyTitle: {
    fontSize: 14,
    fontFamily: "Outfit_600SemiBold",
    color: "#F1F5F9",
    marginBottom: 6,
  },
  card3BodyText: {
    fontSize: 13,
    fontFamily: "Outfit_400Regular",
    color: "#64748B",
    lineHeight: 18,
  },
});
