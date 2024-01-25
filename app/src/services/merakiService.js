// src/services/merakiService.js

// Function to set the API key in the backend
const setApiKey = async (apiKey) => {
    const response = await fetch('http://localhost:8000/set_api_key', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ api_key: apiKey }),
    });
    if (!response.ok) {
        throw new Error('Failed to set API key');
    }
    return response.json();
};

// Function to fetch organizations from your FastAPI backend
const fetchOrganizations = async () => {
    const response = await fetch('http://localhost:8000/organizations');
    if (!response.ok) {
        throw new Error('Failed to fetch organizations');
    }
    return response.json();
};

const fetchNetworks = async (orgId) => {
    const response = await fetch(`http://localhost:8000/networks/${orgId}`);
    // Check for response.ok
    if (!response.ok) {
        throw new Error('Failed to fetch networks');
    }
    return response.json();
};


const baseUrl = 'http://localhost:8000'; // Hardcoded base URL

const fetchNetworkDetails = async (networkIds) => {
    const response = await fetch(`${baseUrl}/networks/details`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ network_ids: networkIds }),
    });
    if (!response.ok) {
        throw new Error('Failed to fetch network details');
    }
    return response.json();
};

const fetchNetworkEvents = async (networkId) => {
    const response = await fetch(`http://localhost:8000/networks/${networkId}/events`, {
        method: 'GET'
    });
    if (!response.ok) {
        throw new Error('Failed to fetch network events');
    }
    return response.json();
};


export { setApiKey, fetchOrganizations, fetchNetworks, fetchNetworkDetails, fetchNetworkEvents }; // Export the fetchNetworkDetails function


