import { DiamondsPathsConfig } from "@gnus.ai/diamonds";
import "hardhat/types/config";

declare module "hardhat/types/config" {
  export interface HardhatUserConfig {
    diamonds?: DiamondsPathsConfig;
  }

  export interface HardhatConfig {
    diamonds: DiamondsPathsConfig;
  }
}

// Extend HardhatRuntimeEnvironment to include diamondsConfig
declare module "hardhat/types/runtime" {
  interface HardhatRuntimeEnvironment {
    diamonds: DiamondsPathsConfig;
  }
}
