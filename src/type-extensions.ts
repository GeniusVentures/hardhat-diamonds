import "hardhat/types/config";
import "hardhat/types/runtime";
import { HardhatRuntimeEnvironmentFields } from "./HardhatRuntimeEnvironmentFields";

declare module "hardhat/types/config" {
  export interface HardhatUserConfig {
    // Use "diamonds" as the config key
    diamonds?: DiamondsUserConfig;
  }

  export interface HardhatConfig {
    diamonds: DiamondsUserConfig;
  }
}

declare module "hardhat/types/runtime" {
  export interface HardhatRuntimeEnvironment {
    // Expose our plugin helper on hre as "diamonds"
    diamonds: HardhatRuntimeEnvironmentFields;
  }
}

export interface DiamondConfig {
  path?: string;
  deployments_path?: string;
  facets_path?: string;
  include?: string[];
  exclude?: string[];
}

/**
 * The diamonds configuration should be a record where each key is a diamond name
 * and the value is its configuration.
 */
export interface DiamondsUserConfig {
  [diamondName: string]: DiamondConfig;
}
