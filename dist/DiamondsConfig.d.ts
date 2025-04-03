import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DiamondsPathsConfig } from "@gnus.ai/diamonds";
/**
 * DiamondsConfig class
 */
export declare class DiamondsConfig {
    private hre;
    private diamondsConfig;
    constructor(hre: HardhatRuntimeEnvironment);
    /**
     * Get the diamonds configuration.
     */
    getDiamondsConfig(): DiamondsPathsConfig;
    /**
     * Get the configuration for a specific diamond by name.
     * @param diamondName - The name of the diamond.
     */
    getDiamondConfig(diamondName: string): any;
}
//# sourceMappingURL=DiamondsConfig.d.ts.map