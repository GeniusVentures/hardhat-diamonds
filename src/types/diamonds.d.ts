// Type declarations for the diamonds package
// This is a temporary type declaration file to enable TypeScript compilation

export interface DiamondPathsConfig {
  deploymentsPath?: string;
  contractsPath?: string;
  [key: string]: any;
}

export interface DiamondsPathsConfig {
  paths: Record<string, DiamondPathsConfig>;
  [key: string]: any;
}
