import { globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals.js";

export default [
  globalIgnores([".next/**", "node_modules/**"]),
];
