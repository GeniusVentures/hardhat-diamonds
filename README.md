# hardhat-diamonds

[![npm version](https://badge.fury.io/js/hardhat-diamonds.svg)](https://badge.fury.io/js/hardhat-diamonds)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![Hardhat](https://img.shields.io/badge/Built%20for-Hardhat-f39c12.svg)](https://hardhat.org/)

A Hardhat Extension for Diamonds node module, Tools for deploying and interfacing with ERC-2535 Diamond Proxies in Hardhat projects.

## Overview

`hardhat-diamonds` is a Hardhat plugin that provides scaffolding for working with the [ERC-2535 Diamond Proxy Standard](https://eips.ethereum.org/EIPS/eip-2535). This plugin extends Hardhat with configuration management and utilities specifically designed for Diamond smart contract development, deployment, and upgrades.

This plugin works in conjunction with the [`diamonds`](https://github.com/GeniusVentures/diamonds) module to provide a complete Diamond development toolkit.

## Features

- **Diamond Configuration Management**: Centralized configuration for multiple Diamond contracts
- **Type-Safe Integration**: Full TypeScript support with proper type definitions
- **Hardhat Integration**: Seamless integration with existing Hardhat workflows
- **ERC-2535 Compliance**: Built specifically for the Diamond Proxy Standard

## Installation

Install the plugin and its peer dependency:

```bash
npm install --save-dev hardhat-diamonds diamonds
```

Or with yarn:

```bash
yarn add --dev hardhat-diamonds diamonds
```

## Setup

Add the plugin to your `hardhat.config.ts` or `hardhat.config.js`:

```typescript
import "hardhat-diamonds";

// Rest of your Hardhat configuration
```

## Configuration

Configure your Diamond contracts in your Hardhat config:

```typescript
import { HardhatUserConfig } from "hardhat/config";
import "hardhat-diamonds";

const config: HardhatUserConfig = {
  // ... other Hardhat configuration
  diamonds: {
    paths: {
      MyDiamond: {
        // Diamond-specific configuration
        // Refer to diamonds documentation for available options
      },
      AnotherDiamond: {
        // Configuration for another Diamond contract
      },
    },
  },
};

export default config;
```

## Usage

Once configured, the plugin extends the Hardhat Runtime Environment with a `diamonds` object:

```typescript
import { task } from "hardhat/config";

task("diamond-info", "Get diamond configuration")
  .addParam("name", "Diamond name")
  .setAction(async (taskArgs, hre) => {
    const config = hre.diamonds.getDiamondConfig(taskArgs.name);
    console.log("Diamond configuration:", config);
  });
```

### API Reference

#### `hre.diamonds`

The main interface for accessing Diamond functionality.

##### `getDiamondConfig(diamondName: string): DiamondPathsConfig`

Retrieves the configuration for a specific Diamond contract.

**Parameters:**

- `diamondName`: The name of the Diamond as defined in the configuration

**Returns:**

- `DiamondPathsConfig`: The configuration object for the specified Diamond

**Throws:**

- `Error`: If the Diamond configuration is not found

**Example:**

```typescript
const diamondConfig = hre.diamonds.getDiamondConfig("MyDiamond");
```

## Project Structure

```bash
hardhat-diamonds/
├── src/
│   ├── index.ts              # Main plugin entry point
│   ├── DiamondsConfig.ts     # Configuration management class
│   └── type-extensions.ts    # Hardhat type extensions
├── test/                     # Test files
├── dist/                     # Compiled output
└── package.json
```

## Development

### Prerequisites

- Node.js >= 14
- TypeScript >= 4.0
- Hardhat >= 2.0.0

### Building

```bash
npm run build
```

### Testing

```bash
npm test
```

### Linting

```bash
npm run lint
npm run lint:fix
```

## Dependencies

### Peer Dependencies

- `hardhat`: ^2.0.0
- `diamonds`: Compatible version for Diamond utilities

### Development Dependencies

- TypeScript 4.x
- Mocha for testing
- ESLint and Prettier for code quality

## Related Projects

- [`diamonds`](https://github.com/GeniusVentures/diamonds): Core Diamond utilities and types
- [ERC-2535 Diamond Standard](https://eips.ethereum.org/EIPS/eip-2535): The official Diamond standard specification

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For questions and support, please refer to:

- [GitHub Issues](https://github.com/GeniusVentures/hardhat-diamonds/issues)
- [ERC-2535 Documentation](https://eips.ethereum.org/EIPS/eip-2535)

## Authors

- Am0rfu5

---

**Keywords**: ethereum, smart-contracts, hardhat, hardhat-plugin, diamond, diamond-proxy, diamond-upgradeable, blockchain, ERC-2535
