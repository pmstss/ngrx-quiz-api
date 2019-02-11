import { MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS, MAIL_RESET_URL } from '../consts/consts';
const nodemailer = require('nodemailer'); // @types are outdated

// TODO improve with https://github.com/wildbit/postmark-templates
const resetMailTemplate = (username: string, url: string) => {
    return `
<h1>Hello ${username},</h1>
<p>You recently requested to reset your password for your <a href="https://rankme.pro">rankme.pro</a> account.</p>
<p>Please use following link to reset it: <a href="${url}">${url}</a>.</p>
<p><strong>This password reset is only valid for the next 24 hours.</strong></p>
<br>
<p>If you did not request a password reset, please ignore this email or
<a href="mailto:admin@rankme.pro">contact support</a> if you have questions.</p>
<br>
Thanks,
rankme.pro Administration
`;
};

export class Mailer {
    private static instance: Mailer;
    private transporter: any;

    constructor() {
        this.transporter = nodemailer.createTransport(
            {
                host: MAIL_HOST,
                port: MAIL_PORT,
                secure: false, // false for TLS
                auth: {
                    user: MAIL_USER,
                    pass: MAIL_PASS
                }
            }
        );
    }

    static getInstance() {
        if (!Mailer.instance) {
            Mailer.instance = new Mailer();
        }
        return Mailer.instance;
    }

    verify(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.transporter.verify((error: any, success: any) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(true);
                }
            });
        });
    }

    sendPasswordReset(username: string, email: string, token: string) {
        return new Promise((resolve: any, reject: any) => {
            const url = `${MAIL_RESET_URL}${token}`;
            this.transporter.sendMail(
                {
                    from: MAIL_USER,
                    to: email,
                    subject: 'rankme.pro password recovery',
                    text: `Hello, ${username}! Please reset your password here: ${url}`,
                    html: resetMailTemplate(username, url)
                },
                (error: any, info: any): void => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(info);
                    }
                }
            );
        });
    }
}
