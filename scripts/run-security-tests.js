/**
 * Comprehensive Security Test Runner
 * Executes all security tests and generates report
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('\n' + '='.repeat(60));
console.log('BETA VAULT SECURITY TEST SUITE');
console.log('='.repeat(60) + '\n');

const tests = [
    {
        name: 'Donation Attack Tests',
        command: 'npx hardhat test test/DonationAttack.test.js',
        description: 'Testing vault share manipulation via donation'
    },
    {
        name: 'Flash Loan Oracle Manipulation',
        command: 'npx hardhat test test/FlashLoanAttack.test.js',
        description: 'Testing price oracle manipulation scenarios'
    }
];

const results = [];

for (const test of tests) {
    console.log(`\nRunning: ${test.name}`);
    console.log(`Description: ${test.description}`);
    console.log('-'.repeat(60));
    
    try {
        const output = execSync(test.command, { encoding: 'utf-8' });
        console.log(output);
        results.push({
            name: test.name,
            status: 'PASSED',
            output: output
        });
    } catch (error) {
        console.error(`Test failed: ${error.message}`);
        results.push({
            name: test.name,
            status: 'FAILED',
            error: error.message
        });
    }
}

console.log('\n' + '='.repeat(60));
console.log('TEST SUMMARY');
console.log('='.repeat(60) + '\n');

results.forEach(result => {
    console.log(`${result.name}: ${result.status}`);
});

const report = {
    timestamp: new Date().toISOString(),
    results: results,
    summary: {
        total: results.length,
        passed: results.filter(r => r.status === 'PASSED').length,
        failed: results.filter(r => r.status === 'FAILED').length
    }
};

fs.writeFileSync('security-test-report.json', JSON.stringify(report, null, 2));
console.log('\nReport saved to: security-test-report.json\n');