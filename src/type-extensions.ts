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

declare module "hardhat/types/runtime" {
  export interface HardhatRuntimeEnvironment {
    diamonds: HardhatRuntimeEnvironmentFields;
  }
}

export interface DiamondConfig {
  contractsPath?: string;
  deploymentsPath?: string;
  callbacksPath?: string;
}

export interface DiamondsUserConfig {
  [diamondName: string]: DiamondConfig;
}