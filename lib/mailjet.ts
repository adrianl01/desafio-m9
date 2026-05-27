import { Client, SendEmailV3_1, LibraryResponse } from 'node-mailjet';

const mailjet = new Client({
  apiKey: process.env.MAILJET_API_KEY || '',
  apiSecret: process.env.MAILJET_SECRET_KEY || ''
});

interface EmailData {
  email: string;
  code: number;
}

export async function sendEmail(emaildata: EmailData) {
  const data: SendEmailV3_1.Body = {
    Messages: [
      {
        From: {
          Email: 'gustavo.adrian.leiva879@gmail.com',
          Name: 'Nido Shop'
        },

        To: [
          {
            Email: emaildata.email
          }
        ],

        Subject: 'Código de acceso',

        HTMLPart: `
          <h3>Tu código de autorización</h3>
          <h1>${emaildata.code}</h1>
          <p>El código vence en 20 minutos.</p>
        `,

        TextPart: `Tu código es: ${emaildata.code}`
      }
    ]
  };

  const result: LibraryResponse<SendEmailV3_1.Response> = await mailjet.post('send', { version: 'v3.1' }).request(data);

  const { Status } = result.body.Messages[0];

  if (Status === 'success') {
    console.log('Email sent successfully');
  } else {
    console.error('Failed to send email');
  }
}
