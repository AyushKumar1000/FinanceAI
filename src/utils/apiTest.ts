// Simple API test utility for debugging Grok AI connection
export const testGrokAPI = async () => {
  const API_KEY = process.env.VITE_GROK_API_KEY || '';
  const API_URL = 'https://api.x.ai/v1/chat/completions';
  
  try {
    console.log('Testing Grok AI API connection...');
    console.log('API Key:', API_KEY ? API_KEY.substring(0, 10) + '...' : 'Not set');
    console.log('API URL:', API_URL);
    
    if (!API_KEY) {
      throw new Error('GROK_API_KEY environment variable not set');
    }
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'grok-beta',
        messages: [
          {
            role: 'user',
            content: 'Hello, can you respond with a simple test message?'
          }
        ],
        max_tokens: 50,
        temperature: 0.7
      })
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`API call failed: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Success! Response data:', data);
    return data;
    
  } catch (error) {
    console.error('API Test failed:', error);
    throw error;
  }
};

// Alternative test with different endpoint
export const testGrokAlternative = async () => {
  const API_KEY = process.env.VITE_GROK_API_KEY || '';
  
  if (!API_KEY) {
    throw new Error('GROK_API_KEY environment variable not set');
  }
  
  // Try different possible endpoints
  const endpoints = [
    'https://api.x.ai/v1/chat/completions',
    'https://api.x.ai/v1/completions',
    'https://api.x.ai/chat/completions'
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`Testing endpoint: ${endpoint}`);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'grok-beta',
          messages: [
            {
              role: 'user',
              content: 'Test'
            }
          ],
          max_tokens: 10
        })
      });
      
      console.log(`Endpoint ${endpoint} status:`, response.status);
      
      if (response.ok) {
        console.log(`✅ Working endpoint found: ${endpoint}`);
        return endpoint;
      }
      
    } catch (error) {
      console.log(`❌ Endpoint ${endpoint} failed:`, error);
    }
  }
  
  throw new Error('No working endpoints found');
};

// OpenAI API test function
export const testOpenAIAPI = async () => {
  const API_KEY = process.env.VITE_OPENAI_API_KEY || '';
  const API_URL = 'https://api.openai.com/v1/chat/completions';
  
  try {
    console.log('Testing OpenAI API connection...');
    console.log('API Key:', API_KEY ? API_KEY.substring(0, 10) + '...' : 'Not set');
    console.log('API URL:', API_URL);
    
    if (!API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable not set');
    }
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: 'Hello, can you respond with a simple test message?'
          }
        ],
        max_tokens: 50,
        temperature: 0.7
      })
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`API call failed: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Success! Response data:', data);
    return data;
    
  } catch (error) {
    console.error('OpenAI API Test failed:', error);
    throw error;
  }
};
