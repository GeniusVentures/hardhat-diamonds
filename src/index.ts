import { extendConfig, extendEnvironment } from "hardhat/config";
import { HardhatConfig, HardhatUserConfig } from "hardhat/types";
import { lazyObject } from "hardhat/plugins";
import "./type-extensions";
import { DiamondsUserConfig } from "./type-extensions";
import { HardhatRuntimeEnvironmentFields } from "./HardhatRuntimeEnvironmentFields";

extendConfig((config: HardhatConfig, userConfig: Readonly<HardhatUserConfig>) => {
  // Set default diamonds config to an empty object if not provided
  const defaultDiamondsConfig: DiamondsUserConfig = {};
  config.diamonds = userConfig.diamonds ?? defaultDiamondsConfig;
});

extendEnvironment((hre) => {
  // Attach our helper to the runtime environment under hre.diamonds.
  hre.diamonds = lazyObject(() => new HardhatRuntimeEnvironmentFields(hre));
});
