import type { APIRoute } from 'astro';

const space_services_api_url = import.meta.env.SPACE_SERVICES_API_URL;

interface MembershipApplication {

  name: string;

  // Personal Information
  preferred_contact_method: 'email' | 'telegram' | 'x' | 'nostr';

  // Goals and Interests
  primary_goals: string[];  // ['networking', 'workspace', 'events', 'learning', 'collaboration', 'other']
  primary_services: string[];  // ['coworking', 'dedicated_space', 'events', 'community', 'amenities', 'other']
  events: string[];  // ['social', 'technical', 'educational', 'bitcoin_only', 'bitcoin_adjacent', 'other']
  other_interests?: string;

  // Values and Bitcoin
  core_values: string[];  // Exactly 3 values from the core values list
  bitcoin_competence: 'boating_accident' | 'continuing_education' | 'open_minded' | 'wrong_place';

  // Additional Information
  contributions?: string;
  existing_bitcoin_projects?: string;
  additional_info?: string;

  // Membership Details
  membership_option: 'social' | 'coworking';

  // Referral Information
  space_awareness: string[];  // ['word_of_mouth', 'social_media', 'online_search', 'event', 'advertisement', 'other']
  referral?: string;

  // Additional Details
  shirt_size?: 'X' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  
  // Terms and Consent
  consent: boolean;

  /** email */
  email: string;

  /** telegram */
  telegram?: string;

  /** X/Twitter */
  x_twitter?: string;

  /** nostr */
  nostr?: string;
}

export const POST: APIRoute = async ({ request }) => {
  
  if (!space_services_api_url) {
    console.error('SPACE_SERVICES_API_URL environment variable is not set');
    return new Response(JSON.stringify({ 
      error: 'Server configuration error' 
    }), { 
      status: 500 
    });
  }

  try {
    const data = await request.json();
    const application = data as MembershipApplication;

    // Validate required fields
    if (!application.name ||
        !application.email ||
        !application.preferred_contact_method ||
        !application.primary_goals.length ||
        !application.primary_services.length ||
        !application.events.length ||
        !application.core_values.length ||
        !application.bitcoin_competence ||
        !application.membership_option ||
        !application.space_awareness.length ||
        !application.consent) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Missing required fields'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Validate values array has exactly 3 items
    if (application.core_values.length !== 3) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Please select exactly three core values'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Log the application data
    console.log('Submitting membership application:', 
      JSON.stringify(application, null, 2)
    );

    // Send application to Space Services API
    const response = await fetch(`${space_services_api_url}/api/member-app`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(application)
    });

    if (!response.ok) {
      const errorData = await response.text();  // Read the response body once as text

      return new Response(JSON.stringify({
        success: false,
        message: errorData
      }), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const result = await response.json();

    return new Response(JSON.stringify({
      success: true,
      message: 'Application submitted successfully',
      data: result
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Error processing membership application:', error);
    
    return new Response(JSON.stringify({
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}; 