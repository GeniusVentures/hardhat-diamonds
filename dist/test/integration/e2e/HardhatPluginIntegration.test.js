"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const TestConstants_1 = require("../../utils/TestConstants");
describe("Hardhat Plugin Integration", function () {
    const fixtureDir = path_1.default.join(__dirname, "../../fixture-projects/hardhat-project");
    const configPath = path_1.default.join(fixtureDir, "hardhat.config.ts");
    const originalConfigPath = path_1.default.join(fixtureDir, "hardhat.config.ts.backup");
    before(function () {
        // Backup original config if it exists
        if (fs_1.default.existsSync(configPath)) {
            fs_1.default.copyFileSync(configPath, originalConfigPath);
        }
    });
    after(function () {
        // Restore original config or clean up
        if (fs_1.default.existsSync(originalConfigPath)) {
            fs_1.default.copyFileSync(originalConfigPath, configPath);
            fs_1.default.unlinkSync(originalConfigPath);
        }
        else if (fs_1.default.existsSync(configPath)) {
            fs_1.default.unlinkSync(configPath);
        }
    });
    describe("TypeScript Compilation", function () {
        beforeEach(function () {
            // Create a test hardhat.config.ts
            const testConfig = `
import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";

// Load the plugin
import "../../src/index";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  defaultNetwork: "hardhat",
  diamonds: {
    paths: {
      ${TestConstants_1.TestConstants.DIAMOND_NAMES.TEST}: {},
      ${TestConstants_1.TestConstants.DIAMOND_NAMES.MAIN}: {},
    }
  },
};

export default config;
`;
            fs_1.default.writeFileSync(configPath, testConfig, "utf8");
        });
        it("should compile TypeScript without errors", function () {
            this.timeout(TestConstants_1.TestConstants.TIMEOUTS.MEDIUM);
            try {
                const result = (0, child_process_1.execSync)("npx tsc --noEmit", {
                    cwd: fixtureDir,
                    stdio: "pipe",
                    encoding: "utf8",
                });
                (0, chai_1.expect)(result).to.be.a("string");
            }
            catch (error) {
                // If there are compilation errors, fail the test with the error output
                throw new Error(`TypeScript compilation failed: ${error.stdout || error.message}`);
            }
        });
        it("should recognize diamonds configuration types", function () {
            this.timeout(TestConstants_1.TestConstants.TIMEOUTS.MEDIUM);
            // Create a config that uses the types extensively
            const advancedConfig = `
import { HardhatUserConfig } from "hardhat/config";
import { DiamondPathsConfig } from "@gnus.ai/diamonds";
import "../../src/index";

const diamondConfig: DiamondPathsConfig = {};

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  defaultNetwork: "hardhat",
  diamonds: {
    paths: {
      TestDiamond: diamondConfig,
      MainDiamond: {},
    }
  },
};

export default config;
`;
            fs_1.default.writeFileSync(configPath, advancedConfig, "utf8");
            try {
                (0, child_process_1.execSync)("npx tsc --noEmit", {
                    cwd: fixtureDir,
                    stdio: "pipe",
                });
            }
            catch (error) {
                throw new Error(`Advanced TypeScript compilation failed: ${error.stdout || error.message}`);
            }
        });
    });
    describe("Runtime Configuration Loading", function () {
        beforeEach(function () {
            const testConfig = `
import { HardhatUserConfig } from "hardhat/config";
import "../../src/index";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  defaultNetwork: "hardhat",
  diamonds: {
    paths: {
      IntegrationTestDiamond: {},
      RuntimeTestDiamond: {},
    }
  },
};

export default config;
`;
            fs_1.default.writeFileSync(configPath, testConfig, "utf8");
        });
        it("should load diamonds configuration at runtime", function () {
            this.timeout(TestConstants_1.TestConstants.TIMEOUTS.MEDIUM);
            // Create a script to test runtime configuration loading
            const testScript = `
const hre = require("hardhat");

async function testConfig() {
  try {
    console.log("CONFIG_LOADED:", JSON.stringify(hre.config.diamonds));
    console.log("DIAMONDS_AVAILABLE:", !!hre.diamonds);
    console.log("DIAMONDS_TYPE:", typeof hre.diamonds);
    
    if (hre.diamonds && typeof hre.diamonds.getDiamondConfig === 'function') {
      const config = hre.diamonds.getDiamondConfig('IntegrationTestDiamond');
      console.log("DIAMOND_CONFIG_RETRIEVED:", !!config);
    }
    
    process.exit(0);
  } catch (error) {
    console.error("TEST_ERROR:", error.message);
    process.exit(1);
  }
}

testConfig();
`;
            const scriptPath = path_1.default.join(fixtureDir, "test-runtime.js");
            fs_1.default.writeFileSync(scriptPath, testScript, "utf8");
            try {
                const result = (0, child_process_1.execSync)("node test-runtime.js", {
                    cwd: fixtureDir,
                    stdio: "pipe",
                    encoding: "utf8",
                });
                (0, chai_1.expect)(result).to.include("CONFIG_LOADED:");
                (0, chai_1.expect)(result).to.include("DIAMONDS_AVAILABLE:true");
                (0, chai_1.expect)(result).to.include("DIAMOND_CONFIG_RETRIEVED:true");
            }
            catch (error) {
                throw new Error(`Runtime test failed: ${error.stdout || error.message}`);
            }
            finally {
                // Cleanup
                if (fs_1.default.existsSync(scriptPath)) {
                    fs_1.default.unlinkSync(scriptPath);
                }
            }
        });
        it("should handle empty diamonds configuration", function () {
            this.timeout(TestConstants_1.TestConstants.TIMEOUTS.MEDIUM);
            // Create config with empty diamonds
            const emptyConfig = `
import { HardhatUserConfig } from "hardhat/config";
import "../../src/index";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  defaultNetwork: "hardhat",
  diamonds: {
    paths: {}
  },
};

export default config;
`;
            fs_1.default.writeFileSync(configPath, emptyConfig, "utf8");
            const testScript = `
const hre = require("hardhat");

async function testEmptyConfig() {
  try {
    console.log("EMPTY_CONFIG:", JSON.stringify(hre.config.diamonds));
    console.log("PATHS_EMPTY:", Object.keys(hre.config.diamonds.paths).length === 0);
    
    try {
      hre.diamonds.getDiamondConfig('NonExistent');
      console.log("ERROR_NOT_THROWN");
    } catch (e) {
      console.log("ERROR_THROWN_CORRECTLY:", e.message.includes('not found'));
    }
    
    process.exit(0);
  } catch (error) {
    console.error("TEST_ERROR:", error.message);
    process.exit(1);
  }
}

testEmptyConfig();
`;
            const scriptPath = path_1.default.join(fixtureDir, "test-empty.js");
            fs_1.default.writeFileSync(scriptPath, testScript, "utf8");
            try {
                const result = (0, child_process_1.execSync)("node test-empty.js", {
                    cwd: fixtureDir,
                    stdio: "pipe",
                    encoding: "utf8",
                });
                (0, chai_1.expect)(result).to.include("PATHS_EMPTY:true");
                (0, chai_1.expect)(result).to.include("ERROR_THROWN_CORRECTLY:true");
            }
            finally {
                if (fs_1.default.existsSync(scriptPath)) {
                    fs_1.default.unlinkSync(scriptPath);
                }
            }
        });
        it("should handle missing diamonds configuration", function () {
            this.timeout(TestConstants_1.TestConstants.TIMEOUTS.MEDIUM);
            // Create config without diamonds
            const noConfig = `
import { HardhatUserConfig } from "hardhat/config";
import "../../src/index";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  defaultNetwork: "hardhat",
};

export default config;
`;
            fs_1.default.writeFileSync(configPath, noConfig, "utf8");
            const testScript = `
const hre = require("hardhat");

async function testNoConfig() {
  try {
    console.log("DEFAULT_CONFIG:", JSON.stringify(hre.config.diamonds));
    console.log("HAS_PATHS:", !!hre.config.diamonds.paths);
    console.log("DIAMONDS_AVAILABLE:", !!hre.diamonds);
    
    process.exit(0);
  } catch (error) {
    console.error("TEST_ERROR:", error.message);
    process.exit(1);
  }
}

testNoConfig();
`;
            const scriptPath = path_1.default.join(fixtureDir, "test-no-config.js");
            fs_1.default.writeFileSync(scriptPath, testScript, "utf8");
            try {
                const result = (0, child_process_1.execSync)("node test-no-config.js", {
                    cwd: fixtureDir,
                    stdio: "pipe",
                    encoding: "utf8",
                });
                (0, chai_1.expect)(result).to.include("HAS_PATHS:true");
                (0, chai_1.expect)(result).to.include("DIAMONDS_AVAILABLE:true");
            }
            finally {
                if (fs_1.default.existsSync(scriptPath)) {
                    fs_1.default.unlinkSync(scriptPath);
                }
            }
        });
    });
    describe("Plugin Compatibility", function () {
        it("should work with common Hardhat plugins", function () {
            this.timeout(TestConstants_1.TestConstants.TIMEOUTS.MEDIUM);
            const compatConfig = `
import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "../../src/index";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
    },
  },
  diamonds: {
    paths: {
      CompatibilityTestDiamond: {},
    }
  },
};

export default config;
`;
            fs_1.default.writeFileSync(configPath, compatConfig, "utf8");
            try {
                (0, child_process_1.execSync)("npx tsc --noEmit", {
                    cwd: fixtureDir,
                    stdio: "pipe",
                });
            }
            catch (error) {
                throw new Error(`Plugin compatibility test failed: ${error.stdout || error.message}`);
            }
        });
        it("should not conflict with existing configuration", function () {
            this.timeout(TestConstants_1.TestConstants.TIMEOUTS.MEDIUM);
            const complexConfig = `
import { HardhatUserConfig } from "hardhat/config";
import "../../src/index";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      gas: 8000000,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 60000,
  },
  diamonds: {
    paths: {
      ComplexTestDiamond: {},
    }
  },
};

export default config;
`;
            fs_1.default.writeFileSync(configPath, complexConfig, "utf8");
            const testScript = `
const hre = require("hardhat");

async function testComplexConfig() {
  try {
    console.log("SOLIDITY_VERSION:", hre.config.solidity.version);
    console.log("NETWORK_AVAILABLE:", !!hre.config.networks.hardhat);
    console.log("DIAMONDS_AVAILABLE:", !!hre.config.diamonds);
    console.log("MOCHA_TIMEOUT:", hre.config.mocha.timeout);
    
    process.exit(0);
  } catch (error) {
    console.error("TEST_ERROR:", error.message);
    process.exit(1);
  }
}

testComplexConfig();
`;
            const scriptPath = path_1.default.join(fixtureDir, "test-complex.js");
            fs_1.default.writeFileSync(scriptPath, testScript, "utf8");
            try {
                const result = (0, child_process_1.execSync)("node test-complex.js", {
                    cwd: fixtureDir,
                    stdio: "pipe",
                    encoding: "utf8",
                });
                (0, chai_1.expect)(result).to.include("SOLIDITY_VERSION:0.8.17");
                (0, chai_1.expect)(result).to.include("NETWORK_AVAILABLE:true");
                (0, chai_1.expect)(result).to.include("DIAMONDS_AVAILABLE:true");
                (0, chai_1.expect)(result).to.include("MOCHA_TIMEOUT:60000");
            }
            finally {
                if (fs_1.default.existsSync(scriptPath)) {
                    fs_1.default.unlinkSync(scriptPath);
                }
            }
        });
    });
    describe("Error Handling in Real Environment", function () {
        it("should provide helpful error messages for invalid configurations", function () {
            this.timeout(TestConstants_1.TestConstants.TIMEOUTS.MEDIUM);
            const testScript = `
const hre = require("hardhat");

async function testInvalidDiamond() {
  try {
    hre.diamonds.getDiamondConfig('NonExistentDiamond');
    console.log("NO_ERROR_THROWN");
    process.exit(1);
  } catch (error) {
    console.log("ERROR_MESSAGE:", error.message);
    console.log("ERROR_TYPE:", error.constructor.name);
    console.log("ERROR_INCLUDES_NAME:", error.message.includes('NonExistentDiamond'));
    process.exit(0);
  }
}

testInvalidDiamond();
`;
            const scriptPath = path_1.default.join(fixtureDir, "test-error.js");
            fs_1.default.writeFileSync(scriptPath, testScript, "utf8");
            try {
                const result = (0, child_process_1.execSync)("node test-error.js", {
                    cwd: fixtureDir,
                    stdio: "pipe",
                    encoding: "utf8",
                });
                (0, chai_1.expect)(result).to.include("ERROR_TYPE:Error");
                (0, chai_1.expect)(result).to.include("ERROR_INCLUDES_NAME:true");
                (0, chai_1.expect)(result).to.not.include("NO_ERROR_THROWN");
            }
            finally {
                if (fs_1.default.existsSync(scriptPath)) {
                    fs_1.default.unlinkSync(scriptPath);
                }
            }
        });
    });
});
//# sourceMappingURL=HardhatPluginIntegration.test.js.map