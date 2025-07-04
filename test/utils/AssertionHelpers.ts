import { expect } from "chai";
import { DiamondsConfig } from "../../src/DiamondsConfig";
import { DiamondPathsConfig, DiamondsPathsConfig } from "@gnus.ai/diamonds";

/**
 * Custom assertion helpers for diamond-specific validations
 */
export class AssertionHelpers {
  /**
   * Asserts that a DiamondsConfig instance is properly configured
   */
  static assertDiamondsConfigValid(config: DiamondsConfig): void {
    expect(config).to.be.instanceOf(DiamondsConfig);
    expect(config.diamonds).to.be.an("object");
    expect(config.diamonds).to.have.property("paths");
    expect(config.diamonds.paths).to.be.an("object");
  }

  /**
   * Asserts that a diamond configuration exists and is valid
   */
  static assertDiamondConfigExists(
    config: DiamondsConfig,
    diamondName: string
  ): void {
    expect(() => config.getDiamondConfig(diamondName)).to.not.throw();
    const diamondConfig = config.getDiamondConfig(diamondName);
    expect(diamondConfig).to.be.an("object");
  }

  /**
   * Asserts that a diamond configuration does not exist
   */
  static assertDiamondConfigNotExists(
    config: DiamondsConfig,
    diamondName: string
  ): void {
    expect(() => config.getDiamondConfig(diamondName))
      .to.throw(Error)
      .with.property("message")
      .that.includes(`Diamond configuration for "${diamondName}" not found`);
  }

  /**
   * Asserts that two DiamondPathsConfig objects are equal
   */
  static assertDiamondPathsConfigEqual(
    actual: DiamondPathsConfig,
    expected: DiamondPathsConfig
  ): void {
    expect(actual).to.deep.equal(expected);
  }

  /**
   * Asserts that a DiamondsPathsConfig contains specific diamond names
   */
  static assertContainsDiamonds(
    config: DiamondsPathsConfig,
    diamondNames: string[]
  ): void {
    expect(config.paths).to.be.an("object");
    diamondNames.forEach(name => {
      expect(config.paths).to.have.property(name);
    });
  }

  /**
   * Asserts that a DiamondsPathsConfig does not contain specific diamond names
   */
  static assertNotContainsDiamonds(
    config: DiamondsPathsConfig,
    diamondNames: string[]
  ): void {
    expect(config.paths).to.be.an("object");
    diamondNames.forEach(name => {
      expect(config.paths).to.not.have.property(name);
    });
  }

  /**
   * Asserts that a configuration is empty
   */
  static assertEmptyDiamondsConfig(config: DiamondsPathsConfig): void {
    expect(config.paths).to.be.an("object");
    expect(Object.keys(config.paths)).to.have.length(0);
  }

  /**
   * Asserts that a configuration has a specific number of diamonds
   */
  static assertDiamondsCount(config: DiamondsPathsConfig, expectedCount: number): void {
    expect(config.paths).to.be.an("object");
    expect(Object.keys(config.paths)).to.have.length(expectedCount);
  }

  /**
   * Asserts that an error matches expected patterns
   */
  static assertError(
    fn: () => void,
    expectedMessage?: string | RegExp,
    expectedType?: new (...args: any[]) => Error
  ): void {
    let thrownError: Error | undefined;

    try {
      fn();
    } catch (error) {
      thrownError = error as Error;
    }

    expect(thrownError).to.exist;

    if (expectedType) {
      expect(thrownError).to.be.instanceOf(expectedType);
    }

    if (expectedMessage) {
      if (typeof expectedMessage === "string") {
        expect(thrownError!.message).to.include(expectedMessage);
      } else {
        expect(thrownError!.message).to.match(expectedMessage);
      }
    }
  }

  /**
   * Asserts that a function throws an error with a specific message
   */
  static assertThrowsWithMessage(
    fn: () => void,
    message: string
  ): void {
    expect(fn).to.throw(Error).with.property("message").that.includes(message);
  }

  /**
   * Asserts that a value is a valid Ethereum address
   */
  static assertValidAddress(address: string): void {
    expect(address).to.be.a("string");
    expect(address).to.match(/^0x[a-fA-F0-9]{40}$/);
  }

  /**
   * Asserts that a value is a valid function selector
   */
  static assertValidFunctionSelector(selector: string): void {
    expect(selector).to.be.a("string");
    expect(selector).to.match(/^0x[a-fA-F0-9]{8}$/);
  }
}
