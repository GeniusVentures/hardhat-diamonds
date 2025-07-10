import { DiamondPathsConfig, DiamondsPathsConfig } from "diamonds";
/**
 * Factory functions for creating test data and mock objects
 */
export declare class MockFactories {
    /**
     * Creates a basic DiamondPathsConfig for testing
     */
    static createDiamondPathsConfig(overrides?: Partial<DiamondPathsConfig>): DiamondPathsConfig;
    /**
     * Creates a DiamondsPathsConfig with multiple diamonds
     */
    static createDiamondsPathsConfig(diamondNames?: string[], configOverrides?: Record<string, Partial<DiamondPathsConfig>>): DiamondsPathsConfig;
    /**
     * Creates a complex diamonds configuration for testing
     */
    static createComplexDiamondsConfig(): DiamondsPathsConfig;
    /**
     * Creates an empty diamonds configuration
     */
    static createEmptyDiamondsConfig(): DiamondsPathsConfig;
    /**
     * Creates test addresses for mocking
     */
    static createTestAddresses(): {
        diamond: string;
        facet1: string;
        facet2: string;
        owner: string;
    };
    /**
     * Creates test function selectors
     */
    static createTestFunctionSelectors(): {
        test1: string;
        test2: string;
        test3: string;
        diamondCut: string;
        loupe: string;
    };
}
