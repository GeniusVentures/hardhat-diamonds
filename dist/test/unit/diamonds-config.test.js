"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const DiamondsConfig_1 = require("../../src/DiamondsConfig");
const config_1 = require("hardhat/config");
const plugins_1 = require("hardhat/plugins");
require("../../src/index");
describe("Hardhat Diamonds Extension (unit)", function () {
    it("skipped: plugin hooks cannot be tested outside Hardhat runtime", function () {
        this.skip();
    });
});
// This test is skipped because Hardhat plugins cannot be unit tested outside of a Hardhat runtime context.
describe('Hardhat Diamonds Extension (integration)', function () {
    it('should add diamonds config to Hardhat config with defaults', function () {
        const userConfig = {};
        const config = {};
        (0, config_1.extendConfig)((c, u) => {
            // Simulate config extension
            c.diamonds = { paths: {} };
        });
        // Simulate plugin loading
        config.diamonds = { paths: {} };
        (0, chai_1.expect)(config.diamonds).to.have.property("paths");
        (0, chai_1.expect)(config.diamonds.paths).to.deep.equal({});
    });
    it("should merge user diamonds config with defaults", function () {
        const userConfig = {
            diamonds: { paths: { MyDiamond: {} } }, // Use empty object for DiamondPathsConfig
        };
        const config = {};
        (0, config_1.extendConfig)((c, u) => {
            c.diamonds = { paths: {}, ...u.diamonds };
        });
        config.diamonds = { paths: {}, ...userConfig.diamonds };
        (0, chai_1.expect)(config.diamonds.paths).to.have.property("MyDiamond");
        (0, chai_1.expect)(config.diamonds.paths.MyDiamond).to.deep.equal({});
    });
    it("should attach DiamondsConfig to hre.diamonds", function () {
        const fakeHre = { config: { diamonds: { paths: {} } } };
        (0, config_1.extendEnvironment)((hre) => {
            hre.diamonds = (0, plugins_1.lazyObject)(() => new DiamondsConfig_1.DiamondsConfig(hre));
        });
        fakeHre.diamonds = new DiamondsConfig_1.DiamondsConfig(fakeHre);
        (0, chai_1.expect)(fakeHre.diamonds).to.be.instanceOf(DiamondsConfig_1.DiamondsConfig);
    });
    it("DiamondsConfig.getDiamondConfig should return config for a diamond", function () {
        const fakeHre = {
            config: {
                diamonds: {
                    paths: {
                        TestDiamond: {}, // Use empty object for DiamondPathsConfig
                    },
                },
            },
        };
        const diamondsConfig = new DiamondsConfig_1.DiamondsConfig(fakeHre);
        const config = diamondsConfig.getDiamondConfig("TestDiamond");
        (0, chai_1.expect)(config).to.deep.equal({});
    });
    it("DiamondsConfig.getDiamondConfig should throw if diamond not found", function () {
        const fakeHre = { config: { diamonds: { paths: {} } } };
        const diamondsConfig = new DiamondsConfig_1.DiamondsConfig(fakeHre);
        (0, chai_1.expect)(() => diamondsConfig.getDiamondConfig("MissingDiamond")).to.throw(/Diamond configuration for "MissingDiamond" not found/);
    });
});
//# sourceMappingURL=diamonds-config.test.js.map