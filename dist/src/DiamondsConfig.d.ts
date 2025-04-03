/**
 * HardhatRuntimeEnvironment class
 */
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DiamondPathsConfig, DiamondsPathsConfig } from "@gnus.ai/diamonds";
export declare class DiamondsConfig {
    private hre;
    diamonds: DiamondsPathsConfig;
    paths: Record<string, DiamondPathsConfig>;
    constructor(hre: HardhatRuntimeEnvironment);
    /**
     * Get the diamonds configuration.
     */
    getDiamondsConfig(): DiamondsPathsConfig;
    /**
      const config = this.diamondsConfig[diamondName] as any; // Ensure type compatibility
     * @param diamondName - The name of the diamond.
     */
    getDiamondConfig(diamondName: string): DiamondPathsConfig;
}
export default DiamondsConfig;
//# sourceMappingURL=DiamondsConfig.d.ts.map