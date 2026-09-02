export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // API endpoint
    if (url.pathname === '/api/button-click') {
      if (request.method === 'GET') {
        return Response.json({
          ok: true,
          message: 'Mystery button API is online'
        });
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

      const webhook = env.DISCORD_WEBHOOK_URL;

      if (!webhook) {
        console.error('DISCORD_WEBHOOK_URL is missing');

        return Response.json(
          {
            ok: false,
            error: 'DISCORD_WEBHOOK_URL is missing from Cloudflare'
          },
          { status: 500 }
        );
      }

      let body;

      try {
        body = await request.json();
      } catch {
        return Response.json(
          {
            ok: false,
            error: 'Invalid JSON request'
          },
          { status: 400 }
        );
      }

      const deviceInfo = body?.deviceInfo || {};

      const ip =
        request.headers.get('CF-Connecting-IP') ||
        'Unavailable';

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

      try {
        const discordResponse = await fetch(webhook, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(discordPayload)
        });

        if (!discordResponse.ok) {
          const errorText = await discordResponse.text();

          console.error(
            'Discord webhook failed:',
            discordResponse.status,
            errorText
          );

          return Response.json(
            {
              ok: false,
              error: `Discord returned ${discordResponse.status}`
            },
            { status: 502 }
          );
        }

        return Response.json({
          ok: true,
          message: 'Sent to Discord'
        });
      } catch (error) {
        console.error('Discord request error:', error);

        return Response.json(
          {
            ok: false,
            error: 'Could not contact Discord'
          },
          { status: 502 }
        );
      }
    }

    // Everything else goes to the React site
    return env.ASSETS.fetch(request);
  }
};
