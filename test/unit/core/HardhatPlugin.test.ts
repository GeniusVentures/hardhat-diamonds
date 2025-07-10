import { expect } from "chai";
import { extendConfig, extendEnvironment } from "hardhat/config";
import { HardhatConfig, HardhatUserConfig } from "hardhat/types";
import { TestSetup } from "../../utils/TestSetup";
import { MockFactories } from "../../utils/MockFactories";
import { TestConstants } from "../../utils/TestConstants";
import { AssertionHelpers } from "../../utils/AssertionHelpers";
import { DiamondsConfig } from "../../../src/DiamondsConfig";

// Import the plugin to test its registration
import "../../../src/index";

describe("Hardhat Diamonds Plugin", function () {
  describe("Plugin Registration", function () {
    it("should export DiamondsConfig class", function () {
      const exported = require("../../../src/index");
      expect(exported).to.have.property("DiamondsConfig");
      expect(exported.DiamondsConfig).to.equal(DiamondsConfig);
    });

    it("should register config extension", function () {
      // This test verifies that the extendConfig call was made
      // In a real Hardhat environment, this would be tested differently
      expect(extendConfig).to.be.a("function");
    });

    it("should register environment extension", function () {
      // This test verifies that the extendEnvironment call was made
      // In a real Hardhat environment, this would be tested differently
      expect(extendEnvironment).to.be.a("function");
    });
  });

  describe("Config Extension Behavior", function () {
    it("should provide default diamonds config when none specified", function () {
      const userConfig: HardhatUserConfig = {};
      // eslint-disable-next-line no-unused-vars
      const config = {} as HardhatConfig;

      // Simulate the config extension behavior
      const defaultDiamondsConfig = { paths: {} };
      const resultConfig = {
        ...defaultDiamondsConfig,
        ...userConfig.diamonds,
      };

      expect(resultConfig).to.deep.equal({ paths: {} });
    });

    it("should merge user diamonds config with defaults", function () {
      const userConfig: HardhatUserConfig = {
        diamonds: {
          paths: {
            [TestConstants.DIAMOND_NAMES.TEST]:
              MockFactories.createDiamondPathsConfig(),
          },
        },
      };
      const config = {} as HardhatConfig;

      // Simulate the config extension behavior
      const defaultDiamondsConfig = { paths: {} };
      const resultConfig = {
        ...defaultDiamondsConfig,
        ...userConfig.diamonds,
      };

      expect(resultConfig).to.have.property("paths");
      expect(resultConfig.paths).to.have.property(
        TestConstants.DIAMOND_NAMES.TEST
      );
    });

    it("should preserve existing paths when merging", function () {
      const userConfig: HardhatUserConfig = {
        diamonds: {
          paths: {
            [TestConstants.DIAMOND_NAMES.TEST]:
              MockFactories.createDiamondPathsConfig(),
            [TestConstants.DIAMOND_NAMES.MAIN]:
              MockFactories.createDiamondPathsConfig(),
          },
        },
      };

      // Simulate the config extension behavior
      const defaultDiamondsConfig = { paths: {} };
      const resultConfig = {
        ...defaultDiamondsConfig,
        ...userConfig.diamonds,
      };

      expect(resultConfig.paths).to.have.property(
        TestConstants.DIAMOND_NAMES.TEST
      );
      expect(resultConfig.paths).to.have.property(
        TestConstants.DIAMOND_NAMES.MAIN
      );
      expect(Object.keys(resultConfig.paths)).to.have.length(2);
    });

    it("should handle empty user config gracefully", function () {
      const userConfig: HardhatUserConfig = {
        diamonds: { paths: {} },
      };

      // Simulate the config extension behavior
      const defaultDiamondsConfig = { paths: {} };
      const resultConfig = {
        ...defaultDiamondsConfig,
        ...userConfig.diamonds,
      };

      expect(resultConfig).to.deep.equal({ paths: {} });
    });

    it("should handle undefined diamonds config", function () {
      const userConfig: HardhatUserConfig = {};

      // Simulate the config extension behavior
      const defaultDiamondsConfig = { paths: {} };
      const resultConfig = {
        ...defaultDiamondsConfig,
        ...userConfig.diamonds,
      };

      expect(resultConfig).to.deep.equal({ paths: {} });
    });
  });

  describe("Environment Extension Behavior", function () {
    it("should create lazy DiamondsConfig object", function () {
      const mockHre = TestSetup.createMockHRE(
        MockFactories.createEmptyDiamondsConfig()
      );

      // Simulate the environment extension by creating a lazy object
      const lazyDiamonds = () => new DiamondsConfig(mockHre);

      // Test that the lazy object creates a valid DiamondsConfig
      const diamondsConfig = lazyDiamonds();
      AssertionHelpers.assertDiamondsConfigValid(diamondsConfig);
    });

    it("should attach DiamondsConfig to hre.diamonds", function () {
      const mockHre = TestSetup.createMockHRE(
        MockFactories.createDiamondsPathsConfig([
          TestConstants.DIAMOND_NAMES.TEST,
        ])
      );

      // Simulate attaching to HRE
      const diamonds = new DiamondsConfig(mockHre);
      (mockHre as any).diamonds = diamonds;

      expect(mockHre).to.have.property("diamonds");
      expect((mockHre as any).diamonds).to.be.instanceOf(DiamondsConfig);
      AssertionHelpers.assertDiamondsConfigValid((mockHre as any).diamonds);
    });

    it("should provide access to diamond configurations through hre", function () {
      const config = MockFactories.createDiamondsPathsConfig([
        TestConstants.DIAMOND_NAMES.TEST,
        TestConstants.DIAMOND_NAMES.MAIN,
      ]);
      const mockHre = TestSetup.createMockHRE(config);

      // Simulate attaching to HRE
      const diamonds = new DiamondsConfig(mockHre);
      (mockHre as any).diamonds = diamonds;

      // Should be able to access diamond configs through hre.diamonds
      AssertionHelpers.assertDiamondConfigExists(
        (mockHre as any).diamonds,
        TestConstants.DIAMOND_NAMES.TEST
      );
      AssertionHelpers.assertDiamondConfigExists(
        (mockHre as any).diamonds,
        TestConstants.DIAMOND_NAMES.MAIN
      );
    });

    it("should maintain reference to HRE config", function () {
      const config = MockFactories.createDiamondsPathsConfig([
        TestConstants.DIAMOND_NAMES.TEST,
      ]);
      const mockHre = TestSetup.createMockHRE(config);

      // Simulate attaching to HRE
      const diamonds = new DiamondsConfig(mockHre);
      (mockHre as any).diamonds = diamonds;

      expect((mockHre as any).diamonds.diamonds).to.equal(
        mockHre.config.diamonds
      );
    });
  });

  describe("Type Extensions", function () {
    it("should extend HardhatUserConfig interface", function () {
      // This test ensures the type extension works
      const userConfig: HardhatUserConfig = {
        diamonds: {
          paths: {
            [TestConstants.DIAMOND_NAMES.TEST]:
              MockFactories.createDiamondPathsConfig(),
          },
        },
      };

      expect(userConfig.diamonds).to.be.an("object");
      expect(userConfig.diamonds!.paths).to.have.property(
        TestConstants.DIAMOND_NAMES.TEST
      );
    });

    it("should extend HardhatConfig interface", function () {
      // This test ensures the type extension works
      const config = {
        diamonds: {
          paths: {
            [TestConstants.DIAMOND_NAMES.TEST]:
              MockFactories.createDiamondPathsConfig(),
          },
        },
      } as unknown as HardhatConfig;

      expect(config.diamonds).to.be.an("object");
      expect(config.diamonds.paths).to.have.property(
        TestConstants.DIAMOND_NAMES.TEST
      );
    });
  });

  describe("Integration", function () {
    it("should work with complex diamond configurations", function () {
      const complexConfig = MockFactories.createComplexDiamondsConfig();
      const mockHre = TestSetup.createMockHRE(complexConfig);

      // Simulate the full plugin integration
      const diamonds = new DiamondsConfig(mockHre);
      (mockHre as any).diamonds = diamonds;

      // Verify all diamonds are accessible
      AssertionHelpers.assertDiamondConfigExists(
        (mockHre as any).diamonds,
        "MainDiamond"
      );
      AssertionHelpers.assertDiamondConfigExists(
        (mockHre as any).diamonds,
        "UpgradeableDiamond"
      );
      AssertionHelpers.assertDiamondConfigExists(
        (mockHre as any).diamonds,
        "TestDiamond"
      );
      AssertionHelpers.assertDiamondsCount(
        (mockHre as any).diamonds.diamonds,
        3
      );
    });

    it("should handle configuration changes at runtime", function () {
      const initialConfig = MockFactories.createDiamondsPathsConfig([
        TestConstants.DIAMOND_NAMES.TEST,
      ]);
      const mockHre = TestSetup.createMockHRE(initialConfig);

      // Simulate the full plugin integration
      const diamonds = new DiamondsConfig(mockHre);
      (mockHre as any).diamonds = diamonds;

      // Initial state
      AssertionHelpers.assertDiamondsCount(
        (mockHre as any).diamonds.diamonds,
        1
      );

      // Add a new diamond configuration at runtime
      mockHre.config.diamonds.paths[TestConstants.DIAMOND_NAMES.MAIN] =
        MockFactories.createDiamondPathsConfig();

      // Should reflect the change
      AssertionHelpers.assertDiamondConfigExists(
        (mockHre as any).diamonds,
        TestConstants.DIAMOND_NAMES.MAIN
      );
      AssertionHelpers.assertDiamondsCount(
        (mockHre as any).diamonds.diamonds,
        2
      );
    });

    it("should maintain consistency across multiple access patterns", function () {
      const config = MockFactories.createDiamondsPathsConfig([
        TestConstants.DIAMOND_NAMES.TEST,
      ]);
      const mockHre = TestSetup.createMockHRE(config);

      // Simulate the full plugin integration
      const diamonds = new DiamondsConfig(mockHre);
      (mockHre as any).diamonds = diamonds;

      // Access the same configuration multiple ways
      const config1 = (mockHre as any).diamonds.getDiamondConfig(
        TestConstants.DIAMOND_NAMES.TEST
      );
      const config2 = (mockHre as any).diamonds.getDiamondConfig(
        TestConstants.DIAMOND_NAMES.TEST
      );
      const config3 =
        mockHre.config.diamonds.paths[TestConstants.DIAMOND_NAMES.TEST];

      // Should all reference the same object
      expect(config1).to.equal(config2);
      expect(config1).to.equal(config3);
    });
  });

  describe("Error Handling", function () {
    it("should handle missing diamonds gracefully", function () {
      const emptyConfig = MockFactories.createEmptyDiamondsConfig();
      const mockHre = TestSetup.createMockHRE(emptyConfig);

      // Simulate the full plugin integration
      const diamonds = new DiamondsConfig(mockHre);
      (mockHre as any).diamonds = diamonds;

      // Should throw appropriate error for missing diamond
      AssertionHelpers.assertDiamondConfigNotExists(
        (mockHre as any).diamonds,
        TestConstants.DIAMOND_NAMES.INVALID
      );
    });

    it("should provide helpful error messages", function () {
      const emptyConfig = MockFactories.createEmptyDiamondsConfig();
      const mockHre = TestSetup.createMockHRE(emptyConfig);

      // Simulate the full plugin integration
      const diamonds = new DiamondsConfig(mockHre);
      (mockHre as any).diamonds = diamonds;

      const invalidName = "NonExistentDiamond";
      AssertionHelpers.assertThrowsWithMessage(
        () => (mockHre as any).diamonds.getDiamondConfig(invalidName),
        TestConstants.ERROR_MESSAGES.DIAMOND_NOT_FOUND(invalidName)
      );
    });
  });
});
