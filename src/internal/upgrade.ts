// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { debug } from 'debug';
import {
  FacetToDeployInfo,
  FacetDeployedInfo,
  writeDeployedInfo,
  dc,
  INetworkDeployInfo,
} from './common';
// TODO these need to be configured and changed to .json docs
import { deployments } from './deployments';
import { Facets, LoadFacetDeployments } from './facets';
import {
  afterDeployCallbacks,
  deployAndInitDiamondFacets,
  deployExternalLibraries,
  deployFuncSelectors,
} from './deploy';
import hre from 'hardhat';
import { ethers } from 'hardhat';
import fs from 'fs';
import util from 'util';
const log: debug.Debugger = debug('GNUSUpgrade:log');

// @ts-ignore
log.color = '158';

export async function GetUpdatedFacets(
  facetsDeployed: FacetDeployedInfo,
): Promise<FacetToDeployInfo> {
  const updatedFacetsToDeploy: FacetToDeployInfo = {};

  for (const name in Facets) {
    updatedFacetsToDeploy[name] = Facets[name];
  }
  return updatedFacetsToDeploy;
}

export async function attachGNUSDiamond(networkDeployInfo: INetworkDeployInfo) {
  // deploy DiamondCutFacet
  const DiamondCutFacet = await ethers.getContractFactory('DiamondCutFacet');
  dc.DiamondCutFacet = DiamondCutFacet.attach(
    networkDeployInfo.FacetDeployedInfo.DiamondCutFacet.address!,
  );

  // deploy Diamond
  const diamondAddress = networkDeployInfo.DiamondAddress;
  dc._GeniusDiamond = (
    await ethers.getContractFactory('contracts/gnus-ai/GeniusDiamond.sol:GeniusDiamond')
  ).attach(diamondAddress);
  dc.GeniusDiamond = (
    await ethers.getContractFactory('hardhat-diamond-abi/HardhatDiamondABI.sol:GeniusDiamond')
  ).attach(diamondAddress);

  log(`Diamond attached ${diamondAddress}`);
}

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  if (require.main === module) {
    debug.enable('GNUS.*:log');
    const networkName = hre.network.name;
    if (networkName in deployments) {
      const deployInfo = deployments[networkName];
      await LoadFacetDeployments();
      const updatedFacetsToDeploy = await GetUpdatedFacets(deployInfo.FacetDeployedInfo);
      log(util.inspect(updatedFacetsToDeploy));
      await attachGNUSDiamond(deployInfo);
      if (!deployInfo.ExternalLibraries) await deployExternalLibraries(deployInfo);
      await deployAndInitDiamondFacets(deployInfo, updatedFacetsToDeploy);
      log(`Contract address deployed is ${deployInfo.DiamondAddress}`);
      // hardhat is non-sticky testing.
      if (networkName !== 'hardhat') {
        writeDeployedInfo(deployments);
      }
    } else {
      log(`No deployments found to attach to for ${networkName}, aborting.`);
    }
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
