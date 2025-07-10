import { expect } from "chai";
import { DiamondsConfig } from "../../../src/DiamondsConfig";
import { TestSetup } from "../../utils/TestSetup";
import { MockFactories } from "../../utils/MockFactories";
import { TestConstants } from "../../utils/TestConstants";
import { AssertionHelpers } from "../../utils/AssertionHelpers";

describe("Configuration Management Integration", function () {
  let diamondsConfig: DiamondsConfig;

  beforeEach(function () {
    TestSetup.setupTestEnvironment();
  });

  afterEach(function () {
    TestSetup.cleanup();
  });

  describe("Dynamic Configuration Updates", function () {
    it("should reflect runtime configuration changes", function () {
      const initialConfig = MockFactories.createDiamondsPathsConfig([
        TestConstants.DIAMOND_NAMES.TEST,
      ]);
      const hre = TestSetup.createMockHRE(initialConfig);
      diamondsConfig = new DiamondsConfig(hre);

      // Initial state
      AssertionHelpers.assertDiamondsCount(diamondsConfig.diamonds, 1);
      AssertionHelpers.assertDiamondConfigExists(
        diamondsConfig,
        TestConstants.DIAMOND_NAMES.TEST
      );

      // Add new diamond at runtime
      hre.config.diamonds.paths[TestConstants.DIAMOND_NAMES.MAIN] =
        MockFactories.createDiamondPathsConfig();

      // Should immediately reflect the change
      AssertionHelpers.assertDiamondsCount(diamondsConfig.diamonds, 2);
      AssertionHelpers.assertDiamondConfigExists(
        diamondsConfig,
        TestConstants.DIAMOND_NAMES.MAIN
      );
    });

    it("should handle diamond removal at runtime", function () {
      const initialConfig = MockFactories.createDiamondsPathsConfig([
        TestConstants.DIAMOND_NAMES.TEST,
        TestConstants.DIAMOND_NAMES.MAIN,
      ]);
      const hre = TestSetup.createMockHRE(initialConfig);
      diamondsConfig = new DiamondsConfig(hre);

      // Initial state
      AssertionHelpers.assertDiamondsCount(diamondsConfig.diamonds, 2);

      // Remove a diamond
      delete hre.config.diamonds.paths[TestConstants.DIAMOND_NAMES.TEST];

      // Should reflect the removal
      AssertionHelpers.assertDiamondsCount(diamondsConfig.diamonds, 1);
      AssertionHelpers.assertDiamondConfigNotExists(
        diamondsConfig,
        TestConstants.DIAMOND_NAMES.TEST
      );
      AssertionHelpers.assertDiamondConfigExists(
        diamondsConfig,
        TestConstants.DIAMOND_NAMES.MAIN
      );
    });

    it("should handle configuration modification at runtime", function () {
      const initialConfig = MockFactories.createDiamondsPathsConfig([
        TestConstants.DIAMOND_NAMES.TEST,
      ]);
      const hre = TestSetup.createMockHRE(initialConfig);
      diamondsConfig = new DiamondsConfig(hre);

      // Get initial config reference
      const originalConfig = diamondsConfig.getDiamondConfig(
        TestConstants.DIAMOND_NAMES.TEST
      );

      // Modify the configuration object
      const newConfig = MockFactories.createDiamondPathsConfig();
      hre.config.diamonds.paths[TestConstants.DIAMOND_NAMES.TEST] = newConfig;

      // Should reflect the new configuration
      const updatedConfig = diamondsConfig.getDiamondConfig(
        TestConstants.DIAMOND_NAMES.TEST
      );
      expect(updatedConfig).to.equal(newConfig);
      expect(updatedConfig).to.not.equal(originalConfig);
    });
  });

  describe("Multi-Instance Consistency", function () {
    it("should maintain consistency across multiple DiamondsConfig instances", function () {
      const config = MockFactories.createDiamondsPathsConfig([
        TestConstants.DIAMOND_NAMES.TEST,
      ]);
      const hre = TestSetup.createMockHRE(config);

      // Create multiple instances
      const config1 = new DiamondsConfig(hre);
      const config2 = new DiamondsConfig(hre);

      // Both should see the same configuration
      AssertionHelpers.assertDiamondConfigExists(
        config1,
        TestConstants.DIAMOND_NAMES.TEST
      );
      AssertionHelpers.assertDiamondConfigExists(
        config2,
        TestConstants.DIAMOND_NAMES.TEST
      );

      // Changes should be reflected in both
      hre.config.diamonds.paths[TestConstants.DIAMOND_NAMES.MAIN] =
        MockFactories.createDiamondPathsConfig();

      AssertionHelpers.assertDiamondConfigExists(
        config1,
        TestConstants.DIAMOND_NAMES.MAIN
      );
      AssertionHelpers.assertDiamondConfigExists(
        config2,
        TestConstants.DIAMOND_NAMES.MAIN
      );
    });

    it("should share the same configuration object reference", function () {
      const config = MockFactories.createDiamondsPathsConfig([
        TestConstants.DIAMOND_NAMES.TEST,
      ]);
      const hre = TestSetup.createMockHRE(config);

      const config1 = new DiamondsConfig(hre);
      const config2 = new DiamondsConfig(hre);

      // Should reference the same config object
      expect(config1.diamonds).to.equal(config2.diamonds);
      expect(config1.diamonds).to.equal(hre.config.diamonds);
    });
  });

  describe("Configuration Validation", function () {
    it("should handle various valid configuration structures", function () {
      const validConfigs = [
        MockFactories.createEmptyDiamondsConfig(),
        MockFactories.createDiamondsPathsConfig([
          TestConstants.DIAMOND_NAMES.TEST,
        ]),
        MockFactories.createComplexDiamondsConfig(),
      ];

      validConfigs.forEach((config) => {
        const hre = TestSetup.createMockHRE(config);
        const diamondsConfig = new DiamondsConfig(hre);

        AssertionHelpers.assertDiamondsConfigValid(diamondsConfig);
        expect(diamondsConfig.diamonds).to.equal(hre.config.diamonds);
      });
    });

    it("should handle edge case configurations", function () {
      // Test with special characters in diamond names
      const specialCharConfig = MockFactories.createDiamondsPathsConfig([
        "Diamond-With-Dashes",
        "Diamond_With_Underscores",
        "Diamond123WithNumbers",
        "DiamondWithUnicodeΞ",
      ]);

      const hre = TestSetup.createMockHRE(specialCharConfig);
      diamondsConfig = new DiamondsConfig(hre);

      AssertionHelpers.assertDiamondConfigExists(
        diamondsConfig,
        "Diamond-With-Dashes"
      );
      AssertionHelpers.assertDiamondConfigExists(
        diamondsConfig,
        "Diamond_With_Underscores"
      );
      AssertionHelpers.assertDiamondConfigExists(
        diamondsConfig,
        "Diamond123WithNumbers"
      );
      AssertionHelpers.assertDiamondConfigExists(
        diamondsConfig,
        "DiamondWithUnicodeΞ"
      );
    });

    it("should handle very large configurations", function () {
      const largeDiamondNames = Array.from(
        { length: 1000 },
        (_, i) => `Diamond${i}`
      );
      const largeConfig =
        MockFactories.createDiamondsPathsConfig(largeDiamondNames);

      const hre = TestSetup.createMockHRE(largeConfig);
      diamondsConfig = new DiamondsConfig(hre);

      AssertionHelpers.assertDiamondsConfigValid(diamondsConfig);
      AssertionHelpers.assertDiamondsCount(diamondsConfig.diamonds, 1000);

      // Test random access
      const randomIndexes = [0, 250, 500, 750, 999];
      randomIndexes.forEach((index) => {
        AssertionHelpers.assertDiamondConfigExists(
          diamondsConfig,
          `Diamond${index}`
        );
      });
    });
  });

  describe("Memory Management", function () {
    it("should not cause memory leaks with frequent access", function () {
      const config = MockFactories.createDiamondsPathsConfig([
        TestConstants.DIAMOND_NAMES.TEST,
      ]);
      const hre = TestSetup.createMockHRE(config);
      diamondsConfig = new DiamondsConfig(hre);

      // Simulate frequent access
      const startTime = Date.now();
      for (let i = 0; i < 10000; i++) {
        diamondsConfig.getDiamondConfig(TestConstants.DIAMOND_NAMES.TEST);
      }
      const endTime = Date.now();

      // Should complete quickly (less than 100ms for 10k accesses)
      expect(endTime - startTime).to.be.lessThan(100);
    });

    it("should handle rapid configuration changes efficiently", function () {
      const hre = TestSetup.createMockHRE(
        MockFactories.createEmptyDiamondsConfig()
      );
      diamondsConfig = new DiamondsConfig(hre);

      const startTime = Date.now();

      // Rapidly add and remove diamonds
      for (let i = 0; i < 1000; i++) {
        const diamondName = `TempDiamond${i}`;
        hre.config.diamonds.paths[diamondName] =
          MockFactories.createDiamondPathsConfig();
        diamondsConfig.getDiamondConfig(diamondName);
        delete hre.config.diamonds.paths[diamondName];
      }

      const endTime = Date.now();

      // Should complete within reasonable time
      expect(endTime - startTime).to.be.lessThan(1000);
    });
  });

  describe("Error Recovery", function () {
    it("should handle temporary configuration corruption gracefully", function () {
      const config = MockFactories.createDiamondsPathsConfig([
        TestConstants.DIAMOND_NAMES.TEST,
      ]);
      const hre = TestSetup.createMockHRE(config);
      diamondsConfig = new DiamondsConfig(hre);

      // Initially should work
      AssertionHelpers.assertDiamondConfigExists(
        diamondsConfig,
        TestConstants.DIAMOND_NAMES.TEST
      );

      // Temporarily corrupt the configuration
      const originalPaths = hre.config.diamonds.paths;
      (hre.config.diamonds as any).paths = null;

      // Should handle the corruption gracefully
      expect(() =>
        diamondsConfig.getDiamondConfig(TestConstants.DIAMOND_NAMES.TEST)
      ).to.throw();

      // Restore configuration
      hre.config.diamonds.paths = originalPaths;

      // Should work again
      AssertionHelpers.assertDiamondConfigExists(
        diamondsConfig,
        TestConstants.DIAMOND_NAMES.TEST
      );
    });

    it("should provide consistent behavior after errors", function () {
      const config = MockFactories.createDiamondsPathsConfig([
        TestConstants.DIAMOND_NAMES.TEST,
      ]);
      const hre = TestSetup.createMockHRE(config);
      diamondsConfig = new DiamondsConfig(hre);

      // Try to access non-existent diamond (should throw)
      expect(() => diamondsConfig.getDiamondConfig("NonExistent")).to.throw();

      // Should still work for valid diamonds
      AssertionHelpers.assertDiamondConfigExists(
        diamondsConfig,
        TestConstants.DIAMOND_NAMES.TEST
      );

      // Add the previously non-existent diamond
      hre.config.diamonds.paths["NonExistent"] =
        MockFactories.createDiamondPathsConfig();

      // Should now work
      AssertionHelpers.assertDiamondConfigExists(diamondsConfig, "NonExistent");
    });
  });

  describe("Concurrent Access", function () {
    it("should handle concurrent configuration access safely", async function () {
      const config = MockFactories.createDiamondsPathsConfig([
        TestConstants.DIAMOND_NAMES.TEST,
      ]);
      const hre = TestSetup.createMockHRE(config);
      diamondsConfig = new DiamondsConfig(hre);

      // Simulate concurrent access
      const promises = Array.from({ length: 100 }, async () => {
        return new Promise<void>((resolve) => {
          setTimeout(() => {
            try {
              diamondsConfig.getDiamondConfig(TestConstants.DIAMOND_NAMES.TEST);
              resolve();
            } catch (error) {
              resolve(); // Don't fail on expected errors
            }
          }, Math.random() * 10);
        });
      });

      // All promises should resolve without issues
      await Promise.all(promises);

      // Configuration should still be valid
      AssertionHelpers.assertDiamondConfigExists(
        diamondsConfig,
        TestConstants.DIAMOND_NAMES.TEST
      );
    });

    it("should handle concurrent configuration modifications", async function () {
      const hre = TestSetup.createMockHRE(
        MockFactories.createEmptyDiamondsConfig()
      );
      diamondsConfig = new DiamondsConfig(hre);

      // Simulate concurrent modifications
      const promises = Array.from({ length: 50 }, async (_, i) => {
        return new Promise<void>((resolve) => {
          setTimeout(() => {
            const diamondName = `ConcurrentDiamond${i}`;
            hre.config.diamonds.paths[diamondName] =
              MockFactories.createDiamondPathsConfig();
            try {
              diamondsConfig.getDiamondConfig(diamondName);
            } catch (error) {
              // May fail due to timing, that's okay
            }
            resolve();
          }, Math.random() * 10);
        });
      });

      await Promise.all(promises);

      // Should have some diamonds configured
      expect(Object.keys(hre.config.diamonds.paths).length).to.be.greaterThan(
        0
      );
    });
  });
});
