const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Test credentials
const credentials = {
  admin: { email: 'admin@electrolux.com', password: 'password123' },
  employee: { email: 'employee1@electrolux.com', password: 'password123' },
  customer: { email: 'customer1@example.com', password: 'password123' },
};

async function testAPIs() {
  console.log('🧪 Testing ElectroLux APIs...\n');

  try {
    // 1. Test Authentication
    console.log('1️⃣ Testing Authentication...');

    // Login as admin
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/signin`, {
      email: credentials.admin.email,
      password: credentials.admin.password,
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    console.log('✅ Authentication successful');
    const cookies = loginResponse.headers['set-cookie'];

    // 2. Test Customer API
    console.log('\n2️⃣ Testing Customer API...');

    const customersResponse = await axios.get(`${BASE_URL}/api/customers?limit=5`, {
      headers: { Cookie: cookies }
    });

    console.log(`✅ Fetched ${customersResponse.data.data.length} customers`);
    console.log(`   Total customers: ${customersResponse.data.pagination.total}`);

    // 3. Test Dashboard API
    console.log('\n3️⃣ Testing Dashboard API...');

    const dashboardResponse = await axios.get(`${BASE_URL}/api/dashboard`, {
      headers: { Cookie: cookies }
    });

    console.log('✅ Dashboard data fetched');
    console.log(`   Total Customers: ${dashboardResponse.data.data.metrics.totalCustomers}`);
    console.log(`   Monthly Revenue: $${dashboardResponse.data.data.metrics.monthlyRevenue}`);
    console.log(`   Collection Rate: ${dashboardResponse.data.data.metrics.collectionRate}%`);

    // 4. Test Bills API
    console.log('\n4️⃣ Testing Bills API...');

    const billsResponse = await axios.get(`${BASE_URL}/api/bills?limit=5`, {
      headers: { Cookie: cookies }
    });

    console.log(`✅ Fetched ${billsResponse.data.data.length} bills`);
    console.log(`   Total bills: ${billsResponse.data.pagination.total}`);

    // 5. Test specific customer details
    console.log('\n5️⃣ Testing Customer Details API...');

    const customerDetailResponse = await axios.get(`${BASE_URL}/api/customers/1`, {
      headers: { Cookie: cookies }
    });

    console.log('✅ Customer details fetched');
    const customer = customerDetailResponse.data.data.customer;
    console.log(`   Name: ${customer.fullName}`);
    console.log(`   Account: ${customer.accountNumber}`);
    console.log(`   Connection Type: ${customer.connectionType}`);

    console.log('\n🎉 All API tests passed successfully!');
    console.log('\n📊 Summary:');
    console.log('  ✅ Authentication API - Working');
    console.log('  ✅ Customer API - Working');
    console.log('  ✅ Dashboard API - Working');
    console.log('  ✅ Bills API - Working');
    console.log('  ✅ Customer Details API - Working');

  } catch (error) {
    console.error('\n❌ API Test Failed!');
    console.error('Error:', error.response?.data || error.message);

    if (error.response?.status === 401) {
      console.error('⚠️  Authentication failed. Make sure the server is running.');
    }
  }
}

// Run tests
console.log('🚀 Starting API tests...');
console.log('   Server: ' + BASE_URL);
console.log('   Make sure the server is running (npm run dev)\n');

testAPIs();


