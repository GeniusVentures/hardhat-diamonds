"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HardhatRuntimeEnvironmentFields = void 0;
class HardhatRuntimeEnvironmentFields {
    constructor(hre) {
        this.hre = hre;
        this.diamondsConfig = this.hre.config.diamonds;
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
exports.HardhatRuntimeEnvironmentFields = HardhatRuntimeEnvironmentFields;
//# sourceMappingURL=HardhatRuntimeEnvironmentFields.js.map