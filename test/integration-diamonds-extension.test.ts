import { expect } from "chai";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

describe.skip("Integration: Hardhat Diamonds Extension", function () {
  const fixtureDir = path.join(
    __dirname,
    "../fixtures/fixture-projects/hardhat-project"
  );
  const configPath = path.join(fixtureDir, "hardhat.config.ts");
  const configFixturePath = path.join(fixtureDir, "hardhat.config.ts.fixture");
  const tsconfigPath = path.join(fixtureDir, "tsconfig.json");
  const tsconfigFixturePath = path.join(fixtureDir, "tsconfig.json.fixture");
  const diamondsConfig = `\n  diamonds: {\n    paths: {\n      IntegrationDiamond: {}\n    }\n  },`;
  const env = {
    ...process.env,
    DEFENDER_API_KEY: "dummy",
    DEFENDER_API_SECRET: "dummy",
  };

  before(function () {
    // Copy fixture files to their proper names
    if (fs.existsSync(configFixturePath)) {
      fs.copyFileSync(configFixturePath, configPath);
    }
    if (fs.existsSync(tsconfigFixturePath)) {
      fs.copyFileSync(tsconfigFixturePath, tsconfigPath);
    }

    // Insert diamonds config into hardhat.config.ts
    if (fs.existsSync(configPath)) {
      let configContent = fs.readFileSync(configPath, "utf8");
      configContent = configContent.replace(
        /(defaultNetwork: "hardhat",)/,
        `$1${diamondsConfig}`
      );
      fs.writeFileSync(configPath, configContent, "utf8");
    }
  });

  after(function () {
    // Clean up test files
    if (fs.existsSync(configPath)) {
      fs.unlinkSync(configPath);
    }
    if (fs.existsSync(tsconfigPath)) {
      fs.unlinkSync(tsconfigPath);
    }
  });

  it("should not throw type errors in hardhat.config.ts", function () {
    // Run tsc in the fixture project
    const tscPath = path.join(
      __dirname,
      "../../..",
      "node_modules",
      ".bin",
      "tsc"
    );
    const result = execSync(`${tscPath} --noEmit`, {
      cwd: fixtureDir,
      stdio: "pipe",
      env,
    }).toString();
    expect(result).to.equal("");
  });

  it("should load diamonds config at runtime", function () {
    // Create a script to check config at runtime
    const scriptPath = path.join(fixtureDir, "checkDiamondsConfig.js");
    fs.writeFileSync(
      scriptPath,
      `const hre = require("hardhat");\nconsole.log(JSON.stringify(hre.config.diamonds));`,
      "utf8"
    );
    const result = execSync(`npx hardhat run checkDiamondsConfig.js`, {
      cwd: fixtureDir,
      stdio: ["pipe", "pipe", "pipe"],
      env,
    }).toString();
    expect(JSON.parse(result)).to.have.property("paths");
    fs.unlinkSync(scriptPath);
  });
});
