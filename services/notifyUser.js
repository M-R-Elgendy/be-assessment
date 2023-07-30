import nodemailer from 'nodemailer';

class Notification {
    constructor() {
        this.channels = [];
    }

    addChannel(channel) {
        this.channels.push(channel);
    }

    removeChannel(channel) {
        const index = this.channels.indexOf(channel);
        if (index > -1) {
            this.channels.splice(index, 1);
        }
    }

    send(message, recipient) {
        this.channels.forEach((channel) => {
            channel.sendMessage(message, recipient);
        });
    }
}

class SlackNotificationChannel {
    constructor(webhookUrl) {
        this.webhookUrl = webhookUrl;
    }

    sendMessage(message, recipient) {
        // Send the message via Slack webhook
        console.log(`Sending Slack notification to ${recipient}: ${message}`);
    }
}

class FirebaseNotificationChannel {
    constructor(credentials) {
        this.credentials = credentials;
    }

    sendMessage(message, recipient) {
        // Send the message via Firebase
        console.log(`Sending Firebase notification to ${recipient}: ${message}`);
    }
}

class EmailNotificationChannel {
    constructor(options) {
        this.options = options;
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            }
        });
    }

    sendMessage(message, recipient) {
        const mailOptions = {
            from: process.env.EMAIL_USERNAME,
            to: recipient,
            subject: this.options.subject,
            text: message,
        };
        this.transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
            } else {
                console.log(`Email sent to ${recipient}: ${info.response}`);
            }
        });
    }
}

const notification = new Notification();
// notification.addChannel(new SlackNotificationChannel('https://slack.com/webhook'));
// notification.addChannel(new FirebaseNotificationChannel({/* Firebase credentials */}));
notification.addChannel(new EmailNotificationChannel({ subject: 'URL Monitor APP' }));

export default notification;
