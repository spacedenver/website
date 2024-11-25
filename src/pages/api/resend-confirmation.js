export const POST = async ({ request }) => {
  try {
    const formData = await request.formData();
    const email = formData.get('email');

    if (!email) {
      return new Response(JSON.stringify({ 
        error: 'Email is required' 
      }), { 
        status: 400 
      });
    }

    const response = await fetch('http://listmonk.dspace:9000/api/subscribers/query/optin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email
      })
    });

    if (!response.ok) {
      throw new Error(`Listmonk responded with ${response.status}`);
    }

    return new Response(JSON.stringify({ 
      message: 'Confirmation email resent' 
    }), { 
      status: 200 
    });

  } catch (error) {
    if (!(error instanceof TypeError)) {
      console.error('Resend confirmation error:', error);
    }
    return new Response(JSON.stringify({ 
      error: 'Failed to resend confirmation email' 
    }), { 
      status: 500 
    });
  }
}; 