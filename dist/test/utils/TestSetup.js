"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestSetup = void 0;
const DiamondsConfig_1 = require("../../src/DiamondsConfig");
/**
 * Test setup utilities for hardhat-diamonds tests
 */
class TestSetup {
    /**
     * Creates a mock HardhatRuntimeEnvironment for testing
     */
    static createMockHRE(diamondsConfig = { paths: {} }) {
        return {
            config: {
                diamonds: diamondsConfig,
                solidity: {
                    version: "0.8.17",
                    settings: {
                        optimizer: {
                            enabled: true,
                            runs: 200,
                        },
                    },
                },
                networks: {
                    hardhat: {
                        chainId: 31337,
                    },
                },
                paths: {
                    sources: "./test/mocks/contracts",
                    tests: "./test",
                    cache: "./cache",
                    artifacts: "./artifacts",
                },
            },
            userConfig: {},
            hardhatArguments: {},
            tasks: {},
            scopes: {},
            run: async () => { },
            ethers: {},
            waffle: {},
            network: {
                name: "hardhat",
                config: {},
                provider: {},
            },
            artifacts: {},
        };
    }
    /**
     * Creates a test DiamondsConfig instance
     */
    static createDiamondsConfig(diamondsConfig = { paths: {} }) {
        const hre = this.createMockHRE(diamondsConfig);
        return new DiamondsConfig_1.DiamondsConfig(hre);
    }
    /**
     * Sets up common test environment
     */
    static setupTestEnvironment() {
        // Reset any global state if needed
        process.env.NODE_ENV = "test";
    }
    /**
     * Cleanup after tests
     */
    static cleanup() {
        // Cleanup any test artifacts
    }
}
exports.TestSetup = TestSetup;
//# sourceMappingURL=TestSetup.js.map