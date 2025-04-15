const express = require('express');
const corsAnywhere = require('cors-anywhere');

const app = express();
const PORT = process.env.PORT || 8080;

// Create CORS Anywhere Proxy Server
const proxy = corsAnywhere.createServer({
    originWhitelist: [], // Allow all origins
    requireHeader: [], 
    removeHeaders: ['cookie', 'cookie2']
});

// Start proxy server
app.use('/', (req, res) => {
    proxy.emit('request', req, res);
});

app.listen(PORT, () => {
    console.log(`CORS Proxy running on port ${PORT}`);
});
