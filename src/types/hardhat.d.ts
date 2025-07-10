// Global type declarations for hardhat modules
// This file ensures TypeScript can find hardhat types when running `tsc` directly

declare module "hardhat/config" {
  export function extendConfig(
    configExtender: (config: any, userConfig: any) => void
  ): void;
  export function extendEnvironment(
    environmentExtender: (hre: any) => void
  ): void;
}

declare module "hardhat/types" {
  export interface HardhatConfig {
    diamonds?: any;
    [key: string]: any;
  }

  export interface HardhatUserConfig {
    diamonds?: any;
    [key: string]: any;
  }

  export interface HardhatRuntimeEnvironment {
    config: HardhatConfig;
    diamonds?: any;
    [key: string]: any;
  }
}

declare module "hardhat/plugins" {
  export function lazyObject<T>(objectCreator: () => T): T;
}

declare module "hardhat/types/config" {
  interface HardhatUserConfig {
    diamonds?: import("../types/diamonds").DiamondsPathsConfig;
  }

  interface HardhatConfig {
    diamonds: import("../types/diamonds").DiamondsPathsConfig;
  }
}

declare module "hardhat/types/runtime" {
  interface HardhatRuntimeEnvironment {
    diamonds: import("../DiamondsConfig").DiamondsConfig;
  }
}
