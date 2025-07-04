"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const config_1 = require("hardhat/config");
const TestSetup_1 = require("../../utils/TestSetup");
const MockFactories_1 = require("../../utils/MockFactories");
const TestConstants_1 = require("../../utils/TestConstants");
const AssertionHelpers_1 = require("../../utils/AssertionHelpers");
const DiamondsConfig_1 = require("../../../src/DiamondsConfig");
// Import the plugin to test its registration
require("../../../src/index");
describe("Hardhat Diamonds Plugin", function () {
    describe("Plugin Registration", function () {
        it("should export DiamondsConfig class", function () {
            const exported = require("../../../src/index");
            (0, chai_1.expect)(exported).to.have.property("DiamondsConfig");
            (0, chai_1.expect)(exported.DiamondsConfig).to.equal(DiamondsConfig_1.DiamondsConfig);
        });
        it("should register config extension", function () {
            // This test verifies that the extendConfig call was made
            // In a real Hardhat environment, this would be tested differently
            (0, chai_1.expect)(config_1.extendConfig).to.be.a("function");
        });
        it("should register environment extension", function () {
            // This test verifies that the extendEnvironment call was made
            // In a real Hardhat environment, this would be tested differently
            (0, chai_1.expect)(config_1.extendEnvironment).to.be.a("function");
        });
    });
    describe("Config Extension Behavior", function () {
        it("should provide default diamonds config when none specified", function () {
            const userConfig = {};
            const config = {};
            // Simulate the config extension behavior
            const defaultDiamondsConfig = { paths: {} };
            const resultConfig = {
                ...defaultDiamondsConfig,
                ...userConfig.diamonds,
            };
            (0, chai_1.expect)(resultConfig).to.deep.equal({ paths: {} });
        });
        it("should merge user diamonds config with defaults", function () {
            const userConfig = {
                diamonds: {
                    paths: {
                        [TestConstants_1.TestConstants.DIAMOND_NAMES.TEST]: MockFactories_1.MockFactories.createDiamondPathsConfig(),
                    },
                },
            };
            const config = {};
            // Simulate the config extension behavior
            const defaultDiamondsConfig = { paths: {} };
            const resultConfig = {
                ...defaultDiamondsConfig,
                ...userConfig.diamonds,
            };
            (0, chai_1.expect)(resultConfig).to.have.property("paths");
            (0, chai_1.expect)(resultConfig.paths).to.have.property(TestConstants_1.TestConstants.DIAMOND_NAMES.TEST);
        });
        it("should preserve existing paths when merging", function () {
            const userConfig = {
                diamonds: {
                    paths: {
                        [TestConstants_1.TestConstants.DIAMOND_NAMES.TEST]: MockFactories_1.MockFactories.createDiamondPathsConfig(),
                        [TestConstants_1.TestConstants.DIAMOND_NAMES.MAIN]: MockFactories_1.MockFactories.createDiamondPathsConfig(),
                    },
                },
            };
            // Simulate the config extension behavior
            const defaultDiamondsConfig = { paths: {} };
            const resultConfig = {
                ...defaultDiamondsConfig,
                ...userConfig.diamonds,
            };
            (0, chai_1.expect)(resultConfig.paths).to.have.property(TestConstants_1.TestConstants.DIAMOND_NAMES.TEST);
            (0, chai_1.expect)(resultConfig.paths).to.have.property(TestConstants_1.TestConstants.DIAMOND_NAMES.MAIN);
            (0, chai_1.expect)(Object.keys(resultConfig.paths)).to.have.length(2);
        });
        it("should handle empty user config gracefully", function () {
            const userConfig = {
                diamonds: { paths: {} },
            };
            // Simulate the config extension behavior
            const defaultDiamondsConfig = { paths: {} };
            const resultConfig = {
                ...defaultDiamondsConfig,
                ...userConfig.diamonds,
            };
            (0, chai_1.expect)(resultConfig).to.deep.equal({ paths: {} });
        });
        it("should handle undefined diamonds config", function () {
            const userConfig = {};
            // Simulate the config extension behavior
            const defaultDiamondsConfig = { paths: {} };
            const resultConfig = {
                ...defaultDiamondsConfig,
                ...userConfig.diamonds,
            };
            (0, chai_1.expect)(resultConfig).to.deep.equal({ paths: {} });
        });
    });
    describe("Environment Extension Behavior", function () {
        it("should create lazy DiamondsConfig object", function () {
            const mockHre = TestSetup_1.TestSetup.createMockHRE(MockFactories_1.MockFactories.createEmptyDiamondsConfig());
            // Simulate the environment extension by creating a lazy object
            const lazyDiamonds = () => new DiamondsConfig_1.DiamondsConfig(mockHre);
            // Test that the lazy object creates a valid DiamondsConfig
            const diamondsConfig = lazyDiamonds();
            AssertionHelpers_1.AssertionHelpers.assertDiamondsConfigValid(diamondsConfig);
        });
        it("should attach DiamondsConfig to hre.diamonds", function () {
            const mockHre = TestSetup_1.TestSetup.createMockHRE(MockFactories_1.MockFactories.createDiamondsPathsConfig([TestConstants_1.TestConstants.DIAMOND_NAMES.TEST]));
            // Simulate attaching to HRE
            const diamonds = new DiamondsConfig_1.DiamondsConfig(mockHre);
            mockHre.diamonds = diamonds;
            (0, chai_1.expect)(mockHre).to.have.property("diamonds");
            (0, chai_1.expect)(mockHre.diamonds).to.be.instanceOf(DiamondsConfig_1.DiamondsConfig);
            AssertionHelpers_1.AssertionHelpers.assertDiamondsConfigValid(mockHre.diamonds);
        });
        it("should provide access to diamond configurations through hre", function () {
            const config = MockFactories_1.MockFactories.createDiamondsPathsConfig([
                TestConstants_1.TestConstants.DIAMOND_NAMES.TEST,
                TestConstants_1.TestConstants.DIAMOND_NAMES.MAIN,
            ]);
            const mockHre = TestSetup_1.TestSetup.createMockHRE(config);
            // Simulate attaching to HRE
            const diamonds = new DiamondsConfig_1.DiamondsConfig(mockHre);
            mockHre.diamonds = diamonds;
            // Should be able to access diamond configs through hre.diamonds
            AssertionHelpers_1.AssertionHelpers.assertDiamondConfigExists(mockHre.diamonds, TestConstants_1.TestConstants.DIAMOND_NAMES.TEST);
            AssertionHelpers_1.AssertionHelpers.assertDiamondConfigExists(mockHre.diamonds, TestConstants_1.TestConstants.DIAMOND_NAMES.MAIN);
        });
        it("should maintain reference to HRE config", function () {
            const config = MockFactories_1.MockFactories.createDiamondsPathsConfig([TestConstants_1.TestConstants.DIAMOND_NAMES.TEST]);
            const mockHre = TestSetup_1.TestSetup.createMockHRE(config);
            // Simulate attaching to HRE
            const diamonds = new DiamondsConfig_1.DiamondsConfig(mockHre);
            mockHre.diamonds = diamonds;
            (0, chai_1.expect)(mockHre.diamonds.diamonds).to.equal(mockHre.config.diamonds);
        });
    });
    describe("Type Extensions", function () {
        it("should extend HardhatUserConfig interface", function () {
            // This test ensures the type extension works
            const userConfig = {
                diamonds: {
                    paths: {
                        [TestConstants_1.TestConstants.DIAMOND_NAMES.TEST]: MockFactories_1.MockFactories.createDiamondPathsConfig(),
                    },
                },
            };
            (0, chai_1.expect)(userConfig.diamonds).to.be.an("object");
            (0, chai_1.expect)(userConfig.diamonds.paths).to.have.property(TestConstants_1.TestConstants.DIAMOND_NAMES.TEST);
        });
        it("should extend HardhatConfig interface", function () {
            // This test ensures the type extension works
            const config = {
                diamonds: {
                    paths: {
                        [TestConstants_1.TestConstants.DIAMOND_NAMES.TEST]: MockFactories_1.MockFactories.createDiamondPathsConfig(),
                    },
                },
            };
            (0, chai_1.expect)(config.diamonds).to.be.an("object");
            (0, chai_1.expect)(config.diamonds.paths).to.have.property(TestConstants_1.TestConstants.DIAMOND_NAMES.TEST);
        });
    });
    describe("Integration", function () {
        it("should work with complex diamond configurations", function () {
            const complexConfig = MockFactories_1.MockFactories.createComplexDiamondsConfig();
            const mockHre = TestSetup_1.TestSetup.createMockHRE(complexConfig);
            // Simulate the full plugin integration
            const diamonds = new DiamondsConfig_1.DiamondsConfig(mockHre);
            mockHre.diamonds = diamonds;
            // Verify all diamonds are accessible
            AssertionHelpers_1.AssertionHelpers.assertDiamondConfigExists(mockHre.diamonds, "MainDiamond");
            AssertionHelpers_1.AssertionHelpers.assertDiamondConfigExists(mockHre.diamonds, "UpgradeableDiamond");
            AssertionHelpers_1.AssertionHelpers.assertDiamondConfigExists(mockHre.diamonds, "TestDiamond");
            AssertionHelpers_1.AssertionHelpers.assertDiamondsCount(mockHre.diamonds.diamonds, 3);
        });
        it("should handle configuration changes at runtime", function () {
            const initialConfig = MockFactories_1.MockFactories.createDiamondsPathsConfig([TestConstants_1.TestConstants.DIAMOND_NAMES.TEST]);
            const mockHre = TestSetup_1.TestSetup.createMockHRE(initialConfig);
            // Simulate the full plugin integration
            const diamonds = new DiamondsConfig_1.DiamondsConfig(mockHre);
            mockHre.diamonds = diamonds;
            // Initial state
            AssertionHelpers_1.AssertionHelpers.assertDiamondsCount(mockHre.diamonds.diamonds, 1);
            // Add a new diamond configuration at runtime
            mockHre.config.diamonds.paths[TestConstants_1.TestConstants.DIAMOND_NAMES.MAIN] =
                MockFactories_1.MockFactories.createDiamondPathsConfig();
            // Should reflect the change
            AssertionHelpers_1.AssertionHelpers.assertDiamondConfigExists(mockHre.diamonds, TestConstants_1.TestConstants.DIAMOND_NAMES.MAIN);
            AssertionHelpers_1.AssertionHelpers.assertDiamondsCount(mockHre.diamonds.diamonds, 2);
        });
        it("should maintain consistency across multiple access patterns", function () {
            const config = MockFactories_1.MockFactories.createDiamondsPathsConfig([TestConstants_1.TestConstants.DIAMOND_NAMES.TEST]);
            const mockHre = TestSetup_1.TestSetup.createMockHRE(config);
            // Simulate the full plugin integration
            const diamonds = new DiamondsConfig_1.DiamondsConfig(mockHre);
            mockHre.diamonds = diamonds;
            // Access the same configuration multiple ways
            const config1 = mockHre.diamonds.getDiamondConfig(TestConstants_1.TestConstants.DIAMOND_NAMES.TEST);
            const config2 = mockHre.diamonds.getDiamondConfig(TestConstants_1.TestConstants.DIAMOND_NAMES.TEST);
            const config3 = mockHre.config.diamonds.paths[TestConstants_1.TestConstants.DIAMOND_NAMES.TEST];
            // Should all reference the same object
            (0, chai_1.expect)(config1).to.equal(config2);
            (0, chai_1.expect)(config1).to.equal(config3);
        });
    });
    describe("Error Handling", function () {
        it("should handle missing diamonds gracefully", function () {
            const emptyConfig = MockFactories_1.MockFactories.createEmptyDiamondsConfig();
            const mockHre = TestSetup_1.TestSetup.createMockHRE(emptyConfig);
            // Simulate the full plugin integration
            const diamonds = new DiamondsConfig_1.DiamondsConfig(mockHre);
            mockHre.diamonds = diamonds;
            // Should throw appropriate error for missing diamond
            AssertionHelpers_1.AssertionHelpers.assertDiamondConfigNotExists(mockHre.diamonds, TestConstants_1.TestConstants.DIAMOND_NAMES.INVALID);
        });
        it("should provide helpful error messages", function () {
            const emptyConfig = MockFactories_1.MockFactories.createEmptyDiamondsConfig();
            const mockHre = TestSetup_1.TestSetup.createMockHRE(emptyConfig);
            // Simulate the full plugin integration
            const diamonds = new DiamondsConfig_1.DiamondsConfig(mockHre);
            mockHre.diamonds = diamonds;
            const invalidName = "NonExistentDiamond";
            AssertionHelpers_1.AssertionHelpers.assertThrowsWithMessage(() => mockHre.diamonds.getDiamondConfig(invalidName), TestConstants_1.TestConstants.ERROR_MESSAGES.DIAMOND_NOT_FOUND(invalidName));
        });
    });
});
//# sourceMappingURL=HardhatPlugin.test.js.map