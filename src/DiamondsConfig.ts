/**
 * HardhatRuntimeEnvironment class
 */
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DiamondPathsConfig, DiamondsPathsConfig } from "@gnus.ai/diamonds";

// interface DiamondsPathsConfig extends OriginalDiamondsPathsConfig {
//   [key: string]: any; // Add index signature to allow string indexing
// }

export class DiamondsConfig {
  private hre: HardhatRuntimeEnvironment;
  public diamonds: DiamondsPathsConfig;
  // paths: Record<string, DiamondPathsConfig>;

  constructor(hre: HardhatRuntimeEnvironment) {
    this.hre = hre;
    this.diamonds = this.hre.config.diamonds;
    // this.paths = {};
  }

  // /**
  //  * Get the diamonds configuration.
  //  */
  // public getDiamondsConfig(): DiamondsPathsConfig {
  //   return this.diamonds;
  // }

  /**
    const config = this.diamondsConfig[diamondName] as any; // Ensure type compatibility
   * @param diamondName - The name of the diamond.
   */
  public getDiamondConfig(diamondName: string): DiamondPathsConfig {
    const config = this.diamonds.paths[diamondName];
    if (!config) {
      throw new Error(`Diamond configuration for "${diamondName}" not found.`);
    }
    return config;
  }
}

export default DiamondsConfig;