import "hardhat/types/config";
import "hardhat/types/runtime";
import { HardhatRuntimeEnvironmentFields } from "./HardhatRuntimeEnvironmentFields";
declare module "hardhat/types/config" {
    interface HardhatUserConfig {
        diamonds?: DiamondsUserConfig;
    }
    interface HardhatConfig {
        diamonds: DiamondsUserConfig;
    }
}
declare module "hardhat/types/runtime" {
    interface HardhatRuntimeEnvironment {
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
//# sourceMappingURL=type-extensions.d.ts.map