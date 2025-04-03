"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiamondsConfig = void 0;
/**
 * DiamondsConfig class
 */
class DiamondsConfig {
    constructor(hre) {
        this.hre = hre;
        this.diamondsConfig = this.hre.config.diamondsConfig;
    }
    /**
     * Get the diamonds configuration.
     */
    getDiamondsConfig() {
        return this.diamondsConfig;
    }
    /**
     * Get the configuration for a specific diamond by name.
     * @param diamondName - The name of the diamond.
     */
    getDiamondConfig(diamondName) {
        const config = this.diamondsConfig[diamondName];
        if (!config) {
            throw new Error(`Diamond configuration for "${diamondName}" not found.`);
        }
        return config;
    }
}
exports.DiamondsConfig = DiamondsConfig;
//# sourceMappingURL=DiamondsConfig.js.map