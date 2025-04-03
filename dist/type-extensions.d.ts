import "hardhat/types/config";
import { DiamondsPathsConfig } from "@gnus.ai/diamonds";
import { DiamondsConfig } from "./DiamondsConfig";
declare module "hardhat/types/config" {
    interface HardhatUserConfig {
        diamondsConfig?: DiamondsPathsConfig;
    }
    interface HardhatConfig {
        diamondsConfig: DiamondsPathsConfig;
    }
}
declare module "hardhat/types/runtime" {
    interface HardhatRuntimeEnvironment {
        DiamondsConfig: DiamondsConfig;
    }
}
//# sourceMappingURL=type-extensions.d.ts.map