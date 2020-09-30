export class Email {
    to?: string;
    subject?: string;
    content?: string;
    isMultipart?: boolean;;
    isHtml?: boolean;
    attachments: []
}