import { DiamondsPathsConfig } from "@gnus.ai/diamonds";
import "hardhat/types/config";
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
        diamonds: DiamondsPathsConfig;
    }
}
//# sourceMappingURL=type-extensions.d.ts.map