/**
 * Load Testing Script for SIMRSZEN
 * This script performs basic load testing using Artillery
 */

// Sample artillery configuration
const artilleryConfig = `
config:
  target: 'http://localhost:3001'
  phases:
    - duration: 60
      arrivalRate: 10
      name: 'Warm up phase'
    - duration: 120
      arrivalRate: 20
      name: 'Sustained load phase'
    - duration: 30
      arrivalRate: 50
      name: 'Peak load phase'
  defaults:
    headers:
      Content-Type: 'application/json'
scenarios:
  - name: "Health Check"
    weight: 10
    flow:
      - get:
          url: "/health"
  - name: "Login Simulation"
    weight: 20
    flow:
      - post:
          url: "/api/auth/login"
          json:
            email: "{{ $randomEmail }}"
            password: "password123"
  - name: "Get Patients"
    weight: 15
    flow:
      - get:
          url: "/api/patients"
          headers:
            Authorization: "Bearer {{ $randomString }}"
  - name: "Get Visit Data"
    weight: 10
    flow:
      - get:
          url: "/api/visits"
          headers:
            Authorization: "Bearer {{ $randomString }}"
  - name: "Get Satu Sehat Config"
    weight: 5
    flow:
      - get:
          url: "/api/satusehat/settings"
          headers:
            Authorization: "Bearer {{ $randomString }}"
`;

// Write the configuration to a file
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'artillery-load-test.yaml');
fs.writeFileSync(configPath, artilleryConfig.trim());

console.log(`Load testing configuration saved to: ${configPath}`);
console.log(`
To run the load test:

1. Install artillery: npm install -g artillery
2. Run the test: artillery run ${configPath}
3. Generate report: artillery report --output report.html ${configPath}

For more advanced load testing, consider:
- Adding more realistic user scenarios
- Testing specific endpoints under heavy load
- Monitoring response times and error rates
- Running tests against staging environment before production
`);