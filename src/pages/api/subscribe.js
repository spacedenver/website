export const POST = async ({ request }) => {
  console.log('API endpoint hit: /api/subscribe');
  try {
    const formData = await request.formData();
    
    const response = await fetch('http://listmonk.dspace:9000/subscription/form', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from('spacedenver024:834ieri34fker34xmlweWF82X').toString('base64'),
      },
      body: formData
    });

    if (response.ok) {
      return new Response(null, {
        status: 302,
        headers: {
          'Location': '/success'
        }
      });
    }

    return new Response(JSON.stringify({ 
      error: 'Subscription failed' 
    }), { 
      status: 400 
    });

  } catch (error) {
    console.error('Server error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error' 
    }), { 
      status: 500 
    });
  }
} 