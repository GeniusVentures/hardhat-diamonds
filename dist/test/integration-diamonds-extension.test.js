"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
describe.skip("Integration: Hardhat Diamonds Extension", function () {
    const fixtureDir = path_1.default.join(__dirname, "../fixtures/fixture-projects/hardhat-project");
    const configPath = path_1.default.join(fixtureDir, "hardhat.config.ts");
    const configFixturePath = path_1.default.join(fixtureDir, "hardhat.config.ts.fixture");
    const tsconfigPath = path_1.default.join(fixtureDir, "tsconfig.json");
    const tsconfigFixturePath = path_1.default.join(fixtureDir, "tsconfig.json.fixture");
    const diamondsConfig = `\n  diamonds: {\n    paths: {\n      IntegrationDiamond: {}\n    }\n  },`;
    const env = {
        ...process.env,
        DEFENDER_API_KEY: "dummy",
        DEFENDER_API_SECRET: "dummy",
    };
    before(function () {
        // Copy fixture files to their proper names
        if (fs_1.default.existsSync(configFixturePath)) {
            fs_1.default.copyFileSync(configFixturePath, configPath);
        }
        if (fs_1.default.existsSync(tsconfigFixturePath)) {
            fs_1.default.copyFileSync(tsconfigFixturePath, tsconfigPath);
        }
        // Insert diamonds config into hardhat.config.ts
        if (fs_1.default.existsSync(configPath)) {
            let configContent = fs_1.default.readFileSync(configPath, "utf8");
            configContent = configContent.replace(/(defaultNetwork: "hardhat",)/, `$1${diamondsConfig}`);
            fs_1.default.writeFileSync(configPath, configContent, "utf8");
        }
    });
    after(function () {
        // Clean up test files
        if (fs_1.default.existsSync(configPath)) {
            fs_1.default.unlinkSync(configPath);
        }
        if (fs_1.default.existsSync(tsconfigPath)) {
            fs_1.default.unlinkSync(tsconfigPath);
        }
    });
    it("should not throw type errors in hardhat.config.ts", function () {
        // Run tsc in the fixture project
        const tscPath = path_1.default.join(__dirname, "../../..", "node_modules", ".bin", "tsc");
        const result = (0, child_process_1.execSync)(`${tscPath} --noEmit`, {
            cwd: fixtureDir,
            stdio: "pipe",
            env,
        }).toString();
        (0, chai_1.expect)(result).to.equal("");
    });
    it("should load diamonds config at runtime", function () {
        // Create a script to check config at runtime
        const scriptPath = path_1.default.join(fixtureDir, "checkDiamondsConfig.js");
        fs_1.default.writeFileSync(scriptPath, `const hre = require("hardhat");\nconsole.log(JSON.stringify(hre.config.diamonds));`, "utf8");
        const result = (0, child_process_1.execSync)(`npx hardhat run checkDiamondsConfig.js`, {
            cwd: fixtureDir,
            stdio: ["pipe", "pipe", "pipe"],
            env,
        }).toString();
        (0, chai_1.expect)(JSON.parse(result)).to.have.property("paths");
        fs_1.default.unlinkSync(scriptPath);
    });
});
