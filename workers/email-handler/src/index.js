import postalMime from 'postal-mime';

const worker = {
  async email(message, env) {
    const parser = new postalMime();
    const parsedEmail = await parser.parse(message.raw);
    const attachments = [];
    const baseUrl = env.R2_PUBLIC_URL || '';

    if (parsedEmail.attachments && parsedEmail.attachments.length > 0) {
      for (const att of parsedEmail.attachments) {
        const fileName = `${Date.now()}-${att.filename || 'adjunto'}`;
        await env.EMAIL_BUCKET.put(fileName, att.content, {
          httpMetadata: { contentType: att.mimeType },
        });
        attachments.push({
          filename: att.filename,
          mimeType: att.mimeType,
          url: `${baseUrl}/${fileName}`,
        });
      }
    }

    const payload = {
      messageId: message.headers.get('message-id'),
      from: message.from,
      to: message.to,
      subject: parsedEmail.subject || '(Sin asunto)',
      bodyText: parsedEmail.text || '',
      bodyHtml: parsedEmail.html || '',
      direction: 'INBOUND',
      attachments: attachments,
    };

    const response = await fetch('https://criminon.org.co/api/webhooks/incoming-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.WEBHOOK_SECRET}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Webhook respondio ${response.status}`);
    }
  },
};

export default worker;
