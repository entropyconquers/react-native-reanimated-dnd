# Initial position synchronization regression

`fixtures/PositionSync.tsx` renders the real low-level `SortableItem` and measures
its child views with React Native's `measureLayout`. No Reanimated mocks are used.

1. Install the workspace dependencies and run `npm run build` from the repository root.
2. Temporarily change the `App` import in `example-app/index.ts` to
   `import App from "./e2e-tests/fixtures/PositionSync";`.
3. Start the example with `npm run start --workspace example-app -- --go --no-dev`
   and open it in a matching Expo Go client on iOS or Android. A native example
   build also works. Dismiss Expo Go's tools menu if it appears.
4. Run `maestro test -e APP_ID=host.exp.Exponent example-app/e2e-tests/flows/position-sync.yaml`
   on iOS, or use `APP_ID=host.exp.exponent` on Android. For a native example
   build, use its application ID instead. The flow expects the fixture to be
   open and does not clear the application data or navigate away from it.
5. Restore the original `App` import when finished.

Rebuild the library and reload the bundle after changing the hook. When comparing
bundles with development mode disabled, ensure Expo Go reloads the new bundle;
reopening a cached project can otherwise retain the previous implementation.

## Cases

- **fixed / Check:** A starts at 0 and B at 60 (unchanged initialization control).
- **Add C / Check:** C renders while its position is missing. The parent layout
  effect then publishes index 2 before the first position reaction. C must reach
  120 without another positions update or a remount. Before the fix, it stays at 0.
- **dynamic / Check:** Heights are already known (A: 80, B: 100), but the initial
  estimate is 60. B must start at 80. Before the fix, it stays at 60.
- **dynamic / Add C / Check:** C must reach the cumulative height, 180.
- **Reverse / Check:** Subsequent position changes still settle at their expected
  coordinates in both modes.

For an additional gesture check, long-press a row and drag it past another row.
After it settles, press **Check**: all rows must report `PASS`, and the drop event
must show the changed order. This exercises the active-drag guard and subsequent
position synchronization. The measurement assertions use the current order and
independently sum the fixture's known row heights.

The flow covers the vertical hook. Horizontal and grid synchronization are
separate paths and are not covered by this fixture.
