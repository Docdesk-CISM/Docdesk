const axios = require('axios');

// Configuration
const BASE_URL = 'http://localhost:8000'; // Adjust port if necessary
let adminToken = '';
let doctorToken = '';
let patientToken = '';
let doctorId = '';
let patientId = '';

const log = (msg, success = true) => console.log(`${success ? '✅' : '❌'} ${msg}`);

async function login(email, password, type) {
    try {
        const endpoint = type === 'admin' ? '/portal/auth/login' : 
                         type === 'doctor' ? '/auth/doctor/login' : '/auth/login';
        
        // For admin login, the structure might be different based on controller
        // Based on portalAuth.Controller.js: adminSignIn
        
        const res = await axios.post(`${BASE_URL}${endpoint}`, { email, password });
        return res.data.token || res.data.accessToken;
    } catch (error) {
        console.error(`Login failed for ${type}:`, error.response ? error.response.data : error.message);
        return null;
    }
}

async function runTests() {
    console.log('--- Starting RBAC Verification ---');

    // 1. Authenticate Users (You need to have these users in DB or create them)
    // NOTE: Replace with actual credentials from your DB investigation or seed data
    console.log('Logging in...');
    // Assuming standard test users exist or I need to create them. 
    // Since I can't easily see DB content, I will try to use endpoints to create them if possible or just assume they exist.
    // For this script to work, valid credentials are needed. 
    // I will try to register users first to ensure they exist.

    // Register Admin
    try {
        await axios.post(`${BASE_URL}/portal/auth/register`, {
            firstName: "Test", lastName: "Admin", email: "testadmin@test.com", password: "password123"
        });
    } catch (e) {} // Ignore if exists
    adminToken = await login("testadmin@test.com", "password123", 'admin');

    // Register Doctor
    try {
        await axios.post(`${BASE_URL}/auth/doctor/register`, {
            firstName: "Test", lastName: "Doctor", email: "testdoctor@test.com", password: "password123", 
            nic: "123456789V", medicalId: "MED123", medicalIdVerify: true // forcefully verified if possible? 
            // Wait, medicalIdVerify is boolean default false. Admin needs to verify.
        });
        // Verify doctor using admin token?
        // We need doctor ID.
        // Let's Skip registration complexity and try to just check roles on endpoints if we can get tokens.
        // If I can't easily register/login, I might need to simulate req objects in unit tests, but integration test is better.
    } catch (e) {}
    doctorToken = await login("testdoctor@test.com", "password123", 'doctor');

    // Register Patient
    try {
        await axios.post(`${BASE_URL}/auth/register`, {
            firstName: "Test", lastName: "Patient", email: "testpatient@test.com", password: "password123",
            nic: "987654321V"
        });
    } catch (e) {}
    patientToken = await login("testpatient@test.com", "password123", 'patient');

    if (!adminToken || !doctorToken || !patientToken) {
        console.error("Failed to get tokens. Aborting tests. Please ensure database is running and users can be registered/logged in.");
        return;
    }
    
    console.log("Tokens acquired.");

    // TEST 1: Patient tries to delete Doctor (Should FAIL)
    console.log('\nTest 1: Patient tries to delete Doctor');
    try {
        await axios.delete(`${BASE_URL}/doctors/fake_id`, {
            headers: { Authorization: `Bearer ${patientToken}` }
        });
        log('Patient deleted doctor (Unexpected)', false);
    } catch (error) {
        if (error.response && error.response.status === 403) {
            log('Patient blocked from deleting doctor (Expected 403)');
        } else {
            log(`Patient blocked with status ${error.response ? error.response.status : 'unknown'} (Expected 403)`, false);
        }
    }

    // TEST 2: Doctor tries to delete Doctor (Should FAIL)
    console.log('\nTest 2: Doctor tries to delete Doctor');
    try {
        await axios.delete(`${BASE_URL}/doctors/fake_id`, {
            headers: { Authorization: `Bearer ${doctorToken}` }
        });
        log('Doctor deleted doctor (Unexpected)', false);
    } catch (error) {
        if (error.response && error.response.status === 403) {
            log('Doctor blocked from deleting doctor (Expected 403)');
        } else {
             log(`Doctor blocked with status ${error.response ? error.response.status : 'unknown'} (Expected 403)`, false);
        }
    }

    // TEST 3: Admin tries to delete Doctor (Should pass Auth, might fail 404/500 on logic)
    console.log('\nTest 3: Admin tries to delete Doctor');
    try {
        await axios.delete(`${BASE_URL}/doctors/fake_id`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        log('Admin allowed to delete doctor (Expected)', true);
    } catch (error) {
        if (error.response && error.response.status === 403) {
            log('Admin blocked from deleting doctor (Unexpected 403)', false);
        } else {
            log(`Admin allowed (Status ${error.response ? error.response.status : 'unknown'})`, true);
        }
    }
    
    // TEST 4: Patient tries to create medical record (Should FAIL)
    console.log('\nTest 4: Patient tries to create medical record');
    try {
        await axios.post(`${BASE_URL}/medicalRecord/create`, {}, {
            headers: { Authorization: `Bearer ${patientToken}` }
        });
        log('Patient created record (Unexpected)', false);
    } catch (error) {
        if (error.response && error.response.status === 403) {
            log('Patient blocked from creating record (Expected 403)');
        } else {
             log(`Patient blocked with status ${error.response ? error.response.status : 'unknown'} (Expected 403)`, false);
        }
    }

     // TEST 5: Doctor tries to create medical record (Should PASS Auth)
    console.log('\nTest 5: Doctor tries to create medical record');
    try {
        await axios.post(`${BASE_URL}/medicalRecord/create`, {}, {
            headers: { Authorization: `Bearer ${doctorToken}` }
        });
        log('Doctor allowed to create record (Expected)', true);
    } catch (error) {
        if (error.response && error.response.status === 403) {
            log('Doctor blocked from creating record (Unexpected 403)', false);
        } else {
            log(`Doctor allowed (Status ${error.response ? error.response.status : 'unknown'})`, true);
        }
    }

    console.log('\n--- Verification Complete ---');
}

runTests();
