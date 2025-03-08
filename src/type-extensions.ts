import "hardhat-multichain";
import "hardhat/types/config";
import "hardhat/types/runtime";

import { HardhatRuntimeEnvironmentFields } from "./HardhatRuntimeEnvironmentFields";

declare module "hardhat/types/config" {
  // This is an extension to one of the Hardhat config values.
  export interface ProjectPathsUserConfig {
    newPath?: string;
  }

  // We also extend the ProjectPathsConfig type, which represents the `paths`
  // property after it has been resolved.  This is the type used during the
  // execution of tasks, tests, and scripts.
  // This is part of the HardhatConfig type; normally, you don't want things to
  // be optional here, as you can apply default values using the extendConfig
  // function.
  export interface ProjectPathsConfig {
    newPath: string;
  }
}

declare module "hardhat/types/runtime" {
  // This field is available in tasks' actions, scripts, and tests.
  export interface HardhatRuntimeEnvironment {
    example: HardhatRuntimeEnvironmentFields;
  }
}
