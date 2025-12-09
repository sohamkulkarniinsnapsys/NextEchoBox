// jest.config.mjs
import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

export default {
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  moduleDirectories: ["node_modules", "<rootDir>"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^@/model/User$": "<rootDir>/tests/__mocks__/mockUserModel.ts",
    "^@/lib/dbConnect$": "<rootDir>/tests/__mocks__/mockDbConnect.ts",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  setupFilesAfterEnv: ["<rootDir>/tests/jest.setup.ts"],
  transform: {
    ...tsJestTransformCfg,
  },
  verbose: true,
};
