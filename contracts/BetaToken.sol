// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BetaToken is ERC20 {
    constructor() ERC20("Beta Token", "BETA") {
        _mint(msg.sender, 1000000 * 10**18); // 1M tokens
    }
    
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}