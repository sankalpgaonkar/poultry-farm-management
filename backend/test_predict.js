async function test() {
  try {
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'farmer1@test.com', password: 'password123' })
    });
    const loginData = await loginRes.json();
    if (!loginRes.ok) throw new Error(loginData.message || 'Login failed');
    const token = loginData.token;
    
    console.log('Got token, making prediction request...');
    const predictRes = await fetch('http://localhost:5000/api/ai/predict', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({
        chickens: 1000, age: 25, feedQuality: 'Good', feedQty: 120, temperature: 24, humidity: 60, lighting: 15, breed: 'Leghorn'
      })
    });
    
    if (!predictRes.ok) {
      const errorText = await predictRes.text();
      console.error('API Error:', predictRes.status, errorText);
      return;
    }
    const data = await predictRes.json();
    console.log('SUCCESS! Predict response:', JSON.stringify(data));
  } catch (error) {
    console.error('Fetch Error:', error.message);
  }
}
test();
