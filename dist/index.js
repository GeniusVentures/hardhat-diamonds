"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("hardhat/config");
const plugins_1 = require("hardhat/plugins");
const HardhatRuntimeEnvironmentFields_1 = require("./HardhatRuntimeEnvironmentFields");
(0, config_1.extendConfig)((config, userConfig) => {
    // Set default diamonds config to an empty object if not provided
    console.log('diamonds config:', userConfig.diamonds);
    const defaultDiamondsConfig = {
        // Default values for diamonds config
        diamonds: {}
    };
    config.diamonds = {
        ...defaultDiamondsConfig,
        ...userConfig.diamonds,
    };
});
(0, config_1.extendEnvironment)((hre) => {
    // Attach our helper to the runtime environment under hre.diamonds.
    hre.diamonds = (0, plugins_1.lazyObject)(() => new HardhatRuntimeEnvironmentFields_1.HardhatRuntimeEnvironmentFields(hre));
});
//# sourceMappingURL=index.js.map