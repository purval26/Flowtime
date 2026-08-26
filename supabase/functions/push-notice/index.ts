import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to sign JWT with CryptoKey for Google service account auth
async function getAccessToken(clientEmail: string, privateKey: string): Promise<string> {
  const cleanKey = privateKey
    .replace(/\\n/g, '\n')
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s+/g, '') // Strip all newlines and spaces for valid atob decoding
    .trim();

  // Convert PEM private key to binary ArrayBuffer
  const binaryKey = Uint8Array.from(atob(cleanKey), (c) => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    binaryKey,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: { name: 'SHA-256' },
    },
    false,
    ['sign']
  );

  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  
  const claimSet = {
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/firebase.messaging',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const textEncoder = new TextEncoder();
  const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, '');
  const encodedClaimSet = btoa(JSON.stringify(claimSet)).replace(/=/g, '');
  const signatureInput = `${encodedHeader}.${encodedClaimSet}`;
  
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    textEncoder.encode(signatureInput)
  );

  const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  const assertion = `${signatureInput}.${encodedSignature}`;

  // Call Google OAuth2 endpoint to exchange JWT assertion for access token
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: assertion,
    }),
  });

  const data = await response.json();
  if (data.error) {
    throw new Error(`Google OAuth error: ${data.error_description || data.error}`);
  }
  return data.access_token;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    console.log('Webhook payload:', payload);

    // Payload insert record
    const record = payload.record;
    if (!record) {
      return new Response(JSON.stringify({ error: 'No record found in insert webhook payload.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { title, content, class_id } = record;

    // Get Service Account details from Environment
    let serviceAccount: any;
    const serviceAccountJson = Deno.env.get('FIREBASE_SERVICE_ACCOUNT');
    if (serviceAccountJson) {
      serviceAccount = JSON.parse(serviceAccountJson);
    } else {
      serviceAccount = {
        type: Deno.env.get('type'),
        project_id: Deno.env.get('project_id'),
        private_key_id: Deno.env.get('private_key_id'),
        private_key: Deno.env.get('private_key'),
        client_email: Deno.env.get('client_email'),
        client_id: Deno.env.get('client_id'),
        auth_uri: Deno.env.get('auth_uri'),
        token_uri: Deno.env.get('token_uri'),
        auth_provider_x509_cert_url: Deno.env.get('auth_provider_x509_cert_url'),
        client_x509_cert_url: Deno.env.get('client_x509_cert_url'),
        universe_domain: Deno.env.get('universe_domain'),
      };
    }

    if (!serviceAccount.private_key || !serviceAccount.client_email || !serviceAccount.project_id) {
      return new Response(JSON.stringify({ error: 'Missing core Firebase credentials in environment (private_key, client_email, project_id).' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const projectId = serviceAccount.project_id;

    // Generate OAuth access token
    const accessToken = await getAccessToken(serviceAccount.client_email, serviceAccount.private_key);
    console.log('OAuth Access Token successfully fetched.');

    // We send FCM messaging request to a global channel or a class specific channel.
    // In our React Native client, we can subscribe all clients to FCM topic 'announcements'
    // or to specific topic corresponding to their class_id.
    const targetTopic = class_id ? `class_${class_id}` : 'announcements';

    // Construct Firebase Messaging REST Request payload
    const message = {
      message: {
        topic: targetTopic,
        notification: {
          title: title || 'New Notice',
          body: content || '',
        },
        android: {
          priority: 'HIGH',
          notification: {
            sound: 'default',
            channel_id: 'high_importance_channel',
            default_sound: true,
            default_vibrate_timings: true,
            notification_priority: 'PRIORITY_HIGH',
          },
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
            },
          },
        },
      },
    };

    const fcmEndpoint = `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`;
    const fcmResponse = await fetch(fcmEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    const fcmResult = await fcmResponse.json();
    console.log('FCM Response Status:', fcmResponse.status, fcmResult);

    return new Response(JSON.stringify({ success: true, targetTopic, fcmResult }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Webhook execution failed:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
