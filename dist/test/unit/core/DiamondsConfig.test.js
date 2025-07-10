"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const DiamondsConfig_1 = require("../../../src/DiamondsConfig");
const TestSetup_1 = require("../../utils/TestSetup");
const MockFactories_1 = require("../../utils/MockFactories");
const TestConstants_1 = require("../../utils/TestConstants");
const AssertionHelpers_1 = require("../../utils/AssertionHelpers");
describe("DiamondsConfig", function () {
    let diamondsConfig;
    beforeEach(function () {
        TestSetup_1.TestSetup.setupTestEnvironment();
    });
    afterEach(function () {
        TestSetup_1.TestSetup.cleanup();
    });
    describe("constructor", function () {
        it("should create DiamondsConfig instance with empty config", function () {
            const emptyConfig = MockFactories_1.MockFactories.createEmptyDiamondsConfig();
            diamondsConfig = TestSetup_1.TestSetup.createDiamondsConfig(emptyConfig);
            AssertionHelpers_1.AssertionHelpers.assertDiamondsConfigValid(diamondsConfig);
            AssertionHelpers_1.AssertionHelpers.assertEmptyDiamondsConfig(diamondsConfig.diamonds);
        });
        it("should create DiamondsConfig instance with single diamond", function () {
            const config = MockFactories_1.MockFactories.createDiamondsPathsConfig([TestConstants_1.TestConstants.DIAMOND_NAMES.TEST]);
            diamondsConfig = TestSetup_1.TestSetup.createDiamondsConfig(config);
            AssertionHelpers_1.AssertionHelpers.assertDiamondsConfigValid(diamondsConfig);
            AssertionHelpers_1.AssertionHelpers.assertContainsDiamonds(diamondsConfig.diamonds, [TestConstants_1.TestConstants.DIAMOND_NAMES.TEST]);
            AssertionHelpers_1.AssertionHelpers.assertDiamondsCount(diamondsConfig.diamonds, 1);
        });
        it("should create DiamondsConfig instance with multiple diamonds", function () {
            const diamondNames = [
                TestConstants_1.TestConstants.DIAMOND_NAMES.TEST,
                TestConstants_1.TestConstants.DIAMOND_NAMES.MAIN,
                TestConstants_1.TestConstants.DIAMOND_NAMES.UPGRADEABLE,
            ];
            const config = MockFactories_1.MockFactories.createDiamondsPathsConfig(diamondNames);
            diamondsConfig = TestSetup_1.TestSetup.createDiamondsConfig(config);
            AssertionHelpers_1.AssertionHelpers.assertDiamondsConfigValid(diamondsConfig);
            AssertionHelpers_1.AssertionHelpers.assertContainsDiamonds(diamondsConfig.diamonds, diamondNames);
            AssertionHelpers_1.AssertionHelpers.assertDiamondsCount(diamondsConfig.diamonds, 3);
        });
        it("should create DiamondsConfig instance with complex configuration", function () {
            const config = MockFactories_1.MockFactories.createComplexDiamondsConfig();
            diamondsConfig = TestSetup_1.TestSetup.createDiamondsConfig(config);
            AssertionHelpers_1.AssertionHelpers.assertDiamondsConfigValid(diamondsConfig);
            AssertionHelpers_1.AssertionHelpers.assertContainsDiamonds(diamondsConfig.diamonds, [
                "MainDiamond",
                "UpgradeableDiamond",
                "TestDiamond",
            ]);
            AssertionHelpers_1.AssertionHelpers.assertDiamondsCount(diamondsConfig.diamonds, 3);
        });
        it("should properly reference the HRE config", function () {
            const config = MockFactories_1.MockFactories.createDiamondsPathsConfig([TestConstants_1.TestConstants.DIAMOND_NAMES.TEST]);
            const hre = TestSetup_1.TestSetup.createMockHRE(config);
            diamondsConfig = new DiamondsConfig_1.DiamondsConfig(hre);
            (0, chai_1.expect)(diamondsConfig.diamonds).to.equal(hre.config.diamonds);
            (0, chai_1.expect)(diamondsConfig.diamonds).to.deep.equal(config);
        });
    });
    describe("getDiamondConfig", function () {
        beforeEach(function () {
            const config = MockFactories_1.MockFactories.createDiamondsPathsConfig([
                TestConstants_1.TestConstants.DIAMOND_NAMES.TEST,
                TestConstants_1.TestConstants.DIAMOND_NAMES.MAIN,
            ]);
            diamondsConfig = TestSetup_1.TestSetup.createDiamondsConfig(config);
        });
        it("should return diamond config for existing diamond", function () {
            AssertionHelpers_1.AssertionHelpers.assertDiamondConfigExists(diamondsConfig, TestConstants_1.TestConstants.DIAMOND_NAMES.TEST);
            AssertionHelpers_1.AssertionHelpers.assertDiamondConfigExists(diamondsConfig, TestConstants_1.TestConstants.DIAMOND_NAMES.MAIN);
        });
        it("should return the correct diamond config object", function () {
            const testConfig = diamondsConfig.getDiamondConfig(TestConstants_1.TestConstants.DIAMOND_NAMES.TEST);
            const mainConfig = diamondsConfig.getDiamondConfig(TestConstants_1.TestConstants.DIAMOND_NAMES.MAIN);
            (0, chai_1.expect)(testConfig).to.be.an("object");
            (0, chai_1.expect)(mainConfig).to.be.an("object");
            (0, chai_1.expect)(testConfig).to.not.equal(mainConfig);
        });
        it("should throw error for non-existent diamond", function () {
            AssertionHelpers_1.AssertionHelpers.assertDiamondConfigNotExists(diamondsConfig, TestConstants_1.TestConstants.DIAMOND_NAMES.INVALID);
        });
        it("should throw error with correct message for non-existent diamond", function () {
            const invalidName = "NonExistentDiamond";
            AssertionHelpers_1.AssertionHelpers.assertThrowsWithMessage(() => diamondsConfig.getDiamondConfig(invalidName), TestConstants_1.TestConstants.ERROR_MESSAGES.DIAMOND_NOT_FOUND(invalidName));
        });
        it("should throw error for empty string diamond name", function () {
            AssertionHelpers_1.AssertionHelpers.assertThrowsWithMessage(() => diamondsConfig.getDiamondConfig(""), TestConstants_1.TestConstants.ERROR_MESSAGES.DIAMOND_NOT_FOUND(""));
        });
        it("should be case-sensitive for diamond names", function () {
            AssertionHelpers_1.AssertionHelpers.assertDiamondConfigExists(diamondsConfig, TestConstants_1.TestConstants.DIAMOND_NAMES.TEST);
            AssertionHelpers_1.AssertionHelpers.assertDiamondConfigNotExists(diamondsConfig, TestConstants_1.TestConstants.DIAMOND_NAMES.TEST.toLowerCase());
            AssertionHelpers_1.AssertionHelpers.assertDiamondConfigNotExists(diamondsConfig, TestConstants_1.TestConstants.DIAMOND_NAMES.TEST.toUpperCase());
        });
        it("should handle special characters in diamond names", function () {
            const specialName = "Test-Diamond_123";
            const config = MockFactories_1.MockFactories.createDiamondsPathsConfig([specialName]);
            diamondsConfig = TestSetup_1.TestSetup.createDiamondsConfig(config);
            AssertionHelpers_1.AssertionHelpers.assertDiamondConfigExists(diamondsConfig, specialName);
        });
    });
    describe("edge cases", function () {
        it("should handle undefined diamond paths", function () {
            const hre = TestSetup_1.TestSetup.createMockHRE({ paths: {} });
            diamondsConfig = new DiamondsConfig_1.DiamondsConfig(hre);
            AssertionHelpers_1.AssertionHelpers.assertDiamondsConfigValid(diamondsConfig);
            AssertionHelpers_1.AssertionHelpers.assertEmptyDiamondsConfig(diamondsConfig.diamonds);
        });
        it("should handle null-like values gracefully", function () {
            const config = MockFactories_1.MockFactories.createEmptyDiamondsConfig();
            diamondsConfig = TestSetup_1.TestSetup.createDiamondsConfig(config);
            // These should all throw appropriate errors
            AssertionHelpers_1.AssertionHelpers.assertDiamondConfigNotExists(diamondsConfig, "null");
            AssertionHelpers_1.AssertionHelpers.assertDiamondConfigNotExists(diamondsConfig, "undefined");
        });
        it("should handle very long diamond names", function () {
            const longName = "A".repeat(1000);
            const config = MockFactories_1.MockFactories.createDiamondsPathsConfig([longName]);
            diamondsConfig = TestSetup_1.TestSetup.createDiamondsConfig(config);
            AssertionHelpers_1.AssertionHelpers.assertDiamondConfigExists(diamondsConfig, longName);
        });
        it("should handle unicode diamond names", function () {
            const unicodeName = "Diamond🔹Test";
            const config = MockFactories_1.MockFactories.createDiamondsPathsConfig([unicodeName]);
            diamondsConfig = TestSetup_1.TestSetup.createDiamondsConfig(config);
            AssertionHelpers_1.AssertionHelpers.assertDiamondConfigExists(diamondsConfig, unicodeName);
        });
    });
    describe("integration with HRE", function () {
        it("should reflect changes in HRE config", function () {
            const initialConfig = MockFactories_1.MockFactories.createDiamondsPathsConfig([TestConstants_1.TestConstants.DIAMOND_NAMES.TEST]);
            const hre = TestSetup_1.TestSetup.createMockHRE(initialConfig);
            diamondsConfig = new DiamondsConfig_1.DiamondsConfig(hre);
            // Initial state
            AssertionHelpers_1.AssertionHelpers.assertDiamondConfigExists(diamondsConfig, TestConstants_1.TestConstants.DIAMOND_NAMES.TEST);
            AssertionHelpers_1.AssertionHelpers.assertDiamondsCount(diamondsConfig.diamonds, 1);
            // Modify HRE config
            hre.config.diamonds.paths[TestConstants_1.TestConstants.DIAMOND_NAMES.MAIN] = MockFactories_1.MockFactories.createDiamondPathsConfig();
            // Changes should be reflected
            AssertionHelpers_1.AssertionHelpers.assertDiamondConfigExists(diamondsConfig, TestConstants_1.TestConstants.DIAMOND_NAMES.MAIN);
            AssertionHelpers_1.AssertionHelpers.assertDiamondsCount(diamondsConfig.diamonds, 2);
        });
        it("should maintain reference to HRE config object", function () {
            const config = MockFactories_1.MockFactories.createDiamondsPathsConfig([TestConstants_1.TestConstants.DIAMOND_NAMES.TEST]);
            const hre = TestSetup_1.TestSetup.createMockHRE(config);
            diamondsConfig = new DiamondsConfig_1.DiamondsConfig(hre);
            (0, chai_1.expect)(diamondsConfig.diamonds).to.equal(hre.config.diamonds);
            (0, chai_1.expect)(diamondsConfig.diamonds === hre.config.diamonds).to.be.true;
        });
    });
    describe("performance", function () {
        it("should handle large numbers of diamonds efficiently", function () {
            const diamondNames = Array.from({ length: 1000 }, (_, i) => `Diamond${i}`);
            const config = MockFactories_1.MockFactories.createDiamondsPathsConfig(diamondNames);
            diamondsConfig = TestSetup_1.TestSetup.createDiamondsConfig(config);
            const startTime = Date.now();
            // Test access to various diamonds
            for (let i = 0; i < 100; i++) {
                const randomIndex = Math.floor(Math.random() * diamondNames.length);
                diamondsConfig.getDiamondConfig(diamondNames[randomIndex]);
            }
            const endTime = Date.now();
            const duration = endTime - startTime;
            // Should complete within reasonable time (less than 100ms)
            (0, chai_1.expect)(duration).to.be.lessThan(100);
        });
        it("should handle repeated access efficiently", function () {
            const config = MockFactories_1.MockFactories.createDiamondsPathsConfig([TestConstants_1.TestConstants.DIAMOND_NAMES.TEST]);
            diamondsConfig = TestSetup_1.TestSetup.createDiamondsConfig(config);
            const startTime = Date.now();
            // Access the same diamond many times
            for (let i = 0; i < 10000; i++) {
                diamondsConfig.getDiamondConfig(TestConstants_1.TestConstants.DIAMOND_NAMES.TEST);
            }
            const endTime = Date.now();
            const duration = endTime - startTime;
            // Should complete within reasonable time (less than 50ms)
            (0, chai_1.expect)(duration).to.be.lessThan(50);
        });
    });
});
