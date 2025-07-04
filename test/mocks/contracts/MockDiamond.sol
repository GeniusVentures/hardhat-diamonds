// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title MockDiamond
 * @dev A simple mock diamond contract for testing purposes
 */
contract MockDiamond {
    struct FacetAddressAndSelectorPosition {
        address facetAddress;
        uint16 selectorPosition;
    }

    struct FacetAddressAndPosition {
        address facetAddress;
        uint16 functionSelectorPosition;
    }

    mapping(bytes4 => FacetAddressAndSelectorPosition) internal selectorToFacetAndPosition;
    bytes4[] internal functionSelectors;
    mapping(address => FacetAddressAndPosition) internal facetAddressAndPosition;
    address[] internal facetAddressList;

    event DiamondCut(FacetCut[] _diamondCut, address _init, bytes _calldata);

    struct FacetCut {
        address facetAddress;
        FacetCutAction action;
        bytes4[] functionSelectors;
    }

    enum FacetCutAction {
        Add,
        Replace,
        Remove
    }

    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function diamondCut(
        FacetCut[] calldata _diamondCut,
        address _init,
        bytes calldata _calldata
    ) external onlyOwner {
        for (uint256 i = 0; i < _diamondCut.length; i++) {
            FacetCut memory cut = _diamondCut[i];
            if (cut.action == FacetCutAction.Add) {
                _addFunctions(cut.facetAddress, cut.functionSelectors);
            } else if (cut.action == FacetCutAction.Replace) {
                _replaceFunctions(cut.facetAddress, cut.functionSelectors);
            } else if (cut.action == FacetCutAction.Remove) {
                _removeFunctions(cut.facetAddress, cut.functionSelectors);
            }
        }

        emit DiamondCut(_diamondCut, _init, _calldata);

        if (_init != address(0)) {
            (bool success, bytes memory error) = _init.delegatecall(_calldata);
            if (!success) {
                if (error.length > 0) {
                    revert(string(error));
                } else {
                    revert("Diamond initialization failed");
                }
            }
        }
    }

    function _addFunctions(address _facetAddress, bytes4[] memory _functionSelectors) internal {
        require(_functionSelectors.length > 0, "No selectors to add");
        require(_facetAddress != address(0), "Add function: facet can't be address(0)");
        
        uint16 selectorPosition = uint16(functionSelectors.length);
        if (facetAddressAndPosition[_facetAddress].facetAddress == address(0)) {
            facetAddressAndPosition[_facetAddress] = FacetAddressAndPosition(_facetAddress, selectorPosition);
            facetAddressList.push(_facetAddress);
        }

        for (uint256 i = 0; i < _functionSelectors.length; i++) {
            bytes4 selector = _functionSelectors[i];
            address oldFacetAddress = selectorToFacetAndPosition[selector].facetAddress;
            require(oldFacetAddress == address(0), "Function already exists");
            
            selectorToFacetAndPosition[selector] = FacetAddressAndSelectorPosition(_facetAddress, selectorPosition);
            functionSelectors.push(selector);
            selectorPosition++;
        }
    }

    function _replaceFunctions(address _facetAddress, bytes4[] memory _functionSelectors) internal {
        require(_functionSelectors.length > 0, "No selectors to replace");
        require(_facetAddress != address(0), "Replace function: facet can't be address(0)");

        for (uint256 i = 0; i < _functionSelectors.length; i++) {
            bytes4 selector = _functionSelectors[i];
            address oldFacetAddress = selectorToFacetAndPosition[selector].facetAddress;
            require(oldFacetAddress != address(0), "Function doesn't exist");
            require(oldFacetAddress != _facetAddress, "Replace function: same facet");
            
            selectorToFacetAndPosition[selector].facetAddress = _facetAddress;
        }
    }

    function _removeFunctions(address _facetAddress, bytes4[] memory _functionSelectors) internal {
        require(_functionSelectors.length > 0, "No selectors to remove");
        
        for (uint256 i = 0; i < _functionSelectors.length; i++) {
            bytes4 selector = _functionSelectors[i];
            FacetAddressAndSelectorPosition memory oldFacetAddressAndSelectorPosition = selectorToFacetAndPosition[selector];
            require(oldFacetAddressAndSelectorPosition.facetAddress != address(0), "Function doesn't exist");
            require(oldFacetAddressAndSelectorPosition.facetAddress == _facetAddress, "Remove function: wrong facet");
            
            uint256 selectorPosition = oldFacetAddressAndSelectorPosition.selectorPosition;
            uint256 lastSelectorPosition = functionSelectors.length - 1;
            
            if (selectorPosition != lastSelectorPosition) {
                bytes4 lastSelector = functionSelectors[lastSelectorPosition];
                functionSelectors[selectorPosition] = lastSelector;
                selectorToFacetAndPosition[lastSelector].selectorPosition = uint16(selectorPosition);
            }
            
            functionSelectors.pop();
            delete selectorToFacetAndPosition[selector];
        }
    }

    // Diamond Loupe functions
    function facets() external view returns (Facet[] memory facets_) {
        uint256 numFacets = facetAddressList.length;
        facets_ = new Facet[](numFacets);
        
        for (uint256 i = 0; i < numFacets; i++) {
            address facetAddr = facetAddressList[i];
            facets_[i].facetAddress = facetAddr;
            facets_[i].functionSelectors = facetFunctionSelectors(facetAddr);
        }
    }

    function facetFunctionSelectors(address _facet) public view returns (bytes4[] memory facetFunctionSelectors_) {
        uint256 numSelectors = 0;
        uint256 selectorCount = functionSelectors.length;
        
        // Count selectors for this facet
        for (uint256 i = 0; i < selectorCount; i++) {
            if (selectorToFacetAndPosition[functionSelectors[i]].facetAddress == _facet) {
                numSelectors++;
            }
        }
        
        facetFunctionSelectors_ = new bytes4[](numSelectors);
        uint256 selectorIndex = 0;
        
        // Add selectors for this facet
        for (uint256 i = 0; i < selectorCount; i++) {
            bytes4 selector = functionSelectors[i];
            if (selectorToFacetAndPosition[selector].facetAddress == _facet) {
                facetFunctionSelectors_[selectorIndex] = selector;
                selectorIndex++;
            }
        }
    }

    function facetAddresses() external view returns (address[] memory facetAddresses_) {
        facetAddresses_ = facetAddressList;
    }

    function facetAddress(bytes4 _functionSelector) external view returns (address facetAddress_) {
        facetAddress_ = selectorToFacetAndPosition[_functionSelector].facetAddress;
    }

    struct Facet {
        address facetAddress;
        bytes4[] functionSelectors;
    }

    // EIP-165 supportsInterface
    function supportsInterface(bytes4 _interfaceId) external pure returns (bool) {
        return _interfaceId == type(IERC165).interfaceId || 
               _interfaceId == type(IDiamondCut).interfaceId ||
               _interfaceId == type(IDiamondLoupe).interfaceId;
    }

    fallback() external payable {
        address facet = selectorToFacetAndPosition[msg.sig].facetAddress;
        require(facet != address(0), "Function does not exist");
        
        assembly {
            calldatacopy(0, 0, calldatasize())
            let result := delegatecall(gas(), facet, 0, calldatasize(), 0, 0)
            returndatacopy(0, 0, returndatasize())
            switch result
            case 0 { revert(0, returndatasize()) }
            default { return(0, returndatasize()) }
        }
    }

    receive() external payable {}
}

interface IERC165 {
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}

interface IDiamondCut {
    enum FacetCutAction {Add, Replace, Remove}
    
    struct FacetCut {
        address facetAddress;
        FacetCutAction action;
        bytes4[] functionSelectors;
    }

    function diamondCut(
        FacetCut[] calldata _diamondCut,
        address _init,
        bytes calldata _calldata
    ) external;

    event DiamondCut(FacetCut[] _diamondCut, address _init, bytes _calldata);
}

interface IDiamondLoupe {
    struct Facet {
        address facetAddress;
        bytes4[] functionSelectors;
    }

    function facets() external view returns (Facet[] memory facets_);
    function facetFunctionSelectors(address _facet) external view returns (bytes4[] memory facetFunctionSelectors_);
    function facetAddresses() external view returns (address[] memory facetAddresses_);
    function facetAddress(bytes4 _functionSelector) external view returns (address facetAddress_);
}
