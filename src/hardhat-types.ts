// Hardhat type extensions for the diamonds plugin
import { DiamondsPathsConfig } from "./interfaces";
import { DiamondsConfig } from "./DiamondsConfig";

declare module "hardhat/types/config" {
  interface HardhatUserConfig {
    diamonds?: DiamondsPathsConfig;
  }

  interface HardhatConfig {
    diamonds: DiamondsPathsConfig;
  }
}

declare module "hardhat/types/runtime" {
  interface HardhatRuntimeEnvironment {
    diamonds: DiamondsConfig;
  }
}
