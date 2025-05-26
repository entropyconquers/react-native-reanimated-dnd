const fs = require("fs");
const path = require("path");
const glob = require("glob");

const TARGET_MODULE = "react-native-reanimated-dnd";

// List of all unique old import paths derived from your error log.
const OLD_PATHS_TO_REPLACE = [
  // Alias paths from @/
  "@/hooks/useDraggable",
  "@/context/DropContext",
  "@/components/Droppable",
  "@/components/Draggable",
  "@/components/sortableUtils", // As seen in types/sortable.ts
  "@/hooks", // General import from hooks directory

  // Relative paths (./) as seen in errors from components/index.ts, etc.
  // These are specific strings that will be looked for.
  "./Sortable",
  "./SortableItem",
  "./sortableUtils", // As seen in components/index.ts
  "./Draggable", // As seen in components/index.ts
  "./Droppable", // As seen in components/index.ts
  "./sortableTypes",
];

// Directories to search for files
const SEARCH_DIRECTORIES = [
  "components/**/*.ts",
  "components/**/*.tsx",
  "types/**/*.ts",
  "types/**/*.tsx", // Include if you have .tsx files in your types directory
];

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

let filesProcessed = 0;
let filesChanged = 0;

console.log(`Starting import refactor. Target module: "${TARGET_MODULE}"`);
console.log("Paths to replace:", OLD_PATHS_TO_REPLACE);

SEARCH_DIRECTORIES.forEach((dirPattern) => {
  const files = glob.sync(dirPattern, { nodir: true }); // nodir: true ensures only files are matched

  files.forEach((file) => {
    filesProcessed++;
    let content = fs.readFileSync(file, "utf8");
    let originalContent = content;
    let fileHasChanged = false;

    OLD_PATHS_TO_REPLACE.forEach((oldPath) => {
      const escapedOldPath = escapeRegExp(oldPath);
      // Regex to match: import ... from "oldPath" or 'oldPath'
      // Also handles: export ... from "oldPath" or 'oldPath'
      // And: export * from "oldPath" or 'oldPath'
      const importRegex = new RegExp(
        `(from\\s+)(['"])${escapedOldPath}\\2`,
        "g"
      );

      if (importRegex.test(content)) {
        content = content.replace(importRegex, `$1"${TARGET_MODULE}"`);
        fileHasChanged = true;
      }
    });

    if (fileHasChanged) {
      fs.writeFileSync(file, content, "utf8");
      console.log(`UPDATED: ${file}`);
      filesChanged++;
    }
  });
});

console.log("\n--- Refactor Summary ---");
console.log(`Files Scanned: ${filesProcessed}`);
console.log(`Files Modified: ${filesChanged}`);
console.log("-------------------------");

if (filesChanged === 0 && filesProcessed > 0) {
  console.warn("\nWARNING: No files were modified. Please check:");
  console.warn(
    "1. The `OLD_PATHS_TO_REPLACE` list accurately reflects the strings in your import statements."
  );
  console.warn(
    "2. The `SEARCH_DIRECTORIES` patterns correctly target your source files."
  );
  console.warn(
    "3. You have saved changes to your files if you were editing them recently."
  );
}

console.log("\nNext Steps:");
console.log(
  "1. VERY IMPORTANT: Review the changes with `git diff` or your version control's diff tool."
);
console.log("2. If changes are correct, commit them.");
console.log(
  "3. Remove or comment out the old path aliases (e.g., `@/*`) from your `tsconfig.json`'s `compilerOptions.paths`."
);
console.log(
  "4. Ensure `react-native-reanimated-dnd` is installed: `npm install react-native-reanimated-dnd` or `yarn add react-native-reanimated-dnd`."
);
console.log(
  "5. Try compiling your project again (e.g., `tsc --noEmit` or your build command)."
);
console.log(
  "6. Address any remaining TypeScript errors (TS7006, TS2769, etc.). These may require adding explicit type annotations based on the `react-native-reanimated-dnd` library's exported types."
);
console.log(
  "7. Specifically check the function `getBorderColor` in `components/examples/DragStateExample.tsx` for the TS2366 error (missing return)."
);
