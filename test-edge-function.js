// Test script for Edge Function
const https = require('https');

async function testEdgeFunction() {
  console.log('🧪 Testing Edge Function...');
  
  const testData = {
    price_id: "price_1RgakoG8nQMivkW3R0JFwmJy",
    user_id: "test-user-123",
    customer_email: "test@example.com",
    plan_name: "Creator",
    billing_cycle: "monthly",
    test_mode: true
  };

  const postData = JSON.stringify(testData);
  
  const options = {
    hostname: 'epic-raman6-4uxp6.supabase.co',
    port: 443,
    path: '/functions/v1/create-checkout',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
      'Authorization': 'Bearer ' + process.env.SUPABASE_ANON_KEY
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log('✅ Edge Function Response:', result);
          resolve(result);
        } catch (error) {
          console.log('❌ Raw Response:', data);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Request Error:', error);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Run the test
testEdgeFunction()
  .then(result => {
    if (result.success) {
      console.log('🎉 Edge Function test PASSED!');
    } else {
      console.log('❌ Edge Function test FAILED:', result.error);
    }
  })
  .catch(error => {
    console.error('💥 Test failed with error:', error.message);
  }); 