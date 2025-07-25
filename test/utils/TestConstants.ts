/**
 * Constants used across the test suite
 */
export const TestConstants = {
  // Test addresses
  ADDRESSES: {
    ZERO: "0x0000000000000000000000000000000000000000",
    DIAMOND: "0x1234567890123456789012345678901234567890",
    FACET_1: "0x2345678901234567890123456789012345678901",
    FACET_2: "0x3456789012345678901234567890123456789012",
    OWNER: "0x4567890123456789012345678901234567890123",
    USER: "0x5678901234567890123456789012345678901234",
  },

  // Diamond names for testing
  DIAMOND_NAMES: {
    TEST: "TestDiamond",
    MAIN: "MainDiamond",
    UPGRADEABLE: "UpgradeableDiamond",
    EMPTY: "EmptyDiamond",
    INVALID: "InvalidDiamond",
  },

  // Function selectors (first 4 bytes of keccak256 hash)
  FUNCTION_SELECTORS: {
    DIAMOND_CUT: "0x1f931c1c", // diamondCut(FacetCut[],address,bytes)
    LOUPE_FACETS: "0x7a0ed627", // facets()
    LOUPE_FACET_ADDRESSES: "0x52ef6b2c", // facetAddresses()
    LOUPE_FACET_ADDRESS: "0xcdffacc6", // facetAddress(bytes4)
    LOUPE_FACET_FUNCTION_SELECTORS: "0xadfca15e", // facetFunctionSelectors(address)
    SUPPORTS_INTERFACE: "0x01ffc9a7", // supportsInterface(bytes4)
    TEST_FUNCTION_1: "0x12345678",
    TEST_FUNCTION_2: "0x23456789",
    TEST_FUNCTION_3: "0x34567890",
  },

  // Test timeouts
  TIMEOUTS: {
    SHORT: 5000,
    MEDIUM: 30000,
    LONG: 60000,
  },

  // Test file paths
  PATHS: {
    FIXTURE_PROJECTS: "./fixtures/fixture-projects",
    HARDHAT_PROJECT: "./fixtures/fixture-projects/hardhat-project",
    MOCK_CONTRACTS: "./test/mocks/contracts",
    TEST_DATA: "./test/data",
  },

  // Error messages
  ERROR_MESSAGES: {
    DIAMOND_NOT_FOUND: (name: string) =>
      `Diamond configuration for "${name}" not found.`,
    INVALID_CONFIG: "Invalid diamond configuration",
    MISSING_PARAMETER: "Missing required parameter",
  },

  // Test data
  TEST_DATA: {
    EMPTY_BYTES: "0x",
    SAMPLE_INIT_DATA: "0x1234567890abcdef",
    GAS_LIMIT: 8000000,
    GAS_PRICE: "20000000000", // 20 gwei
  },

  // Network configuration
  NETWORKS: {
    HARDHAT: {
      chainId: 31337,
      name: "hardhat",
    },
    LOCALHOST: {
      chainId: 31337,
      name: "localhost",
    },
  },
} as const;

// Type-safe access to constants
export type TestAddress =
  (typeof TestConstants.ADDRESSES)[keyof typeof TestConstants.ADDRESSES];
export type TestDiamondName =
  (typeof TestConstants.DIAMOND_NAMES)[keyof typeof TestConstants.DIAMOND_NAMES];
export type TestFunctionSelector =
  (typeof TestConstants.FUNCTION_SELECTORS)[keyof typeof TestConstants.FUNCTION_SELECTORS];
