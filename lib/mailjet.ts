import { Client, SendEmailV3_1, LibraryResponse } from 'node-mailjet';

const mailjet = new Client({
    apiKey: process.env.MAILJET_API_KEY,
    apiSecret: process.env.MAILJET_SECRET_KEY
});

export async function sendEmail(emaildata) {
    const data: SendEmailV3_1.Body = {
        Messages: [
            {
                From: {
                    Email: 'gustavo.adrian.leiva879@gmail.com',
                },
                To: [
                    {
                        Email: emaildata.email,
                    },
                ],
                TemplateErrorReporting: {
                    Email: 'ga.leiva.1601@gmail.com',
                    Name: 'Reporter',
                },
                TemplateLanguage: true,
                TemplateErrorDeliver: true,
                Subject: 'Email Code',
                HTMLPart: '<h3>Tu código de autorización</h3>' + emaildata.code,
                TextPart: 'Dear passenger, welcome to Mailjet! May the delivery force be with you!',
            },
        ],
    };

    const result: LibraryResponse<SendEmailV3_1.Response> = await mailjet
        .post('send', { version: 'v3.1' })
        .request(data);

    const { Status } = result.body.Messages[0];
    console.log("sendEmail")
}