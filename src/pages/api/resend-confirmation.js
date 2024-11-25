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

    const listmonk_domain_url = import.meta.env.LISTMONK_DOMAIN_URL;
    if (!listmonk_domain_url) {
      console.error('LISTMONK_DOMAIN_URL environment variable is not set');
      return new Response(JSON.stringify({ 
        error: 'Server configuration error' 
      }), { 
        status: 500 
      });
    }

    const response = await fetch(`${listmonk_domain_url}/api/subscribers/query/optin`, {
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
      console.error('Resend confirmation error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }
    return new Response(JSON.stringify({ 
      error: 'Failed to resend confirmation email',
      details: error.message  // Optionally add this for debugging, remove in production
    }), { 
      status: 500 
    });
  }
}; 