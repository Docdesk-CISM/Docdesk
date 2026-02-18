// Use https for the test client to avoid insecure http literals
const https = require('https');

const options = {
    hostname: 'localhost',
    port: 4000,
    path: '/api/test', // Just checking headers, path doesn't matter much if 404
    method: 'GET',
    headers: {
        // origin values should use https to avoid insecure protocol usage
        'Origin': 'https://malicious-site.com'
    }
};

const req = https.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers, null, 2)}`);

    if (res.headers['access-control-allow-origin']) {
        console.error('FAIL: Access-Control-Allow-Origin should NOT be present for malicious origin');
    } else {
        console.log('PASS: Access-Control-Allow-Origin is correctly missing for malicious origin');
    }

    if (res.headers['x-dns-prefetch-control']) {
        console.log('PASS: Helmet headers detected');
    } else {
        console.error('FAIL: Helmet headers missing');
    }
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.end();

const optionsAllowed = {
    hostname: 'localhost',
    port: 4000,
    path: '/api/test',
    method: 'GET',
    headers: {
        'Origin': 'https://localhost:3000'
    }
};

const reqAllowed = https.request(optionsAllowed, (res) => {
    console.log(`\nAllowed Origin Test:`);
    if (res.headers['access-control-allow-origin'] === 'http://localhost:3000') {
        console.log('PASS: Access-Control-Allow-Origin is present for allowed origin');
    } else {
        console.error('FAIL: Access-Control-Allow-Origin is MISSING or WRONG for allowed origin');
    }
});
reqAllowed.end();
