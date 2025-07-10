import { DiamondsConfig } from "../../src/DiamondsConfig";
import { DiamondPathsConfig, DiamondsPathsConfig } from "diamonds";
/**
 * Custom assertion helpers for diamond-specific validations
 */
export declare class AssertionHelpers {
    /**
     * Asserts that a DiamondsConfig instance is properly configured
     */
    static assertDiamondsConfigValid(config: DiamondsConfig): void;
    /**
     * Asserts that a diamond configuration exists and is valid
     */
    static assertDiamondConfigExists(config: DiamondsConfig, diamondName: string): void;
    /**
     * Asserts that a diamond configuration does not exist
     */
    static assertDiamondConfigNotExists(config: DiamondsConfig, diamondName: string): void;
    /**
     * Asserts that two DiamondPathsConfig objects are equal
     */
    static assertDiamondPathsConfigEqual(actual: DiamondPathsConfig, expected: DiamondPathsConfig): void;
    /**
     * Asserts that a DiamondsPathsConfig contains specific diamond names
     */
    static assertContainsDiamonds(config: DiamondsPathsConfig, diamondNames: string[]): void;
    /**
     * Asserts that a DiamondsPathsConfig does not contain specific diamond names
     */
    static assertNotContainsDiamonds(config: DiamondsPathsConfig, diamondNames: string[]): void;
    /**
     * Asserts that a configuration is empty
     */
    static assertEmptyDiamondsConfig(config: DiamondsPathsConfig): void;
    /**
     * Asserts that a configuration has a specific number of diamonds
     */
    static assertDiamondsCount(config: DiamondsPathsConfig, expectedCount: number): void;
    /**
     * Asserts that an error matches expected patterns
     */
    static assertError(fn: () => void, expectedMessage?: string | RegExp, expectedType?: new (...args: any[]) => Error): void;
    /**
     * Asserts that a function throws an error with a specific message
     */
    static assertThrowsWithMessage(fn: () => void, message: string): void;
    /**
     * Asserts that a value is a valid Ethereum address
     */
    static assertValidAddress(address: string): void;
    /**
     * Asserts that a value is a valid function selector
     */
    static assertValidFunctionSelector(selector: string): void;
}
