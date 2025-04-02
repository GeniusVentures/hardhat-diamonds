import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DiamondsUserConfig } from "./type-extensions";
export declare class HardhatRuntimeEnvironmentFields {
    private hre;
    private diamondsConfig;
    constructor(hre: HardhatRuntimeEnvironment);
    /**
     * Get the diamonds configuration.
     */
    getDiamondsConfig(): DiamondsUserConfig;
    /**
     * Get the configuration for a specific diamond by name.
     * @param diamondName - The name of the diamond.
     */
    getDiamondConfig(diamondName: string): import("./type-extensions").DiamondConfig;
}
//# sourceMappingURL=HardhatRuntimeEnvironmentFields.d.ts.map