"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockFactories = void 0;
/**
 * Factory functions for creating test data and mock objects
 */
class MockFactories {
    /**
     * Creates a basic DiamondPathsConfig for testing
     */
    static createDiamondPathsConfig(overrides = {}) {
        return {
            ...overrides,
        };
    }
    /**
     * Creates a DiamondsPathsConfig with multiple diamonds
     */
    static createDiamondsPathsConfig(diamondNames = ["TestDiamond"], configOverrides = {}) {
        const paths = {};
        diamondNames.forEach(name => {
            paths[name] = this.createDiamondPathsConfig(configOverrides[name] || {});
        });
        return { paths };
    }
    /**
     * Creates a complex diamonds configuration for testing
     */
    static createComplexDiamondsConfig() {
        return {
            paths: {
                MainDiamond: this.createDiamondPathsConfig(),
                UpgradeableDiamond: this.createDiamondPathsConfig(),
                TestDiamond: this.createDiamondPathsConfig(),
            },
        };
    }
    /**
     * Creates an empty diamonds configuration
     */
    static createEmptyDiamondsConfig() {
        return { paths: {} };
    }
    /**
     * Creates test addresses for mocking
     */
    static createTestAddresses() {
        return {
            diamond: "0x1234567890123456789012345678901234567890",
            facet1: "0x2345678901234567890123456789012345678901",
            facet2: "0x3456789012345678901234567890123456789012",
            owner: "0x4567890123456789012345678901234567890123",
        };
    }
    /**
     * Creates test function selectors
     */
    static createTestFunctionSelectors() {
        return {
            test1: "0x12345678",
            test2: "0x23456789",
            test3: "0x34567890",
            diamondCut: "0x1f931c1c",
            loupe: "0x7a0ed627",
        };
    }
}
exports.MockFactories = MockFactories;
