import React, { useLayoutEffect, useRef, useState } from "react";
import { View, Text, Pressable, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";
import { SortableItem, ScrollDirection } from "react-native-reanimated-dnd";

type Mode = "fixed" | "dynamic";
const heights: Record<string, number> = { A: 80, B: 100, C: 70 };
function Trial({ mode }: { mode: Mode }) {
  const [ids, setIds] = useState(["A", "B"]);
  const [result, setResult] = useState("Not checked");
  const [events, setEvents] = useState("No drag");
  const positions = useSharedValue<Record<string, number>>({ A: 0, B: 1 });
  const itemHeights = useSharedValue<Record<string, number>>(heights);
  const lowerBound = useSharedValue(0);
  const direction = useSharedValue(ScrollDirection.None);
  const listRef = useRef<View>(null);
  const refs = useRef<Record<string, View | null>>({});
  // Publish C after it renders, but before its first UI-thread reaction.
  useLayoutEffect(() => {
    if (ids.includes("C") && positions.get().C === undefined) {
      positions.set({ ...positions.get(), C: 2 });
    }
  }, [ids, positions]);
  const check = async () => {
    const pos = positions.get();
    const measured = await Promise.all(
      ids.map(
        (id) =>
          new Promise<string>((resolve) => {
            const timeout = setTimeout(
              () => finish(`FAIL ${id} measurement timed out`),
              2000
            );
            const finish = (value: string) => {
              clearTimeout(timeout);
              resolve(value);
            };
            const expected = Object.keys(pos)
              .filter((other) => pos[other] < pos[id])
              .reduce(
                (sum, other) =>
                  sum + (mode === "dynamic" ? heights[other] : 60),
                0
              );
            const node = refs.current[id];
            if (!node || !listRef.current)
              return finish(`FAIL ${id} missing ref`);
            node.measureLayout(
              listRef.current,
              (_x, y) =>
                finish(
                  `${Math.abs(y - expected) < 1 ? "PASS" : "FAIL"} ${id}: y=${Math.round(y)} expected=${expected}`
                ),
              () => finish(`FAIL ${id} measurement`)
            );
          })
      )
    );
    const value = `${mode}: ${measured.join("; ")}`;
    console.log("POSITION_SYNC_MEASUREMENT", value);
    setResult(value);
  };
  return (
    <View>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            setResult("Not checked");
            setIds(["A", "B", "C"]);
          }}
          style={{ padding: 12, backgroundColor: "#ddd" }}
        >
          <Text>Add C</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            setResult("Not checked");
            positions.set(
              Object.fromEntries(
                ids.map((id, index) => [id, ids.length - index - 1])
              )
            );
          }}
          style={{ padding: 12, backgroundColor: "#ddd" }}
        >
          <Text>Reverse</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={check}
          style={{ padding: 12, backgroundColor: "#ddd" }}
        >
          <Text>Check</Text>
        </Pressable>
      </View>
      <Text testID="measurements" style={{ height: 85, marginTop: 12 }}>
        {result}
      </Text>
      <Text testID="drag-events" style={{ height: 40 }}>
        {events}
      </Text>
      <View
        ref={listRef}
        collapsable={false}
        style={{ height: 360, backgroundColor: "#eee" }}
      >
        {ids.map((id) => (
          <SortableItem
            key={id}
            id={id}
            data={{ id }}
            positions={positions}
            lowerBound={lowerBound}
            autoScrollDirection={direction}
            itemsCount={ids.length}
            itemHeight={mode === "fixed" ? 60 : undefined}
            isDynamicHeight={mode === "dynamic"}
            itemHeights={itemHeights}
            estimatedItemHeight={60}
            containerHeight={360}
            onDragStart={(dragged, position) =>
              setEvents(`start ${dragged}:${position}`)
            }
            onDrop={(dropped, position, all) =>
              setEvents(`drop ${dropped}:${position} ${JSON.stringify(all)}`)
            }
          >
            <View
              ref={(node) => {
                refs.current[id] = node;
              }}
              collapsable={false}
              accessible
              accessibilityLabel={`Row ${id}`}
              style={{
                height: mode === "dynamic" ? heights[id] : 60,
                backgroundColor:
                  id === "A" ? "#bfd7ff" : id === "B" ? "#fbd5bb" : "#b8edc7",
                borderWidth: 1,
                justifyContent: "center",
                paddingLeft: 20,
              }}
            >
              <Text>Row {id}</Text>
            </View>
          </SortableItem>
        ))}
      </View>
    </View>
  );
}
export default function App() {
  const [mode, setMode] = useState<Mode>("fixed");
  const [epoch, setEpoch] = useState(0);
  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
        backgroundColor: "white",
        paddingTop: 70,
        paddingHorizontal: 18,
      }}
    >
      <Text style={{ fontSize: 20, marginBottom: 12 }}>
        Position sync / {Platform.OS}
      </Text>
      <View style={{ flexDirection: "row", gap: 10, marginBottom: 12 }}>
        {(["fixed", "dynamic"] as const).map((value) => (
          <Pressable
            key={value}
            accessibilityRole="button"
            onPress={() => {
              setMode(value);
              setEpoch((n) => n + 1);
            }}
            style={{
              padding: 12,
              backgroundColor: mode === value ? "#c9d6ff" : "#ddd",
            }}
          >
            <Text>{value}</Text>
          </Pressable>
        ))}
        <Pressable
          accessibilityRole="button"
          onPress={() => setEpoch((n) => n + 1)}
          style={{ padding: 12, backgroundColor: "#ddd" }}
        >
          <Text>Reset</Text>
        </Pressable>
      </View>
      <Trial key={`${mode}-${epoch}`} mode={mode} />
    </GestureHandlerRootView>
  );
}
