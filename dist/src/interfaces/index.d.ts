export interface DiamondPathsConfig {
    deploymentsPath?: string;
    contractsPath?: string;
    [key: string]: any;
}
export interface DiamondsPathsConfig {
    paths: Record<string, DiamondPathsConfig>;
    [key: string]: any;
}
