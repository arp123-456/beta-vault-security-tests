// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title BetaVault
 * @notice Example vault contract for security testing
 * @dev This contract demonstrates common vulnerabilities
 */
contract BetaVault is ERC20, ReentrancyGuard {
    IERC20 public immutable asset;
    
    // Potential vulnerability: Direct balance check
    // Should use internal accounting instead
    
    constructor(IERC20 _asset) ERC20("Beta Vault Token", "bvToken") {
        asset = _asset;
    }
    
    /**
     * @notice Deposit assets and mint shares
     * @dev VULNERABLE: Uses balanceOf for share calculation
     */
    function deposit(uint256 assets) external nonReentrant returns (uint256 shares) {
        require(assets > 0, "Cannot deposit 0");
        
        // VULNERABILITY: Donation attack possible here
        // If someone donates tokens directly to vault, share price inflates
        shares = totalSupply() == 0 
            ? assets 
            : (assets * totalSupply()) / asset.balanceOf(address(this));
        
        require(shares > 0, "Cannot mint 0 shares");
        
        asset.transferFrom(msg.sender, address(this), assets);
        _mint(msg.sender, shares);
        
        return shares;
    }
    
    /**
     * @notice Withdraw assets by burning shares
     */
    function withdraw(uint256 shares) external nonReentrant returns (uint256 assets) {
        require(shares > 0, "Cannot withdraw 0");
        require(balanceOf(msg.sender) >= shares, "Insufficient shares");
        
        assets = (shares * asset.balanceOf(address(this))) / totalSupply();
        
        _burn(msg.sender, shares);
        asset.transfer(msg.sender, assets);
        
        return assets;
    }
    
    /**
     * @notice Get current share price
     * @dev VULNERABLE: Can be manipulated via donation
     */
    function sharePrice() external view returns (uint256) {
        if (totalSupply() == 0) return 1e18;
        return (asset.balanceOf(address(this)) * 1e18) / totalSupply();
    }
}