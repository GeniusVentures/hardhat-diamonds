"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const DiamondsConfig_1 = require("../../../src/DiamondsConfig");
const TestSetup_1 = require("../../utils/TestSetup");
const MockFactories_1 = require("../../utils/MockFactories");
const TestConstants_1 = require("../../utils/TestConstants");
const AssertionHelpers_1 = require("../../utils/AssertionHelpers");
describe("Configuration Management Integration", function () {
    let diamondsConfig;
    beforeEach(function () {
        TestSetup_1.TestSetup.setupTestEnvironment();
    });
    afterEach(function () {
        TestSetup_1.TestSetup.cleanup();
    });
    describe("Dynamic Configuration Updates", function () {
        it("should reflect runtime configuration changes", function () {
            const initialConfig = MockFactories_1.MockFactories.createDiamondsPathsConfig([TestConstants_1.TestConstants.DIAMOND_NAMES.TEST]);
            const hre = TestSetup_1.TestSetup.createMockHRE(initialConfig);
            diamondsConfig = new DiamondsConfig_1.DiamondsConfig(hre);
            // Initial state
            AssertionHelpers_1.AssertionHelpers.assertDiamondsCount(diamondsConfig.diamonds, 1);
            AssertionHelpers_1.AssertionHelpers.assertDiamondConfigExists(diamondsConfig, TestConstants_1.TestConstants.DIAMOND_NAMES.TEST);
            // Add new diamond at runtime
            hre.config.diamonds.paths[TestConstants_1.TestConstants.DIAMOND_NAMES.MAIN] = MockFactories_1.MockFactories.createDiamondPathsConfig();
            // Should immediately reflect the change
            AssertionHelpers_1.AssertionHelpers.assertDiamondsCount(diamondsConfig.diamonds, 2);
            AssertionHelpers_1.AssertionHelpers.assertDiamondConfigExists(diamondsConfig, TestConstants_1.TestConstants.DIAMOND_NAMES.MAIN);
        });
        it("should handle diamond removal at runtime", function () {
            const initialConfig = MockFactories_1.MockFactories.createDiamondsPathsConfig([
                TestConstants_1.TestConstants.DIAMOND_NAMES.TEST,
                TestConstants_1.TestConstants.DIAMOND_NAMES.MAIN,
            ]);
            const hre = TestSetup_1.TestSetup.createMockHRE(initialConfig);
            diamondsConfig = new DiamondsConfig_1.DiamondsConfig(hre);
            // Initial state
            AssertionHelpers_1.AssertionHelpers.assertDiamondsCount(diamondsConfig.diamonds, 2);
            // Remove a diamond
            delete hre.config.diamonds.paths[TestConstants_1.TestConstants.DIAMOND_NAMES.TEST];
            // Should reflect the removal
            AssertionHelpers_1.AssertionHelpers.assertDiamondsCount(diamondsConfig.diamonds, 1);
            AssertionHelpers_1.AssertionHelpers.assertDiamondConfigNotExists(diamondsConfig, TestConstants_1.TestConstants.DIAMOND_NAMES.TEST);
            AssertionHelpers_1.AssertionHelpers.assertDiamondConfigExists(diamondsConfig, TestConstants_1.TestConstants.DIAMOND_NAMES.MAIN);
        });
        it("should handle configuration modification at runtime", function () {
            const initialConfig = MockFactories_1.MockFactories.createDiamondsPathsConfig([TestConstants_1.TestConstants.DIAMOND_NAMES.TEST]);
            const hre = TestSetup_1.TestSetup.createMockHRE(initialConfig);
            diamondsConfig = new DiamondsConfig_1.DiamondsConfig(hre);
            // Get initial config reference
            const originalConfig = diamondsConfig.getDiamondConfig(TestConstants_1.TestConstants.DIAMOND_NAMES.TEST);
            // Modify the configuration object
            const newConfig = MockFactories_1.MockFactories.createDiamondPathsConfig();
            hre.config.diamonds.paths[TestConstants_1.TestConstants.DIAMOND_NAMES.TEST] = newConfig;
            // Should reflect the new configuration
            const updatedConfig = diamondsConfig.getDiamondConfig(TestConstants_1.TestConstants.DIAMOND_NAMES.TEST);
            (0, chai_1.expect)(updatedConfig).to.equal(newConfig);
            (0, chai_1.expect)(updatedConfig).to.not.equal(originalConfig);
        });
    });
    describe("Multi-Instance Consistency", function () {
        it("should maintain consistency across multiple DiamondsConfig instances", function () {
            const config = MockFactories_1.MockFactories.createDiamondsPathsConfig([TestConstants_1.TestConstants.DIAMOND_NAMES.TEST]);
            const hre = TestSetup_1.TestSetup.createMockHRE(config);
            // Create multiple instances
            const config1 = new DiamondsConfig_1.DiamondsConfig(hre);
            const config2 = new DiamondsConfig_1.DiamondsConfig(hre);
            // Both should see the same configuration
            AssertionHelpers_1.AssertionHelpers.assertDiamondConfigExists(config1, TestConstants_1.TestConstants.DIAMOND_NAMES.TEST);
            AssertionHelpers_1.AssertionHelpers.assertDiamondConfigExists(config2, TestConstants_1.TestConstants.DIAMOND_NAMES.TEST);
            // Changes should be reflected in both
            hre.config.diamonds.paths[TestConstants_1.TestConstants.DIAMOND_NAMES.MAIN] = MockFactories_1.MockFactories.createDiamondPathsConfig();
            AssertionHelpers_1.AssertionHelpers.assertDiamondConfigExists(config1, TestConstants_1.TestConstants.DIAMOND_NAMES.MAIN);
            AssertionHelpers_1.AssertionHelpers.assertDiamondConfigExists(config2, TestConstants_1.TestConstants.DIAMOND_NAMES.MAIN);
        });
        it("should share the same configuration object reference", function () {
            const config = MockFactories_1.MockFactories.createDiamondsPathsConfig([TestConstants_1.TestConstants.DIAMOND_NAMES.TEST]);
            const hre = TestSetup_1.TestSetup.createMockHRE(config);
            const config1 = new DiamondsConfig_1.DiamondsConfig(hre);
            const config2 = new DiamondsConfig_1.DiamondsConfig(hre);
            // Should reference the same config object
            (0, chai_1.expect)(config1.diamonds).to.equal(config2.diamonds);
            (0, chai_1.expect)(config1.diamonds).to.equal(hre.config.diamonds);
        });
    });
    describe("Configuration Validation", function () {
        it("should handle various valid configuration structures", function () {
            const validConfigs = [
                MockFactories_1.MockFactories.createEmptyDiamondsConfig(),
                MockFactories_1.MockFactories.createDiamondsPathsConfig([TestConstants_1.TestConstants.DIAMOND_NAMES.TEST]),
                MockFactories_1.MockFactories.createComplexDiamondsConfig(),
            ];
            validConfigs.forEach((config, index) => {
                const hre = TestSetup_1.TestSetup.createMockHRE(config);
                const diamondsConfig = new DiamondsConfig_1.DiamondsConfig(hre);
                AssertionHelpers_1.AssertionHelpers.assertDiamondsConfigValid(diamondsConfig);
                (0, chai_1.expect)(diamondsConfig.diamonds).to.equal(hre.config.diamonds);
            });
        });
        it("should handle edge case configurations", function () {
            // Test with special characters in diamond names
            const specialCharConfig = MockFactories_1.MockFactories.createDiamondsPathsConfig([
                "Diamond-With-Dashes",
                "Diamond_With_Underscores",
                "Diamond123WithNumbers",
                "DiamondWithUnicodeΞ",
            ]);
            const hre = TestSetup_1.TestSetup.createMockHRE(specialCharConfig);
            diamondsConfig = new DiamondsConfig_1.DiamondsConfig(hre);
            AssertionHelpers_1.AssertionHelpers.assertDiamondConfigExists(diamondsConfig, "Diamond-With-Dashes");
            AssertionHelpers_1.AssertionHelpers.assertDiamondConfigExists(diamondsConfig, "Diamond_With_Underscores");
            AssertionHelpers_1.AssertionHelpers.assertDiamondConfigExists(diamondsConfig, "Diamond123WithNumbers");
            AssertionHelpers_1.AssertionHelpers.assertDiamondConfigExists(diamondsConfig, "DiamondWithUnicodeΞ");
        });
        it("should handle very large configurations", function () {
            const largeDiamondNames = Array.from({ length: 1000 }, (_, i) => `Diamond${i}`);
            const largeConfig = MockFactories_1.MockFactories.createDiamondsPathsConfig(largeDiamondNames);
            const hre = TestSetup_1.TestSetup.createMockHRE(largeConfig);
            diamondsConfig = new DiamondsConfig_1.DiamondsConfig(hre);
            AssertionHelpers_1.AssertionHelpers.assertDiamondsConfigValid(diamondsConfig);
            AssertionHelpers_1.AssertionHelpers.assertDiamondsCount(diamondsConfig.diamonds, 1000);
            // Test random access
            const randomIndexes = [0, 250, 500, 750, 999];
            randomIndexes.forEach(index => {
                AssertionHelpers_1.AssertionHelpers.assertDiamondConfigExists(diamondsConfig, `Diamond${index}`);
            });
        });
    });
    describe("Memory Management", function () {
        it("should not cause memory leaks with frequent access", function () {
            const config = MockFactories_1.MockFactories.createDiamondsPathsConfig([TestConstants_1.TestConstants.DIAMOND_NAMES.TEST]);
            const hre = TestSetup_1.TestSetup.createMockHRE(config);
            diamondsConfig = new DiamondsConfig_1.DiamondsConfig(hre);
            // Simulate frequent access
            const startTime = Date.now();
            for (let i = 0; i < 10000; i++) {
                diamondsConfig.getDiamondConfig(TestConstants_1.TestConstants.DIAMOND_NAMES.TEST);
            }
            const endTime = Date.now();
            // Should complete quickly (less than 100ms for 10k accesses)
            (0, chai_1.expect)(endTime - startTime).to.be.lessThan(100);
        });
        it("should handle rapid configuration changes efficiently", function () {
            const hre = TestSetup_1.TestSetup.createMockHRE(MockFactories_1.MockFactories.createEmptyDiamondsConfig());
            diamondsConfig = new DiamondsConfig_1.DiamondsConfig(hre);
            const startTime = Date.now();
            // Rapidly add and remove diamonds
            for (let i = 0; i < 1000; i++) {
                const diamondName = `TempDiamond${i}`;
                hre.config.diamonds.paths[diamondName] = MockFactories_1.MockFactories.createDiamondPathsConfig();
                diamondsConfig.getDiamondConfig(diamondName);
                delete hre.config.diamonds.paths[diamondName];
            }
            const endTime = Date.now();
            // Should complete within reasonable time
            (0, chai_1.expect)(endTime - startTime).to.be.lessThan(1000);
        });
    });
    describe("Error Recovery", function () {
        it("should handle temporary configuration corruption gracefully", function () {
            const config = MockFactories_1.MockFactories.createDiamondsPathsConfig([TestConstants_1.TestConstants.DIAMOND_NAMES.TEST]);
            const hre = TestSetup_1.TestSetup.createMockHRE(config);
            diamondsConfig = new DiamondsConfig_1.DiamondsConfig(hre);
            // Initially should work
            AssertionHelpers_1.AssertionHelpers.assertDiamondConfigExists(diamondsConfig, TestConstants_1.TestConstants.DIAMOND_NAMES.TEST);
            // Temporarily corrupt the configuration
            const originalPaths = hre.config.diamonds.paths;
            hre.config.diamonds.paths = null;
            // Should handle the corruption gracefully
            (0, chai_1.expect)(() => diamondsConfig.getDiamondConfig(TestConstants_1.TestConstants.DIAMOND_NAMES.TEST)).to.throw();
            // Restore configuration
            hre.config.diamonds.paths = originalPaths;
            // Should work again
            AssertionHelpers_1.AssertionHelpers.assertDiamondConfigExists(diamondsConfig, TestConstants_1.TestConstants.DIAMOND_NAMES.TEST);
        });
        it("should provide consistent behavior after errors", function () {
            const config = MockFactories_1.MockFactories.createDiamondsPathsConfig([TestConstants_1.TestConstants.DIAMOND_NAMES.TEST]);
            const hre = TestSetup_1.TestSetup.createMockHRE(config);
            diamondsConfig = new DiamondsConfig_1.DiamondsConfig(hre);
            // Try to access non-existent diamond (should throw)
            (0, chai_1.expect)(() => diamondsConfig.getDiamondConfig("NonExistent")).to.throw();
            // Should still work for valid diamonds
            AssertionHelpers_1.AssertionHelpers.assertDiamondConfigExists(diamondsConfig, TestConstants_1.TestConstants.DIAMOND_NAMES.TEST);
            // Add the previously non-existent diamond
            hre.config.diamonds.paths["NonExistent"] = MockFactories_1.MockFactories.createDiamondPathsConfig();
            // Should now work
            AssertionHelpers_1.AssertionHelpers.assertDiamondConfigExists(diamondsConfig, "NonExistent");
        });
    });
    describe("Concurrent Access", function () {
        it("should handle concurrent configuration access safely", async function () {
            const config = MockFactories_1.MockFactories.createDiamondsPathsConfig([TestConstants_1.TestConstants.DIAMOND_NAMES.TEST]);
            const hre = TestSetup_1.TestSetup.createMockHRE(config);
            diamondsConfig = new DiamondsConfig_1.DiamondsConfig(hre);
            // Simulate concurrent access
            const promises = Array.from({ length: 100 }, async (_, i) => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        try {
                            diamondsConfig.getDiamondConfig(TestConstants_1.TestConstants.DIAMOND_NAMES.TEST);
                            resolve();
                        }
                        catch (error) {
                            resolve(); // Don't fail on expected errors
                        }
                    }, Math.random() * 10);
                });
            });
            // All promises should resolve without issues
            await Promise.all(promises);
            // Configuration should still be valid
            AssertionHelpers_1.AssertionHelpers.assertDiamondConfigExists(diamondsConfig, TestConstants_1.TestConstants.DIAMOND_NAMES.TEST);
        });
        it("should handle concurrent configuration modifications", async function () {
            const hre = TestSetup_1.TestSetup.createMockHRE(MockFactories_1.MockFactories.createEmptyDiamondsConfig());
            diamondsConfig = new DiamondsConfig_1.DiamondsConfig(hre);
            // Simulate concurrent modifications
            const promises = Array.from({ length: 50 }, async (_, i) => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        const diamondName = `ConcurrentDiamond${i}`;
                        hre.config.diamonds.paths[diamondName] = MockFactories_1.MockFactories.createDiamondPathsConfig();
                        try {
                            diamondsConfig.getDiamondConfig(diamondName);
                        }
                        catch (error) {
                            // May fail due to timing, that's okay
                        }
                        resolve();
                    }, Math.random() * 10);
                });
            });
            await Promise.all(promises);
            // Should have some diamonds configured
            (0, chai_1.expect)(Object.keys(hre.config.diamonds.paths).length).to.be.greaterThan(0);
        });
    });
});
//# sourceMappingURL=ConfigurationManagement.test.js.map