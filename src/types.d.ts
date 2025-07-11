// Local hardhat type declarations for standalone TypeScript compilation
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
    [key: string]: any;
  }

  export interface HardhatUserConfig {
    [key: string]: any;
  }

  export interface HardhatRuntimeEnvironment {
    config: HardhatConfig;
    [key: string]: any;
  }
}

declare module "hardhat/types/config" {
  interface HardhatUserConfig {
    [key: string]: any;
  }

  interface HardhatConfig {
    [key: string]: any;
  }
}

declare module "hardhat/types/runtime" {
  interface HardhatRuntimeEnvironment {
    [key: string]: any;
  }
}

declare module "hardhat/plugins" {
  export function lazyObject<T>(objectCreator: () => T): T;
}
