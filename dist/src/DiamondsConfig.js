"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiamondsConfig = void 0;
// interface DiamondsPathsConfig extends OriginalDiamondsPathsConfig {
//   [key: string]: any; // Add index signature to allow string indexing
// }
class DiamondsConfig {
    constructor(hre) {
        this.hre = hre;
        this.diamonds = this.hre.config.diamonds;
        this.paths = {};
    }
    /**
     * Get the diamonds configuration.
     */
    getDiamondsConfig() {
        return this.diamonds;
    }
    /**
      const config = this.diamondsConfig[diamondName] as any; // Ensure type compatibility
     * @param diamondName - The name of the diamond.
     */
    getDiamondConfig(diamondName) {
        const config = this.diamonds.paths[diamondName];
        if (!config) {
            throw new Error(`Diamond configuration for "${diamondName}" not found.`);
        }
        return config;
    }
}
exports.DiamondsConfig = DiamondsConfig;
exports.default = DiamondsConfig;
//# sourceMappingURL=DiamondsConfig.js.map