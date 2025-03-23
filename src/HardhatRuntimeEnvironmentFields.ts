import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DiamondsUserConfig } from "./type-extensions";

export class HardhatRuntimeEnvironmentFields {
  private hre: HardhatRuntimeEnvironment;
  private diamondsConfig: DiamondsUserConfig;

  constructor(hre: HardhatRuntimeEnvironment) {
    this.hre = hre;
    this.diamondsConfig = this.hre.config.diamonds;
  }

  /**
   * Get the diamonds configuration.
   */
  public getDiamondsConfig(): DiamondsUserConfig {
    return this.diamondsConfig;
  }

  /**
   * Get the configuration for a specific diamond by name.
   * @param diamondName - The name of the diamond.
   */
  public getDiamondConfig(diamondName: string) {
    const config = this.diamondsConfig[diamondName];
    if (!config) {
      throw new Error(`Diamond configuration for "${diamondName}" not found.`);
    }
    return config;
  }
}