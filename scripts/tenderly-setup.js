/**
 * Tenderly Integration Setup
 * Configure Tenderly for fork testing and simulation
 */

const axios = require('axios');

const TENDERLY_API_KEY = process.env.TENDERLY_API_KEY;
const TENDERLY_USER = process.env.TENDERLY_USER;
const TENDERLY_PROJECT = process.env.TENDERLY_PROJECT;

async function createTenderlyFork() {
    console.log('Creating Tenderly fork for testing...');
    
    const forkConfig = {
        network_id: '1',
        block_number: 'latest',
        chain_config: {
            chain_id: 1
        }
    };
    
    try {
        const response = await axios.post(
            `https://api.tenderly.co/api/v1/account/${TENDERLY_USER}/project/${TENDERLY_PROJECT}/fork`,
            forkConfig,
            {
                headers: {
                    'X-Access-Key': TENDERLY_API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        console.log('Fork created successfully!');
        console.log('Fork ID:', response.data.simulation_fork.id);
        console.log('RPC URL:', response.data.simulation_fork.rpc_url);
        
        return response.data.simulation_fork;
    } catch (error) {
        console.error('Error creating fork:', error.message);
    }
}

async function simulateTransaction(forkId, transaction) {
    console.log('Simulating transaction on Tenderly...');
    
    try {
        const response = await axios.post(
            `https://api.tenderly.co/api/v1/account/${TENDERLY_USER}/project/${TENDERLY_PROJECT}/fork/${forkId}/simulate`,
            {
                ...transaction,
                save: true,
                save_if_fails: true
            },
            {
                headers: {
                    'X-Access-Key': TENDERLY_API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        console.log('Simulation complete!');
        console.log('Status:', response.data.transaction.status ? 'SUCCESS' : 'FAILED');
        console.log('Gas Used:', response.data.transaction.gas_used);
        console.log('View in Tenderly:', response.data.simulation.id);
        
        return response.data;
    } catch (error) {
        console.error('Error simulating transaction:', error.message);
    }
}

module.exports = {
    createTenderlyFork,
    simulateTransaction
};

if (require.main === module) {
    createTenderlyFork();
}