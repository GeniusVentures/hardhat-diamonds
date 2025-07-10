import { expect } from "chai";
import { DiamondsConfig } from "../../../src/DiamondsConfig";
import { TestSetup } from "../../utils/TestSetup";
import { MockFactories } from "../../utils/MockFactories";
import { TestConstants } from "../../utils/TestConstants";
import { AssertionHelpers } from "../../utils/AssertionHelpers";

describe("DiamondsConfig", function () {
  let diamondsConfig: DiamondsConfig;

  beforeEach(function () {
    TestSetup.setupTestEnvironment();
  });

  afterEach(function () {
    TestSetup.cleanup();
  });

  describe("constructor", function () {
    it("should create DiamondsConfig instance with empty config", function () {
      const emptyConfig = MockFactories.createEmptyDiamondsConfig();
      diamondsConfig = TestSetup.createDiamondsConfig(emptyConfig);

      AssertionHelpers.assertDiamondsConfigValid(diamondsConfig);
      AssertionHelpers.assertEmptyDiamondsConfig(diamondsConfig.diamonds);
    });

    it("should create DiamondsConfig instance with single diamond", function () {
      const config = MockFactories.createDiamondsPathsConfig([
        TestConstants.DIAMOND_NAMES.TEST,
      ]);
      diamondsConfig = TestSetup.createDiamondsConfig(config);

      AssertionHelpers.assertDiamondsConfigValid(diamondsConfig);
      AssertionHelpers.assertContainsDiamonds(diamondsConfig.diamonds, [
        TestConstants.DIAMOND_NAMES.TEST,
      ]);
      AssertionHelpers.assertDiamondsCount(diamondsConfig.diamonds, 1);
    });

    it("should create DiamondsConfig instance with multiple diamonds", function () {
      const diamondNames = [
        TestConstants.DIAMOND_NAMES.TEST,
        TestConstants.DIAMOND_NAMES.MAIN,
        TestConstants.DIAMOND_NAMES.UPGRADEABLE,
      ];
      const config = MockFactories.createDiamondsPathsConfig(diamondNames);
      diamondsConfig = TestSetup.createDiamondsConfig(config);

      AssertionHelpers.assertDiamondsConfigValid(diamondsConfig);
      AssertionHelpers.assertContainsDiamonds(
        diamondsConfig.diamonds,
        diamondNames
      );
      AssertionHelpers.assertDiamondsCount(diamondsConfig.diamonds, 3);
    });

    it("should create DiamondsConfig instance with complex configuration", function () {
      const config = MockFactories.createComplexDiamondsConfig();
      diamondsConfig = TestSetup.createDiamondsConfig(config);

      AssertionHelpers.assertDiamondsConfigValid(diamondsConfig);
      AssertionHelpers.assertContainsDiamonds(diamondsConfig.diamonds, [
        "MainDiamond",
        "UpgradeableDiamond",
        "TestDiamond",
      ]);
      AssertionHelpers.assertDiamondsCount(diamondsConfig.diamonds, 3);
    });

    it("should properly reference the HRE config", function () {
      const config = MockFactories.createDiamondsPathsConfig([
        TestConstants.DIAMOND_NAMES.TEST,
      ]);
      const hre = TestSetup.createMockHRE(config);
      diamondsConfig = new DiamondsConfig(hre);

      expect(diamondsConfig.diamonds).to.equal(hre.config.diamonds);
      expect(diamondsConfig.diamonds).to.deep.equal(config);
    });
  });

  describe("getDiamondConfig", function () {
    beforeEach(function () {
      const config = MockFactories.createDiamondsPathsConfig([
        TestConstants.DIAMOND_NAMES.TEST,
        TestConstants.DIAMOND_NAMES.MAIN,
      ]);
      diamondsConfig = TestSetup.createDiamondsConfig(config);
    });

    it("should return diamond config for existing diamond", function () {
      AssertionHelpers.assertDiamondConfigExists(
        diamondsConfig,
        TestConstants.DIAMOND_NAMES.TEST
      );
      AssertionHelpers.assertDiamondConfigExists(
        diamondsConfig,
        TestConstants.DIAMOND_NAMES.MAIN
      );
    });

    it("should return the correct diamond config object", function () {
      const testConfig = diamondsConfig.getDiamondConfig(
        TestConstants.DIAMOND_NAMES.TEST
      );
      const mainConfig = diamondsConfig.getDiamondConfig(
        TestConstants.DIAMOND_NAMES.MAIN
      );

      expect(testConfig).to.be.an("object");
      expect(mainConfig).to.be.an("object");
      expect(testConfig).to.not.equal(mainConfig);
    });

    it("should throw error for non-existent diamond", function () {
      AssertionHelpers.assertDiamondConfigNotExists(
        diamondsConfig,
        TestConstants.DIAMOND_NAMES.INVALID
      );
    });

    it("should throw error with correct message for non-existent diamond", function () {
      const invalidName = "NonExistentDiamond";
      AssertionHelpers.assertThrowsWithMessage(
        () => diamondsConfig.getDiamondConfig(invalidName),
        TestConstants.ERROR_MESSAGES.DIAMOND_NOT_FOUND(invalidName)
      );
    });

    it("should throw error for empty string diamond name", function () {
      AssertionHelpers.assertThrowsWithMessage(
        () => diamondsConfig.getDiamondConfig(""),
        TestConstants.ERROR_MESSAGES.DIAMOND_NOT_FOUND("")
      );
    });

    it("should be case-sensitive for diamond names", function () {
      AssertionHelpers.assertDiamondConfigExists(
        diamondsConfig,
        TestConstants.DIAMOND_NAMES.TEST
      );
      AssertionHelpers.assertDiamondConfigNotExists(
        diamondsConfig,
        TestConstants.DIAMOND_NAMES.TEST.toLowerCase()
      );
      AssertionHelpers.assertDiamondConfigNotExists(
        diamondsConfig,
        TestConstants.DIAMOND_NAMES.TEST.toUpperCase()
      );
    });

    it("should handle special characters in diamond names", function () {
      const specialName = "Test-Diamond_123";
      const config = MockFactories.createDiamondsPathsConfig([specialName]);
      diamondsConfig = TestSetup.createDiamondsConfig(config);

      AssertionHelpers.assertDiamondConfigExists(diamondsConfig, specialName);
    });
  });

  describe("edge cases", function () {
    it("should handle undefined diamond paths", function () {
      const hre = TestSetup.createMockHRE({ paths: {} });
      diamondsConfig = new DiamondsConfig(hre);

      AssertionHelpers.assertDiamondsConfigValid(diamondsConfig);
      AssertionHelpers.assertEmptyDiamondsConfig(diamondsConfig.diamonds);
    });

    it("should handle null-like values gracefully", function () {
      const config = MockFactories.createEmptyDiamondsConfig();
      diamondsConfig = TestSetup.createDiamondsConfig(config);

      // These should all throw appropriate errors
      AssertionHelpers.assertDiamondConfigNotExists(diamondsConfig, "null");
      AssertionHelpers.assertDiamondConfigNotExists(
        diamondsConfig,
        "undefined"
      );
    });

    it("should handle very long diamond names", function () {
      const longName = "A".repeat(1000);
      const config = MockFactories.createDiamondsPathsConfig([longName]);
      diamondsConfig = TestSetup.createDiamondsConfig(config);

      AssertionHelpers.assertDiamondConfigExists(diamondsConfig, longName);
    });

    it("should handle unicode diamond names", function () {
      const unicodeName = "Diamond🔹Test";
      const config = MockFactories.createDiamondsPathsConfig([unicodeName]);
      diamondsConfig = TestSetup.createDiamondsConfig(config);

      AssertionHelpers.assertDiamondConfigExists(diamondsConfig, unicodeName);
    });
  });

  describe("integration with HRE", function () {
    it("should reflect changes in HRE config", function () {
      const initialConfig = MockFactories.createDiamondsPathsConfig([
        TestConstants.DIAMOND_NAMES.TEST,
      ]);
      const hre = TestSetup.createMockHRE(initialConfig);
      diamondsConfig = new DiamondsConfig(hre);

      // Initial state
      AssertionHelpers.assertDiamondConfigExists(
        diamondsConfig,
        TestConstants.DIAMOND_NAMES.TEST
      );
      AssertionHelpers.assertDiamondsCount(diamondsConfig.diamonds, 1);

      // Modify HRE config
      hre.config.diamonds.paths[TestConstants.DIAMOND_NAMES.MAIN] =
        MockFactories.createDiamondPathsConfig();

      // Changes should be reflected
      AssertionHelpers.assertDiamondConfigExists(
        diamondsConfig,
        TestConstants.DIAMOND_NAMES.MAIN
      );
      AssertionHelpers.assertDiamondsCount(diamondsConfig.diamonds, 2);
    });

    it("should maintain reference to HRE config object", function () {
      const config = MockFactories.createDiamondsPathsConfig([
        TestConstants.DIAMOND_NAMES.TEST,
      ]);
      const hre = TestSetup.createMockHRE(config);
      diamondsConfig = new DiamondsConfig(hre);

      expect(diamondsConfig.diamonds).to.equal(hre.config.diamonds);
      expect(diamondsConfig.diamonds === hre.config.diamonds).to.be.true;
    });
  });

  describe("performance", function () {
    it("should handle large numbers of diamonds efficiently", function () {
      const diamondNames = Array.from(
        { length: 1000 },
        (_, i) => `Diamond${i}`
      );
      const config = MockFactories.createDiamondsPathsConfig(diamondNames);
      diamondsConfig = TestSetup.createDiamondsConfig(config);

      const startTime = Date.now();

      // Test access to various diamonds
      for (let i = 0; i < 100; i++) {
        const randomIndex = Math.floor(Math.random() * diamondNames.length);
        diamondsConfig.getDiamondConfig(diamondNames[randomIndex]);
      }

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Should complete within reasonable time (less than 100ms)
      expect(duration).to.be.lessThan(100);
    });

    it("should handle repeated access efficiently", function () {
      const config = MockFactories.createDiamondsPathsConfig([
        TestConstants.DIAMOND_NAMES.TEST,
      ]);
      diamondsConfig = TestSetup.createDiamondsConfig(config);

      const startTime = Date.now();

      // Access the same diamond many times
      for (let i = 0; i < 10000; i++) {
        diamondsConfig.getDiamondConfig(TestConstants.DIAMOND_NAMES.TEST);
      }

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Should complete within reasonable time (less than 50ms)
      expect(duration).to.be.lessThan(50);
    });
  });
});
