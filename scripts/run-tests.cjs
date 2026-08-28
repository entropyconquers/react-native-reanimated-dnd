// Compiles the calculation tests to CommonJS and runs them with node:test.
// The root package is ESM, so the build output needs a CJS package marker.
const { execSync } = require("child_process");
const fs = require("fs");

execSync("npx tsc -p tsconfig.tests.json", { stdio: "inherit" });

fs.writeFileSync(
  ".test-build/package.json",
  JSON.stringify({ type: "commonjs" }, null, 2)
);

execSync("node --test .test-build/tests/gridCalculations.test.js", { stdio: "inherit" });
