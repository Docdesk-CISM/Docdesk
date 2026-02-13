# Step-by-Step Guide: Microsoft Threat Model (STRIDE)
## Risk 3: Insecure Token & Session Management - DocDesk

This guide explains how to perform a Threat Model using the Microsoft Methodology specifically for the vulnerabilities identified in your assignment.

---

### Step 1: Draw the Data Flow Diagram (DFD)
To start, you need to visualize how data (tokens) moves through the DocDesk system.

**DFD Components for Risk 3:**
1.  **External Actors**: Patient, Doctor, Admin (using Mobile/Web App).
2.  **Processes**: 
    *   `Auth Service`: Generates and verifies tokens.
    *   `Data Integration Service`: Accesses records using tokens.
3.  **Data Stores**: MongoDB (Stores User credentials and Refresh Tokens).
4.  **Data Flows**: 
    *   "Credentials" (User -> Auth Service).
    *   "Refresh Token" (Auth Service -> User).
    *   "Access Token" (User -> API Resource).
5.  **Trust Boundaries**: The line between the User's device (Untrusted) and the DocDesk Backend (Trusted).

---

### Step 2: Identify Threats using STRIDE
Run each element of your DFD against the STRIDE categories to see what can go wrong.

| STRIDE Category | Threat Description (for Risk 3) | Impact |
| :--- | :--- | :--- |
| **S**poofing | An attacker uses a stolen Refresh Token to pretend to be a Doctor or Patient. | Unauthorized access to medical records. |
| **T**ampering | An attacker modifies the JWT payload (if the secret is weak) to gain higher privileges. | Privilege escalation (e.g., Patient becomes Admin). |
| **R**epudiation | A user claims they didn't perform an action, but the system has no logs linking the token to a specific session. | Difficult to audit malicious activity. |
| **I**nformation Disclosure | Sensitive user roles or IDs are leaked in the JWT payload or through insecure console logs. | Privacy breach. |
| **D**enial of Service | An attacker floods the `/refresh` endpoint with invalid tokens, consuming server resources. | System unavailability. |
| **E**levation of Privilege | **(Critical Found Risk)**: Due to the broken revocation logic, an attacker can keep refreshing tokens even after a password reset. | Permanent account takeover. |

---

### Step 3: Map Your Implemented Fixes as Mitigations
In the MST tool, you would now add "Mitigations" to address the threats identified in Step 2.

**Mitigation 1: Secure Persistence (Addresses Spoofing/Repudiation)**
*   **Action**: Corrected the `generateRefreshToken.js` logic to ensure tokens are saved to the database.
*   **How it works**: By saving the token, we create a server-side record of the "Active Session," allowing us to track exactly who is logged in.

**Mitigation 2: Active Token Validation (Addresses Elevation of Privilege)**
*   **Action**: Updated `refreshAccessGenerate.js` to compare the incoming token with the database record.
*   **How it works**: This "Stateful" check ensures that if a token is stolen or revoked (e.g., after a logout), the system will reject any further refresh attempts.

---

### Step 4: Verification (The "Test" phase)
Finally, verify that the mitigations work. 
*   **Scenario**: Attacker tries to use an old Refresh Token after the password was changed.
*   **Result**: The system looks up the current token in the DB, sees a mismatch, and throws an "Invalid or revoked refresh token" error.

---
**Guideline Summary for Submission:**
When the evaluator asks how you used MSTMR, say: *"I used the STRIDE framework to identify that our stateless JWT implementation was vulnerable to Elevation of Privilege. I then designed a 'Stateful Validation' mitigation to ensure session integrity."*
