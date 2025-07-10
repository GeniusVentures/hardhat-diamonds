"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssertionHelpers = void 0;
const chai_1 = require("chai");
const DiamondsConfig_1 = require("../../src/DiamondsConfig");
/**
 * Custom assertion helpers for diamond-specific validations
 */
class AssertionHelpers {
    /**
     * Asserts that a DiamondsConfig instance is properly configured
     */
    static assertDiamondsConfigValid(config) {
        (0, chai_1.expect)(config).to.be.instanceOf(DiamondsConfig_1.DiamondsConfig);
        (0, chai_1.expect)(config.diamonds).to.be.an("object");
        (0, chai_1.expect)(config.diamonds).to.have.property("paths");
        (0, chai_1.expect)(config.diamonds.paths).to.be.an("object");
    }
    /**
     * Asserts that a diamond configuration exists and is valid
     */
    static assertDiamondConfigExists(config, diamondName) {
        (0, chai_1.expect)(() => config.getDiamondConfig(diamondName)).to.not.throw();
        const diamondConfig = config.getDiamondConfig(diamondName);
        (0, chai_1.expect)(diamondConfig).to.be.an("object");
    }
    /**
     * Asserts that a diamond configuration does not exist
     */
    static assertDiamondConfigNotExists(config, diamondName) {
        (0, chai_1.expect)(() => config.getDiamondConfig(diamondName))
            .to.throw(Error)
            .with.property("message")
            .that.includes(`Diamond configuration for "${diamondName}" not found`);
    }
    /**
     * Asserts that two DiamondPathsConfig objects are equal
     */
    static assertDiamondPathsConfigEqual(actual, expected) {
        (0, chai_1.expect)(actual).to.deep.equal(expected);
    }
    /**
     * Asserts that a DiamondsPathsConfig contains specific diamond names
     */
    static assertContainsDiamonds(config, diamondNames) {
        (0, chai_1.expect)(config.paths).to.be.an("object");
        diamondNames.forEach(name => {
            (0, chai_1.expect)(config.paths).to.have.property(name);
        });
    }
    /**
     * Asserts that a DiamondsPathsConfig does not contain specific diamond names
     */
    static assertNotContainsDiamonds(config, diamondNames) {
        (0, chai_1.expect)(config.paths).to.be.an("object");
        diamondNames.forEach(name => {
            (0, chai_1.expect)(config.paths).to.not.have.property(name);
        });
    }
    /**
     * Asserts that a configuration is empty
     */
    static assertEmptyDiamondsConfig(config) {
        (0, chai_1.expect)(config.paths).to.be.an("object");
        (0, chai_1.expect)(Object.keys(config.paths)).to.have.length(0);
    }
    /**
     * Asserts that a configuration has a specific number of diamonds
     */
    static assertDiamondsCount(config, expectedCount) {
        (0, chai_1.expect)(config.paths).to.be.an("object");
        (0, chai_1.expect)(Object.keys(config.paths)).to.have.length(expectedCount);
    }
    /**
     * Asserts that an error matches expected patterns
     */
    static assertError(fn, expectedMessage, expectedType) {
        let thrownError;
        try {
            fn();
        }
        catch (error) {
            thrownError = error;
        }
        (0, chai_1.expect)(thrownError).to.exist;
        if (expectedType) {
            (0, chai_1.expect)(thrownError).to.be.instanceOf(expectedType);
        }
        if (expectedMessage) {
            if (typeof expectedMessage === "string") {
                (0, chai_1.expect)(thrownError.message).to.include(expectedMessage);
            }
            else {
                (0, chai_1.expect)(thrownError.message).to.match(expectedMessage);
            }
        }
    }
    /**
     * Asserts that a function throws an error with a specific message
     */
    static assertThrowsWithMessage(fn, message) {
        (0, chai_1.expect)(fn).to.throw(Error).with.property("message").that.includes(message);
    }
    /**
     * Asserts that a value is a valid Ethereum address
     */
    static assertValidAddress(address) {
        (0, chai_1.expect)(address).to.be.a("string");
        (0, chai_1.expect)(address).to.match(/^0x[a-fA-F0-9]{40}$/);
    }
    /**
     * Asserts that a value is a valid function selector
     */
    static assertValidFunctionSelector(selector) {
        (0, chai_1.expect)(selector).to.be.a("string");
        (0, chai_1.expect)(selector).to.match(/^0x[a-fA-F0-9]{8}$/);
    }
}
exports.AssertionHelpers = AssertionHelpers;
