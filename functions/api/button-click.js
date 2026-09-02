export async function onRequest(context) {
  const method = context.request.method;

  /*
   * GET
   *
   * Allows you to test whether the Cloudflare
   * Pages Function is actually deployed.
   */
  if (method === 'GET') {
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
   * Only POST is used by the mystery button.
   */
  if (method !== 'POST') {
    return new Response(
      'Method Not Allowed',
      {
        status: 405,
        headers: {
          Allow: 'GET, POST'
        }
      }
    );
  }

  /*
   * The Discord webhook is stored as a
   * Cloudflare secret.
   *
   * DO NOT put the webhook URL here.
   */
  const webhook =
    context.env.DISCORD_WEBHOOK_URL;

  if (!webhook) {
    return new Response(
      JSON.stringify({
        ok: false,
        error:
          'DISCORD_WEBHOOK_URL is not configured'
      }),
      {
        status: 500,
        headers: {
          'Content-Type':
            'application/json'
        }
      }
    );
  }

  try {

    const body =
      await context.request.json();

    const deviceInfo =
      body?.deviceInfo || {};

    /*
     * Cloudflare gives us the visitor's
     * public IP address.
     */
    const ip =
      context.request.headers.get(
        'CF-Connecting-IP'
      ) ||
      'Unavailable';

    const fields = [

      {
        name: 'IP Address',
        value: String(ip),
        inline: true
      }

    ];

    /*
     * Add browser/device information.
     */
    for (
      const [name, value]
      of Object.entries(deviceInfo)
    ) {

      fields.push({
        name:
          String(name).slice(0, 256),

        value:
          String(value).slice(0, 1024),

        inline: true
      });

    }

    /*
     * Discord allows a maximum of
     * 25 embed fields.
     */
    const discordPayload = {

      content:
        'button clicked',

      embeds: [

        {
          title:
            '🔴 Mystery Button Clicked',

          description:
            'Public browser/device information collected from diagnostic.run',

          fields:
            fields.slice(0, 25),

          timestamp:
            new Date().toISOString()
        }

      ]

    };

    /*
     * Send the message to Discord.
     */
    const discordResponse =
      await fetch(
        webhook,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json'
          },

          body:
            JSON.stringify(
              discordPayload
            )
        }
      );

    /*
     * Discord webhooks normally return
     * 204 when successful.
     */
    if (!discordResponse.ok) {

      const errorText =
        await discordResponse.text();

      console.error(
        'Discord webhook error:',
        discordResponse.status,
        errorText
      );

      return new Response(
        JSON.stringify({
          ok: false,

          error:
            `Discord returned ${discordResponse.status}`,

          details:
            errorText.slice(0, 500)
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

    return new Response(
      JSON.stringify({
        ok: true
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
      'Mystery button error:',
      error
    );

    return new Response(
      JSON.stringify({
        ok: false,
        error:
          'Invalid request'
      }),
      {
        status: 400,

        headers: {
          'Content-Type':
            'application/json'
        }
      }
    );
  }
}
