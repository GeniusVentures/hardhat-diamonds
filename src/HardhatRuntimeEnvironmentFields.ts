import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DiamondsUserConfig } from "./type-extensions";

export class HardhatRuntimeEnvironmentFields {
  private hre: HardhatRuntimeEnvironment; 
  private diamondsConfig: DiamondsUserConfig;

  constructor(hre: HardhatRuntimeEnvironment) {
    this.hre = hre;
    // Read the diamonds config from the Hardhat config
    this.diamondsConfig = this.hre.config.diamonds;
  }
  
  public getDiamondsConfig(): DiamondsUserConfig {
    return this.diamondsConfig;
  }
}
