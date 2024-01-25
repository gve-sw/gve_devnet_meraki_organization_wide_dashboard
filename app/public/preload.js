const { contextBridge } = require('electron');
const axios = require('axios');

contextBridge.exposeInMainWorld('api', {
    // Expose a function to make GET requests
    get: (url, params) => axios.get(url, { params }).then(res => res.data),

    // Expose a function to make POST requests
    post: (url, data) => axios.post(url, data).then(res => res.data),

    // You can add more HTTP methods as needed
});

// You can add more functionalities or APIs that you want to expose to your frontend here.
