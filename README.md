# Beta Vault Security Testing Suite

## Overview
Comprehensive security testing for donation attacks and flash loan oracle manipulation vulnerabilities.

## Vulnerabilities Tested

### 1. Donation Attack
**Description:** Attacker inflates share price by donating tokens directly to vault, causing rounding errors for subsequent depositors.

**Attack Steps:**
1. Attacker deposits 1 wei to get initial shares
2. Attacker donates large amount directly to vault contract
3. Share price inflates massively
4. Next depositor gets rounded down to 0 or very few shares
5. Attacker withdraws with profit

**Mitigation:**
- Use internal accounting instead of `balanceOf()`
- Require minimum first deposit
- Mint inflated initial shares
- Use virtual shares/assets

### 2. Flash Loan Oracle Manipulation
**Description:** Attacker uses flash loan to manipulate DEX spot price, exploiting protocols that rely on manipulable oracles.

**Attack Steps:**
1. Take flash loan of large token amount
2. Swap on DEX to manipulate spot price
3. Oracle reads manipulated price
4. Exploit vault/protocol using inflated price
5. Reverse swap and repay flash loan
6. Keep profit

**Mitigation:**
- Use TWAP (Time-Weighted Average Price) oracles
- Use Chainlink decentralized oracles
- Implement price deviation checks
- Add time delays for critical operations
- Use multiple oracle sources

## Setup

```bash
# Clone repository
git clone https://github.com/arp123-456/beta-vault-security-tests.git
cd beta-vault-security-tests

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your Tenderly credentials
```

## Running Tests

```bash
# Compile contracts
npm run compile

# Run all tests
npm test

# Run specific tests
npm run test:donation
npm run test:flashloan

# Run comprehensive test suite
npm run test:all
```

## Tenderly Integration

```bash
# Setup Tenderly fork
npm run tenderly:setup
```

## Test Files

- `test/DonationAttack.test.js` - Donation attack scenarios
- `test/FlashLoanAttack.test.js` - Flash loan manipulation tests
- `contracts/BetaVault.sol` - Vulnerable vault implementation
- `contracts/SecureBetaVault.sol` - Secure vault with mitigations

## Remix IDE Testing

1. Copy contract code from `contracts/` folder
2. Paste into Remix IDE (https://remix.ethereum.org)
3. Compile with Solidity 0.8.20
4. Deploy on Remix VM or testnet
5. Test attack scenarios manually

## Security Checklist

- [ ] Internal accounting instead of balanceOf()
- [ ] Minimum first deposit requirement
- [ ] Inflated initial share minting
- [ ] TWAP oracle implementation
- [ ] Chainlink oracle integration
- [ ] Price deviation checks
- [ ] Reentrancy guards
- [ ] Access controls
- [ ] Emergency pause mechanism

## Resources

- [ERC4626 Security Considerations](https://eips.ethereum.org/EIPS/eip-4626)
- [Tenderly Documentation](https://docs.tenderly.co/)
- [OpenZeppelin Security](https://docs.openzeppelin.com/contracts/4.x/api/security)

## Warning

⚠️ These contracts contain intentional vulnerabilities for educational purposes. DO NOT use in production!

## License
MIT