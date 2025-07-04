# Hardhat Diamonds Testing Implementation

This document describes the comprehensive testing implementation for the hardhat-diamonds project, a TypeScript Node.js module that provides a Hardhat Extension for ERC2535 Diamond Proxy Standard smart contract deployment, upgrading, and reporting.

## Overview

The testing implementation provides complete coverage for the hardhat-diamonds plugin with both unit and integration tests, following industry best practices and ensuring robust validation of all functionality.

## Project Structure

### Current Architecture

The project implements a Hardhat plugin with the following core components:

- **DiamondsConfig** (`src/DiamondsConfig.ts`) - Main configuration manager for diamond setups
- **Plugin Registration** (`src/index.ts`) - Hardhat plugin registration and environment extension
- **Type Extensions** (`src/type-extensions.ts`) - TypeScript type definitions for Hardhat integration

### Test Architecture

```
test/
├── unit/                           # Unit tests for individual components
│   ├── core/                      # Core functionality tests
│   │   ├── DiamondsConfig.test.ts # DiamondsConfig class tests
│   │   └── HardhatPlugin.test.ts  # Plugin registration tests
│   └── utils/                     # Utility function tests (future)
├── integration/                   # Integration and end-to-end tests
│   └── e2e/                      # End-to-end workflow tests
│       ├── HardhatPluginIntegration.test.ts
│       └── ConfigurationManagement.test.ts
├── utils/                         # Test utilities and helpers
│   ├── TestSetup.ts              # Common test setup functions
│   ├── MockFactories.ts          # Factory functions for test data
│   ├── TestConstants.ts          # Test constants and values
│   └── AssertionHelpers.ts       # Custom assertion helpers
├── mocks/                        # Mock contracts and data
│   └── contracts/                # Mock Solidity contracts
│       ├── MockDiamond.sol       # Test diamond implementation
│       └── MockTestFacet.sol     # Test facet implementation
└── fixture-projects/             # Test project fixtures
    └── hardhat-project/          # Sample Hardhat project for integration
```

## Test Framework

### Dependencies

- **Mocha** - Test framework
- **Chai** - Assertion library
- **Hardhat** - Development environment
- **TypeScript** - Type safety and compilation
- **Sinon** - Mocking and spying (available for future use)

### Configuration

The test suite is configured through:

- `hardhat.config.ts` - Main Hardhat configuration
- `package.json` - Test scripts and dependencies
- `tsconfig.json` - TypeScript compilation settings

## Test Scripts

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run core component tests
npm run test:core

# Run end-to-end tests
npm run test:e2e

# Run tests with coverage
npm run test:coverage

# Run tests in verbose mode
npm run test:verbose

# Run tests in watch mode
npm run test:watch
```

## Test Categories

### Unit Tests

#### DiamondsConfig Tests (`test/unit/core/DiamondsConfig.test.ts`)

**Constructor Tests:**
- ✅ Create instance with empty config
- ✅ Create instance with single diamond
- ✅ Create instance with multiple diamonds
- ✅ Create instance with complex configuration
- ✅ Properly reference HRE config

**getDiamondConfig Tests:**
- ✅ Return config for existing diamond
- ✅ Return correct config object
- ✅ Throw error for non-existent diamond
- ✅ Throw error with correct message
- ✅ Handle empty string diamond name
- ✅ Case-sensitive diamond names
- ✅ Handle special characters in names

**Edge Cases:**
- ✅ Handle undefined diamond paths
- ✅ Handle null-like values gracefully
- ✅ Handle very long diamond names
- ✅ Handle unicode diamond names

**Integration with HRE:**
- ✅ Reflect changes in HRE config
- ✅ Maintain reference to HRE config object

**Performance:**
- ✅ Handle large numbers of diamonds efficiently
- ✅ Handle repeated access efficiently

#### Plugin Registration Tests (`test/unit/core/HardhatPlugin.test.ts`)

**Plugin Registration:**
- ✅ Export DiamondsConfig class
- ✅ Register config extension
- ✅ Register environment extension

**Config Extension Behavior:**
- ✅ Provide default diamonds config
- ✅ Merge user config with defaults
- ✅ Preserve existing paths when merging
- ✅ Handle empty user config gracefully
- ✅ Handle undefined diamonds config

**Environment Extension Behavior:**
- ✅ Create lazy DiamondsConfig object
- ✅ Attach DiamondsConfig to hre.diamonds
- ✅ Provide access through hre
- ✅ Maintain reference to HRE config

**Type Extensions:**
- ✅ Extend HardhatUserConfig interface
- ✅ Extend HardhatConfig interface

**Integration:**
- ✅ Work with complex configurations
- ✅ Handle configuration changes at runtime
- ✅ Maintain consistency across access patterns

**Error Handling:**
- ✅ Handle missing diamonds gracefully
- ✅ Provide helpful error messages

### Integration Tests

#### Plugin Integration (`test/integration/e2e/HardhatPluginIntegration.test.ts`)

**TypeScript Compilation:**
- ✅ Compile TypeScript without errors
- ✅ Recognize diamonds configuration types

**Runtime Configuration Loading:**
- ✅ Load diamonds configuration at runtime
- ✅ Handle empty diamonds configuration
- ✅ Handle missing diamonds configuration

**Plugin Compatibility:**
- ✅ Work with common Hardhat plugins
- ✅ Not conflict with existing configuration

**Error Handling in Real Environment:**
- ✅ Provide helpful error messages for invalid configurations

#### Configuration Management (`test/integration/e2e/ConfigurationManagement.test.ts`)

**Dynamic Configuration Updates:**
- ✅ Reflect runtime configuration changes
- ✅ Handle diamond removal at runtime
- ✅ Handle configuration modification at runtime

**Multi-Instance Consistency:**
- ✅ Maintain consistency across multiple instances
- ✅ Share same configuration object reference

**Configuration Validation:**
- ✅ Handle various valid configuration structures
- ✅ Handle edge case configurations
- ✅ Handle very large configurations

**Memory Management:**
- ✅ No memory leaks with frequent access
- ✅ Handle rapid configuration changes efficiently

**Error Recovery:**
- ✅ Handle temporary configuration corruption gracefully
- ✅ Provide consistent behavior after errors

**Concurrent Access:**
- ✅ Handle concurrent configuration access safely
- ✅ Handle concurrent configuration modifications

## Test Utilities

### TestSetup (`test/utils/TestSetup.ts`)

Provides common setup functions:
- `createMockHRE()` - Creates mock HardhatRuntimeEnvironment
- `createDiamondsConfig()` - Creates test DiamondsConfig instance
- `setupTestEnvironment()` - Sets up test environment
- `cleanup()` - Cleans up after tests

### MockFactories (`test/utils/MockFactories.ts`)

Factory functions for test data:
- `createDiamondPathsConfig()` - Creates diamond path configuration
- `createDiamondsPathsConfig()` - Creates multi-diamond configuration
- `createComplexDiamondsConfig()` - Creates complex test configuration
- `createEmptyDiamondsConfig()` - Creates empty configuration
- `createTestAddresses()` - Creates test Ethereum addresses
- `createTestFunctionSelectors()` - Creates test function selectors

### TestConstants (`test/utils/TestConstants.ts`)

Centralized test constants:
- **ADDRESSES** - Test Ethereum addresses
- **DIAMOND_NAMES** - Standard test diamond names
- **FUNCTION_SELECTORS** - Test function selectors
- **TIMEOUTS** - Test timeout values
- **PATHS** - Test file paths
- **ERROR_MESSAGES** - Expected error messages
- **TEST_DATA** - Common test data

### AssertionHelpers (`test/utils/AssertionHelpers.ts`)

Custom assertion functions:
- `assertDiamondsConfigValid()` - Validates DiamondsConfig instance
- `assertDiamondConfigExists()` - Asserts diamond config exists
- `assertDiamondConfigNotExists()` - Asserts diamond config doesn't exist
- `assertContainsDiamonds()` - Asserts config contains diamonds
- `assertDiamondsCount()` - Asserts number of diamonds
- `assertError()` - Asserts error conditions
- `assertValidAddress()` - Validates Ethereum addresses
- `assertValidFunctionSelector()` - Validates function selectors

## Mock Contracts

### MockDiamond (`test/mocks/contracts/MockDiamond.sol`)

Complete diamond implementation for testing:
- Diamond cut functionality
- Diamond loupe functionality
- Facet management
- Function selector routing
- Event emission
- EIP-165 interface support

### MockTestFacet (`test/mocks/contracts/MockTestFacet.sol`)

Test facet with various function types:
- Simple functions
- Functions with parameters
- Payable functions
- View/Pure functions
- Functions that emit events
- Functions that revert
- Functions with complex parameters (arrays, structs)
- Functions with multiple return values

## Running Tests

### Prerequisites

```bash
# Install dependencies
npm install

# Build the project
npm run build
```

### Basic Test Execution

```bash
# Run all tests
npm test

# Run specific test categories
npm run test:unit
npm run test:integration
npm run test:core
npm run test:e2e
```

### Advanced Test Options

```bash
# Run with coverage
npm run test:coverage

# Run in verbose mode
npm run test:verbose

# Run specific test file
npx hardhat test test/unit/core/DiamondsConfig.test.ts

# Run tests matching pattern
npx hardhat test --grep "should create DiamondsConfig"
```

### Test Development

```bash
# Run tests in watch mode during development
npm run test:watch

# Run only unit tests during development
npm run test:unit
```

## Coverage Targets

The test suite aims for comprehensive coverage:

- **Unit Tests**: >95% line coverage
- **Integration Tests**: >80% line coverage  
- **Critical Paths**: 100% coverage

## Best Practices

### Test Organization

1. **Descriptive Test Names**: Tests have clear, descriptive names
2. **Logical Grouping**: Tests are grouped by functionality
3. **Consistent Structure**: All tests follow the same structure
4. **Setup/Teardown**: Proper setup and cleanup in each test

### Test Data Management

1. **Factory Functions**: Use factories for consistent test data
2. **Constants**: Centralized constants for reusability
3. **Mock Objects**: Comprehensive mocking for external dependencies
4. **Clean State**: Each test starts with clean state

### Error Testing

1. **Error Conditions**: All error paths are tested
2. **Error Messages**: Error messages are validated
3. **Error Types**: Error types are verified
4. **Recovery**: Error recovery scenarios are tested

### Performance

1. **Efficiency**: Tests run efficiently without unnecessary delays
2. **Parallel Execution**: Tests can run in parallel where safe
3. **Resource Management**: Proper cleanup of resources
4. **Scalability**: Tests handle large datasets efficiently

## Continuous Integration

The test suite is designed to work well in CI/CD environments:

- **Deterministic**: Tests produce consistent results
- **Fast Execution**: Unit tests complete quickly
- **Clear Output**: Test results are clearly reported
- **No External Dependencies**: Unit tests don't require external services

## Future Enhancements

The testing framework is designed to be extensible:

1. **Additional Components**: Easy to add tests for new features
2. **More Mock Contracts**: Can expand mock contract library
3. **Performance Testing**: Framework supports performance tests
4. **Load Testing**: Can add load testing capabilities
5. **Browser Testing**: Can extend to browser environment testing

## Troubleshooting

### Common Issues

1. **TypeScript Errors**: Ensure all types are properly imported
2. **Test Timeouts**: Increase timeout for slow tests
3. **Mock Issues**: Verify mock setup is correct
4. **Path Issues**: Check file paths are correct for your environment

### Debug Mode

```bash
# Run tests with debug output
DEBUG=hardhat:* npm test

# Run specific test with debugging
npx hardhat test test/unit/core/DiamondsConfig.test.ts --verbose
```

## Conclusion

This comprehensive testing implementation provides:

- **Complete Coverage**: All functionality is thoroughly tested
- **Quality Assurance**: High-quality, maintainable tests
- **Developer Experience**: Easy to run and extend tests
- **Documentation**: Well-documented test patterns and utilities
- **Reliability**: Consistent, reliable test execution

The testing framework ensures the hardhat-diamonds plugin is robust, reliable, and ready for production use.
