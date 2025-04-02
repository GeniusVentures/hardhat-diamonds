import { extendConfig, extendEnvironment } from "hardhat/config";
import { HardhatConfig, HardhatUserConfig } from "hardhat/types";
import { lazyObject } from "hardhat/plugins";
import { DiamondsUserConfig } from "./type-extensions";
import { HardhatRuntimeEnvironmentFields } from "./HardhatRuntimeEnvironmentFields";

extendConfig((config: HardhatConfig, userConfig: Readonly<HardhatUserConfig>) => {
  // Set default diamonds config to an empty object if not provided
  console.log('diamonds config:', userConfig.diamonds);
  const defaultDiamondsConfig: DiamondsUserConfig = {
    // Default values for diamonds config
    diamonds: {}
  };
  config.diamonds = {
    ...defaultDiamondsConfig,
    ...userConfig.diamonds,
  };
});

extendEnvironment((hre) => {
  // Attach our helper to the runtime environment under hre.diamonds.
  hre.diamonds = lazyObject(() => new HardhatRuntimeEnvironmentFields(hre));
});

export { DiamondsUserConfig, DiamondConfig } from "./type-extensions";
export { };