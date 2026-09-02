export async function onRequest(context) {
  const { request, env } = context;

  /*
   * ==========================================
   * GET — API TEST
   * ==========================================
   *
   * Opening /api/button-click in a browser
   * should return:
   *
   * {
   *   "ok": true,
   *   "message": "Mystery button API is online"
   * }
   */

  if (request.method === 'GET') {
    return new Response(
      JSON.stringify({
        ok: true,
        message: 'Mystery button API is online'
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store'
        }
      }
    );
  }


  /*
   * ==========================================
   * ONLY ALLOW POST FOR THE BUTTON
   * ==========================================
   */

  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({
        ok: false,
        error: 'Method not allowed'
      }),
      {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          'Allow': 'GET, POST'
        }
      }
    );
  }


  /*
   * ==========================================
   * GET DISCORD WEBHOOK FROM CLOUDFLARE
   * ==========================================
   *
   * The webhook URL must NOT be written here.
   *
   * Cloudflare variable:
   *
   * DISCORD_WEBHOOK_URL
   */

  const webhook = env.DISCORD_WEBHOOK_URL;

  if (!webhook) {
    console.error(
      'DISCORD_WEBHOOK_URL is not configured'
    );

    return new Response(
      JSON.stringify({
        ok: false,
        error:
          'DISCORD_WEBHOOK_URL is missing from Cloudflare'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }


  /*
   * ==========================================
   * READ INFORMATION FROM THE WEBSITE
   * ==========================================
   */

  let body;

  try {
    body = await request.json();
  } catch (error) {
    console.error(
      'Could not read request JSON:',
      error
    );

    return new Response(
      JSON.stringify({
        ok: false,
        error: 'Invalid JSON request'
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }


  const deviceInfo = body?.deviceInfo || {};


  /*
   * ==========================================
   * GET VISITOR IP FROM CLOUDFLARE
   * ==========================================
   */

  const ip =
    request.headers.get('CF-Connecting-IP') ||
    'Unavailable';


  /*
   * ==========================================
   * BUILD DISCORD EMBED
   * ==========================================
   */

  const fields = [
    {
      name: 'IP Address',
      value: String(ip),
      inline: true
    }
  ];


  for (const [name, value] of Object.entries(deviceInfo)) {
    fields.push({
      name: String(name).slice(0, 256),
      value: String(value).slice(0, 1024),
      inline: true
    });
  }


  const discordPayload = {
    content: 'button clicked',

    embeds: [
      {
        title: '🔴 Mystery Button Clicked',

        description:
          'Public browser/device information collected from diagnostic.run',

        fields: fields.slice(0, 25),

        timestamp: new Date().toISOString()
      }
    ]
  };


  /*
   * ==========================================
   * SEND TO DISCORD
   * ==========================================
   */

  try {
    const discordResponse = await fetch(
      webhook,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify(
          discordPayload
        )
      }
    );


    /*
     * ========================================
     * DISCORD ERROR
     * ========================================
     */

    if (!discordResponse.ok) {
      const errorText =
        await discordResponse.text();

      console.error(
        'Discord webhook failed:',
        discordResponse.status,
        errorText
      );

      return new Response(
        JSON.stringify({
          ok: false,
          error:
            `Discord returned ${discordResponse.status}`
        }),
        {
          status: 502,
          headers: {
            'Content-Type':
              'application/json'
          }
        }
      );
    }


    /*
     * ========================================
     * SUCCESS
     * ========================================
     */

    console.log(
      'Mystery button successfully sent to Discord'
    );

    return new Response(
      JSON.stringify({
        ok: true,
        message: 'Sent to Discord'
      }),
      {
        status: 200,
        headers: {
          'Content-Type':
            'application/json',

          'Cache-Control':
            'no-store'
        }
      }
    );

  } catch (error) {

    console.error(
      'Discord request error:',
      error
    );

    return new Response(
      JSON.stringify({
        ok: false,
        error:
          'Could not contact Discord'
      }),
      {
        status: 502,
        headers: {
          'Content-Type':
            'application/json'
        }
      }
    );
  }
}
