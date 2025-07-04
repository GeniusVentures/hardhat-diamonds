// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title MockTestFacet
 * @dev A simple facet for testing diamond functionality
 */
contract MockTestFacet {
    event TestEvent(string message, uint256 value);
    
    uint256 private testValue;
    mapping(address => uint256) private userValues;

    function testFunction1() external pure returns (string memory) {
        return "Test function 1 called";
    }

    function testFunction2(uint256 _value) external returns (uint256) {
        testValue = _value;
        emit TestEvent("testFunction2 called", _value);
        return _value * 2;
    }

    function testFunction3(string calldata _message) external pure returns (string memory) {
        return string(abi.encodePacked("Echo: ", _message));
    }

    function setUserValue(uint256 _value) external {
        userValues[msg.sender] = _value;
        emit TestEvent("User value set", _value);
    }

    function getUserValue(address _user) external view returns (uint256) {
        return userValues[_user];
    }

    function getTestValue() external view returns (uint256) {
        return testValue;
    }

    function complexFunction(
        uint256 _number,
        string calldata _text,
        bool _flag
    ) external returns (bytes memory) {
        if (_flag) {
            testValue = _number;
            emit TestEvent(_text, _number);
            return abi.encode(_number, _text, _flag);
        } else {
            return abi.encode(0, "false", false);
        }
    }

    function payableFunction() external payable returns (uint256) {
        emit TestEvent("Payable function called", msg.value);
        return msg.value;
    }

    function revertingFunction() external pure {
        revert("This function always reverts");
    }

    function viewFunction(uint256 _input) external pure returns (uint256) {
        return _input + 42;
    }

    // Function that returns multiple values
    function multiReturnFunction(uint256 _input) external pure returns (uint256, string memory, bool) {
        return (_input * 2, "success", true);
    }

    // Function with array parameters
    function arrayFunction(uint256[] calldata _numbers) external pure returns (uint256) {
        uint256 sum = 0;
        for (uint256 i = 0; i < _numbers.length; i++) {
            sum += _numbers[i];
        }
        return sum;
    }

    // Function with struct parameter
    struct TestStruct {
        uint256 id;
        string name;
        bool active;
    }

    function structFunction(TestStruct calldata _struct) external pure returns (bool) {
        return _struct.active && _struct.id > 0 && bytes(_struct.name).length > 0;
    }
}
