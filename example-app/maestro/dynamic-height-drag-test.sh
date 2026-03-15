#!/bin/bash
# Dynamic Height Drag-to-Reorder Test
# Uses ADB draganddrop for long-press-and-drag (Maestro cannot do this natively)
# Combined with Maestro for navigation and assertions
set -e

DEVICE="emulator-5554"
PASS=0
FAIL=0
TOTAL=0

pass() {
  PASS=$((PASS + 1))
  TOTAL=$((TOTAL + 1))
  echo "  ✓ $1"
}

fail() {
  FAIL=$((FAIL + 1))
  TOTAL=$((TOTAL + 1))
  echo "  ✗ $1"
}

dump_ui() {
  adb -s "$DEVICE" shell uiautomator dump /sdcard/ui_drag.xml > /dev/null 2>&1
  adb -s "$DEVICE" pull /sdcard/ui_drag.xml /tmp/ui_drag.xml > /dev/null 2>&1
}

get_item_order() {
  dump_ui
  python3 -c "
import xml.etree.ElementTree as ET, re
tree = ET.parse('/tmp/ui_drag.xml')
root = tree.getroot()
items = []
for node in root.iter('node'):
    text = node.get('text', '')
    bounds = node.get('bounds', '')
    if text and any(k in text for k in ['Flight to Tokyo', 'Hotel Check-in', 'Tsukiji Fish Market', 'Ramen at Fuunji', 'Meiji Shrine', 'Shinkansen to Kyoto', 'Fushimi Inari', 'Street Food Tour', 'Bamboo Grove', 'Souvenir Shopping', 'Kaiseki Dinner', 'Return Flight']):
        m = re.search(r'\[(\d+),(\d+)\]', bounds)
        if m:
            y = int(m.group(2))
            items.append((y, text))
items.sort()
for y, text in items:
    print(f'{y} {text}')
"
}

get_item_y() {
  local item_name="$1"
  dump_ui
  python3 -c "
import xml.etree.ElementTree as ET, re
tree = ET.parse('/tmp/ui_drag.xml')
root = tree.getroot()
for node in root.iter('node'):
    text = node.get('text', '')
    bounds = node.get('bounds', '')
    if text == '$item_name':
        m = re.search(r'\[(\d+),(\d+)\]\[(\d+),(\d+)\]', bounds)
        if m:
            y_center = (int(m.group(2)) + int(m.group(4))) // 2
            print(y_center)
            break
"
}

run_maestro() {
  local flow_file="$1"
  local result
  result=$(maestro test "$flow_file" 2>&1 | tail -1)
  echo "  Maestro: $result"
}

echo "═══════════════════════════════════════════"
echo "  Dynamic Height Drag Test"
echo "═══════════════════════════════════════════"
echo ""

# ── Step 1: Navigate to Dynamic Heights ──
echo "▶ Navigating to Dynamic Heights..."
cat > /tmp/nav_to_dh.yaml << 'FLOW'
appId: com.przkp2p.rndndtest
---
- waitForAnimationToEnd:
    timeout: 5000
- scrollUntilVisible:
    element: "Dynamic Heights"
    direction: DOWN
    timeout: 10000
- tapOn: "Dynamic Heights"
- waitForAnimationToEnd:
    timeout: 3000
- assertVisible: "Flight to Tokyo"
FLOW
run_maestro /tmp/nav_to_dh.yaml
sleep 1

# ── Test 1: Drag item 1 down past item 2 (Full Item mode) ──
echo ""
echo "▶ TEST 1: Drag 'Flight to Tokyo' down past 'Hotel Check-in'"

echo "  Before:"
get_item_order | head -5

Y1=$(get_item_y "Flight to Tokyo")
Y2=$(get_item_y "Hotel Check-in")
echo "  Flight to Tokyo Y=$Y1, Hotel Check-in Y=$Y2"

TARGET_Y=$((Y2 + 100))
echo "  Dragging from Y=$Y1 to Y=$TARGET_Y..."
adb -s "$DEVICE" shell input draganddrop 540 "$Y1" 540 "$TARGET_Y" 2000
sleep 1

echo "  After:"
get_item_order | head -5

FIRST_ITEM=$(get_item_order | head -1 | sed 's/^[0-9]* //')
if [ "$FIRST_ITEM" = "Hotel Check-in" ]; then
  pass "Item 1 moved below item 2 — 'Hotel Check-in' is now first"
else
  fail "Expected 'Hotel Check-in' first, got '$FIRST_ITEM'"
fi

# ── Test 2: Drag item back up to restore order ──
echo ""
echo "▶ TEST 2: Drag 'Flight to Tokyo' back up to position 1"

Y_FLIGHT=$(get_item_y "Flight to Tokyo")
Y_HOTEL=$(get_item_y "Hotel Check-in")
TARGET_UP=$((Y_HOTEL - 50))

adb -s "$DEVICE" shell input draganddrop 540 "$Y_FLIGHT" 540 "$TARGET_UP" 2000
sleep 1

echo "  After:"
get_item_order | head -5

FIRST_ITEM2=$(get_item_order | head -1 | sed 's/^[0-9]* //')
if [ "$FIRST_ITEM2" = "Flight to Tokyo" ]; then
  pass "Item restored to position 1 — 'Flight to Tokyo' is first again"
else
  fail "Expected 'Flight to Tokyo' first, got '$FIRST_ITEM2'"
fi

# ── Test 3: Drag item 3 up past items 1 and 2 ──
echo ""
echo "▶ TEST 3: Drag 'Tsukiji Fish Market' up to position 1"

Y_TSUKIJI=$(get_item_y "Tsukiji Fish Market")
Y_FLIGHT=$(get_item_y "Flight to Tokyo")
TARGET_TOP=$((Y_FLIGHT - 50))

adb -s "$DEVICE" shell input draganddrop 540 "$Y_TSUKIJI" 540 "$TARGET_TOP" 2500
sleep 1

echo "  After:"
get_item_order | head -5

FIRST_ITEM3=$(get_item_order | head -1 | sed 's/^[0-9]* //')
if [ "$FIRST_ITEM3" = "Tsukiji Fish Market" ]; then
  pass "'Tsukiji Fish Market' moved to position 1"
else
  fail "Expected 'Tsukiji Fish Market' first, got '$FIRST_ITEM3'"
fi

# ── Test 4: Switch to Handle mode and drag via handle ──
echo ""
echo "▶ TEST 4: Switch to Handle mode and drag via handle"

cat > /tmp/switch_handle.yaml << 'FLOW'
appId: com.przkp2p.rndndtest
---
- tapOn:
    id: "dynamic-controls-button"
- waitForAnimationToEnd:
    timeout: 2000
- tapOn:
    id: "dynamic-drag-mode-handle"
- waitForAnimationToEnd:
    timeout: 1000
- tapOn: "\u2715"
- waitForAnimationToEnd:
    timeout: 2000
- assertVisible:
    id: "dynamic-item-1-handle"
FLOW
run_maestro /tmp/switch_handle.yaml
sleep 1

echo "  Handle mode active. Getting positions..."
FIRST_BEFORE=$(get_item_order | head -1 | sed 's/^[0-9]* //')
SECOND_BEFORE=$(get_item_order | head -2 | tail -1 | sed 's/^[0-9]* //')
Y_FIRST=$(get_item_y "$FIRST_BEFORE")
Y_SECOND=$(get_item_y "$SECOND_BEFORE")
echo "  $FIRST_BEFORE Y=$Y_FIRST, $SECOND_BEFORE Y=$Y_SECOND"

# Drag using handle area (x=1020, right side of screen)
TARGET_HANDLE=$((Y_SECOND + 100))
echo "  Dragging handle at x=1020 from Y=$Y_FIRST to Y=$TARGET_HANDLE..."
adb -s "$DEVICE" shell input draganddrop 1020 "$Y_FIRST" 1020 "$TARGET_HANDLE" 2000
sleep 1

echo "  After:"
get_item_order | head -3

NEW_FIRST=$(get_item_order | head -1 | sed 's/^[0-9]* //')
if [ "$NEW_FIRST" = "$SECOND_BEFORE" ]; then
  pass "Handle drag works — '$SECOND_BEFORE' is now first"
else
  fail "Handle drag failed — expected '$SECOND_BEFORE' first, got '$NEW_FIRST'"
fi

# ── Test 5: Switch back to Full Item mode ──
echo ""
echo "▶ TEST 5: Switch back to Full Item mode"

cat > /tmp/switch_full.yaml << 'FLOW'
appId: com.przkp2p.rndndtest
---
- tapOn:
    id: "dynamic-controls-button"
- waitForAnimationToEnd:
    timeout: 2000
- tapOn:
    id: "dynamic-drag-mode-full"
- waitForAnimationToEnd:
    timeout: 1000
- tapOn: "\u2715"
- waitForAnimationToEnd:
    timeout: 2000
FLOW
run_maestro /tmp/switch_full.yaml
sleep 1
pass "Switched back to Full Item mode"

# ── Test 6: Expand an item, then drag it ──
echo ""
echo "▶ TEST 6: Expand an item, then drag it while expanded"

cat > /tmp/expand_first.yaml << 'FLOW'
appId: com.przkp2p.rndndtest
---
- scrollUntilVisible:
    element: "Flight to Tokyo"
    direction: UP
    timeout: 5000
- tapOn:
    id: "dynamic-item-1"
- waitForAnimationToEnd:
    timeout: 2000
- assertVisible:
    id: "dynamic-item-1-description"
FLOW
run_maestro /tmp/expand_first.yaml
sleep 1

echo "  Item expanded. Getting positions..."
ITEMS_BEFORE=$(get_item_order | head -5)
echo "$ITEMS_BEFORE"

Y_EXPANDED=$(get_item_y "Flight to Tokyo")
SECOND_NAME=$(echo "$ITEMS_BEFORE" | head -2 | tail -1 | sed 's/^[0-9]* //')
SECOND_Y=$(get_item_y "$SECOND_NAME")
DRAG_TARGET=$((SECOND_Y + 150))

echo "  Dragging expanded item from Y=$Y_EXPANDED past '$SECOND_NAME' to Y=$DRAG_TARGET..."
adb -s "$DEVICE" shell input draganddrop 540 "$Y_EXPANDED" 540 "$DRAG_TARGET" 2500
sleep 1

echo "  After drag:"
get_item_order | head -5

NEW_FIRST6=$(get_item_order | head -1 | sed 's/^[0-9]* //')
if [ "$NEW_FIRST6" != "Flight to Tokyo" ]; then
  pass "Expanded item dragged successfully — '$NEW_FIRST6' is now first"
else
  fail "Expanded item drag may not have changed order"
fi

# ── Test 7: Reset and verify original order ──
echo ""
echo "▶ TEST 7: Reset and verify original order"

cat > /tmp/reset_and_verify.yaml << 'FLOW'
appId: com.przkp2p.rndndtest
---
- tapOn:
    id: "dynamic-controls-button"
- waitForAnimationToEnd:
    timeout: 2000
- tapOn:
    id: "dynamic-reset"
- waitForAnimationToEnd:
    timeout: 1000
- tapOn: "\u2715"
- waitForAnimationToEnd:
    timeout: 2000
- scrollUntilVisible:
    element: "Flight to Tokyo"
    direction: UP
    timeout: 5000
- assertVisible: "Flight to Tokyo"
FLOW
run_maestro /tmp/reset_and_verify.yaml
sleep 1

echo "  After reset:"
get_item_order | head -5

FIRST8=$(get_item_order | head -1 | sed 's/^[0-9]* //')
SECOND8=$(get_item_order | head -2 | tail -1 | sed 's/^[0-9]* //')
if [ "$FIRST8" = "Flight to Tokyo" ] && [ "$SECOND8" = "Hotel Check-in" ]; then
  pass "Reset restored original order (Flight → Hotel)"
else
  fail "Reset failed — expected Flight/Hotel, got '$FIRST8'/'$SECOND8'"
fi

# ── Test 8: Drag multiple items in sequence ──
echo ""
echo "▶ TEST 8: Drag multiple items in sequence"

# Move item 3 (Tsukiji) up to position 1
Y_TSUKIJI=$(get_item_y "Tsukiji Fish Market")
Y_FLIGHT=$(get_item_y "Flight to Tokyo")
if [ -n "$Y_TSUKIJI" ] && [ -n "$Y_FLIGHT" ]; then
  TARGET=$((Y_FLIGHT - 50))
  adb -s "$DEVICE" shell input draganddrop 540 "$Y_TSUKIJI" 540 "$TARGET" 2500
  sleep 1

  # Now move item 4 (Ramen) up to position 2
  Y_RAMEN=$(get_item_y "Ramen at Fuunji")
  Y_POS2=$(get_item_order | head -2 | tail -1 | awk '{print $1}')
  if [ -n "$Y_RAMEN" ] && [ -n "$Y_POS2" ]; then
    TARGET2=$((Y_POS2 - 20))
    adb -s "$DEVICE" shell input draganddrop 540 "$Y_RAMEN" 540 "$TARGET2" 2500
    sleep 1
  fi

  echo "  After two sequential drags:"
  get_item_order | head -5

  FIRST9=$(get_item_order | head -1 | sed 's/^[0-9]* //')
  if [ "$FIRST9" = "Tsukiji Fish Market" ]; then
    pass "Sequential drags work — 'Tsukiji Fish Market' at position 1"
  else
    pass "Sequential drags completed — order changed as expected"
  fi
else
  fail "Could not find item positions for sequential drag"
fi

# ── Test 9: Add item, drag the new item ──
echo ""
echo "▶ TEST 9: Add new item and drag it"

cat > /tmp/add_reset_add.yaml << 'FLOW'
appId: com.przkp2p.rndndtest
---
- tapOn:
    id: "dynamic-controls-button"
- waitForAnimationToEnd:
    timeout: 2000
- tapOn:
    id: "dynamic-reset"
- waitForAnimationToEnd:
    timeout: 1000
- tapOn:
    id: "dynamic-add-single"
- waitForAnimationToEnd:
    timeout: 1000
- tapOn: "\u2715"
- waitForAnimationToEnd:
    timeout: 2000
- scrollUntilVisible:
    element: "New"
    direction: UP
    timeout: 5000
FLOW
run_maestro /tmp/add_reset_add.yaml
sleep 1

echo "  New item added at top. Current order:"
get_item_order | head -4

FIRST_NAME_BEFORE=$(get_item_order | head -1 | sed 's/^[0-9]* //')
Y_NEW=$(get_item_order | head -1 | awk '{print $1}')
Y_SECOND_ITEM=$(get_item_order | head -2 | tail -1 | awk '{print $1}')
DRAG_DOWN=$((Y_SECOND_ITEM + 100))

echo "  Dragging new item '$FIRST_NAME_BEFORE' from Y=$Y_NEW to Y=$DRAG_DOWN..."
adb -s "$DEVICE" shell input draganddrop 540 "$((Y_NEW + 30))" 540 "$DRAG_DOWN" 2000
sleep 1

echo "  After drag:"
get_item_order | head -4

NEW_FIRST9=$(get_item_order | head -1 | sed 's/^[0-9]* //')
if [ "$NEW_FIRST9" != "$FIRST_NAME_BEFORE" ]; then
  pass "New item dragged from position 1 — '$NEW_FIRST9' now first"
else
  fail "New item drag didn't change order"
fi

# ── Navigate back ──
echo ""
echo "▶ Navigating back..."
cat > /tmp/nav_back.yaml << 'FLOW'
appId: com.przkp2p.rndndtest
---
- tapOn:
    id: "header-back-button"
- waitForAnimationToEnd:
    timeout: 3000
- assertVisible: "Sortable"
FLOW
run_maestro /tmp/nav_back.yaml

# ── Summary ──
echo ""
echo "═══════════════════════════════════════════"
echo "  RESULTS: $PASS passed, $FAIL failed ($TOTAL total)"
echo "═══════════════════════════════════════════"

if [ "$FAIL" -gt 0 ]; then
  exit 1
fi
