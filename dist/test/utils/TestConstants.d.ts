/**
 * Constants used across the test suite
 */
export declare const TestConstants: {
    readonly ADDRESSES: {
        readonly ZERO: "0x0000000000000000000000000000000000000000";
        readonly DIAMOND: "0x1234567890123456789012345678901234567890";
        readonly FACET_1: "0x2345678901234567890123456789012345678901";
        readonly FACET_2: "0x3456789012345678901234567890123456789012";
        readonly OWNER: "0x4567890123456789012345678901234567890123";
        readonly USER: "0x5678901234567890123456789012345678901234";
    };
    readonly DIAMOND_NAMES: {
        readonly TEST: "TestDiamond";
        readonly MAIN: "MainDiamond";
        readonly UPGRADEABLE: "UpgradeableDiamond";
        readonly EMPTY: "EmptyDiamond";
        readonly INVALID: "InvalidDiamond";
    };
    readonly FUNCTION_SELECTORS: {
        readonly DIAMOND_CUT: "0x1f931c1c";
        readonly LOUPE_FACETS: "0x7a0ed627";
        readonly LOUPE_FACET_ADDRESSES: "0x52ef6b2c";
        readonly LOUPE_FACET_ADDRESS: "0xcdffacc6";
        readonly LOUPE_FACET_FUNCTION_SELECTORS: "0xadfca15e";
        readonly SUPPORTS_INTERFACE: "0x01ffc9a7";
        readonly TEST_FUNCTION_1: "0x12345678";
        readonly TEST_FUNCTION_2: "0x23456789";
        readonly TEST_FUNCTION_3: "0x34567890";
    };
    readonly TIMEOUTS: {
        readonly SHORT: 5000;
        readonly MEDIUM: 30000;
        readonly LONG: 60000;
    };
    readonly PATHS: {
        readonly FIXTURE_PROJECTS: "./fixtures/fixture-projects";
        readonly HARDHAT_PROJECT: "./fixtures/fixture-projects/hardhat-project";
        readonly MOCK_CONTRACTS: "./test/mocks/contracts";
        readonly TEST_DATA: "./test/data";
    };
    readonly ERROR_MESSAGES: {
        readonly DIAMOND_NOT_FOUND: (name: string) => string;
        readonly INVALID_CONFIG: "Invalid diamond configuration";
        readonly MISSING_PARAMETER: "Missing required parameter";
    };
    readonly TEST_DATA: {
        readonly EMPTY_BYTES: "0x";
        readonly SAMPLE_INIT_DATA: "0x1234567890abcdef";
        readonly GAS_LIMIT: 8000000;
        readonly GAS_PRICE: "20000000000";
    };
    readonly NETWORKS: {
        readonly HARDHAT: {
            readonly chainId: 31337;
            readonly name: "hardhat";
        };
        readonly LOCALHOST: {
            readonly chainId: 31337;
            readonly name: "localhost";
        };
    };
};
export type TestAddress = typeof TestConstants.ADDRESSES[keyof typeof TestConstants.ADDRESSES];
export type TestDiamondName = typeof TestConstants.DIAMOND_NAMES[keyof typeof TestConstants.DIAMOND_NAMES];
export type TestFunctionSelector = typeof TestConstants.FUNCTION_SELECTORS[keyof typeof TestConstants.FUNCTION_SELECTORS];
