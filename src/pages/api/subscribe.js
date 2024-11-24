export const POST = async ({ request }) => {
  try {
    const formData = await request.formData();
    
    const honeypot = formData.get('website_url');
    if (honeypot) {
      return new Response(null, {
        status: 302,
        headers: {
          'Location': '/success'
        }
      });
    }
    
    console.log('API endpoint hit: /api/subscribe');
    const response = await fetch('http://listmonk.dspace:9000/subscription/form', {
      method: 'POST',
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
    // Don't log TypeError instances
    if (!(error instanceof TypeError)) {
      console.error('Server error:', error);
    }
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error' 
    }), { 
      status: 500 
    });
  }
} 