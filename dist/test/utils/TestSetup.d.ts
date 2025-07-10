import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DiamondsPathsConfig } from "diamonds";
import { DiamondsConfig } from "../../src/DiamondsConfig";
/**
 * Test setup utilities for hardhat-diamonds tests
 */
export declare class TestSetup {
    /**
     * Creates a mock HardhatRuntimeEnvironment for testing
     */
    static createMockHRE(diamondsConfig?: DiamondsPathsConfig): HardhatRuntimeEnvironment;
    /**
     * Creates a test DiamondsConfig instance
     */
    static createDiamondsConfig(diamondsConfig?: DiamondsPathsConfig): DiamondsConfig;
    /**
     * Sets up common test environment
     */
    static setupTestEnvironment(): void;
    /**
     * Cleanup after tests
     */
    static cleanup(): void;
}
