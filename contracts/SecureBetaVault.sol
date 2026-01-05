// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title SecureBetaVault
 * @notice Improved vault with donation attack mitigation
 */
contract SecureBetaVault is ERC20, ReentrancyGuard {
    IERC20 public immutable asset;
    uint256 private _totalAssets; // Internal accounting
    
    uint256 private constant INITIAL_SHARES_MULTIPLIER = 1e3;
    uint256 private constant MIN_FIRST_DEPOSIT = 1e6; // Minimum 1M wei
    
    constructor(IERC20 _asset) ERC20("Secure Beta Vault", "sbvToken") {
        asset = _asset;
    }
    
    /**
     * @notice Secure deposit with donation attack mitigation
     */
    function deposit(uint256 assets) external nonReentrant returns (uint256 shares) {
        require(assets > 0, "Cannot deposit 0");
        
        if (totalSupply() == 0) {
            // First deposit: require minimum amount and mint inflated shares
            require(assets >= MIN_FIRST_DEPOSIT, "First deposit too small");
            shares = assets * INITIAL_SHARES_MULTIPLIER;
        } else {
            // Use internal accounting instead of balanceOf
            shares = (assets * totalSupply()) / _totalAssets;
        }
        
        require(shares > 0, "Cannot mint 0 shares");
        
        asset.transferFrom(msg.sender, address(this), assets);
        _totalAssets += assets;
        _mint(msg.sender, shares);
        
        return shares;
    }
    
    function withdraw(uint256 shares) external nonReentrant returns (uint256 assets) {
        require(shares > 0, "Cannot withdraw 0");
        require(balanceOf(msg.sender) >= shares, "Insufficient shares");
        
        assets = (shares * _totalAssets) / totalSupply();
        
        _burn(msg.sender, shares);
        _totalAssets -= assets;
        asset.transfer(msg.sender, assets);
        
        return assets;
    }
    
    function totalAssets() external view returns (uint256) {
        return _totalAssets;
    }
}