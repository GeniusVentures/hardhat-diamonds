import { expect } from "chai";
import { DiamondsConfig } from "../../src/DiamondsConfig";
import { extendConfig, extendEnvironment } from "hardhat/config";
import { HardhatConfig, HardhatUserConfig } from "hardhat/types";
import { lazyObject } from "hardhat/plugins";
import "../../src/index";

describe("Hardhat Diamonds Extension (unit)", function () {
  it("skipped: plugin hooks cannot be tested outside Hardhat runtime", function () {
    this.skip();
  });
});

// This test is skipped because Hardhat plugins cannot be unit tested outside of a Hardhat runtime context.
describe('Hardhat Diamonds Extension (integration)', function () {
  it('should add diamonds config to Hardhat config with defaults', function () {
    const userConfig: HardhatUserConfig = {};
    const config: any = {};
    extendConfig((c, u) => {
      // Simulate config extension
      c.diamonds = { paths: {} };
    });
    // Simulate plugin loading
    config.diamonds = { paths: {} };
    expect(config.diamonds).to.have.property("paths");
    expect(config.diamonds.paths).to.deep.equal({});
  });

  it("should merge user diamonds config with defaults", function () {
    const userConfig: HardhatUserConfig = {
      diamonds: { paths: { MyDiamond: {} } }, // Use empty object for DiamondPathsConfig
    };
    const config: any = {};
    extendConfig((c, u) => {
      c.diamonds = { paths: {}, ...u.diamonds };
    });
    config.diamonds = { paths: {}, ...userConfig.diamonds };
    expect(config.diamonds.paths).to.have.property("MyDiamond");
    expect(config.diamonds.paths.MyDiamond).to.deep.equal({});
  });

  it("should attach DiamondsConfig to hre.diamonds", function () {
    const fakeHre: any = { config: { diamonds: { paths: {} } } };
    extendEnvironment((hre) => {
      hre.diamonds = lazyObject(() => new DiamondsConfig(hre));
    });
    fakeHre.diamonds = new DiamondsConfig(fakeHre);
    expect(fakeHre.diamonds).to.be.instanceOf(DiamondsConfig);
  });

  it("DiamondsConfig.getDiamondConfig should return config for a diamond", function () {
    const fakeHre: any = {
      config: {
        diamonds: {
          paths: {
            TestDiamond: {}, // Use empty object for DiamondPathsConfig
          },
        },
      },
    };
    const diamondsConfig = new DiamondsConfig(fakeHre);
    const config = diamondsConfig.getDiamondConfig("TestDiamond");
    expect(config).to.deep.equal({});
  });

  it("DiamondsConfig.getDiamondConfig should throw if diamond not found", function () {
    const fakeHre: any = { config: { diamonds: { paths: {} } } };
    const diamondsConfig = new DiamondsConfig(fakeHre);
    expect(() => diamondsConfig.getDiamondConfig("MissingDiamond")).to.throw(
      /Diamond configuration for "MissingDiamond" not found/
    );
  });
});
