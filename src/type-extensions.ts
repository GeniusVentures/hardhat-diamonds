import "hardhat/types/config";
import "hardhat/types/runtime";
import { HardhatRuntimeEnvironmentFields } from "./HardhatRuntimeEnvironmentFields";

declare module "hardhat/types/config" {
  export interface HardhatUserConfig {
    diamonds?: DiamondsUserConfig;
  }

  export interface HardhatConfig {
    diamonds: DiamondsUserConfig;
  }
}

// declare module "hardhat/types/runtime" {
//   export interface HardhatRuntimeEnvironment {
//     diamonds: HardhatRuntimeEnvironmentFields;
//   }
// }

export interface DiamondConfig {
  path?: string;
  deployments_path?: string;
  facets_path?: string;
  include?: string[];
  exclude?: string[];
}

export interface DiamondsUserConfig {
  [diamondName: string]: DiamondConfig;
}