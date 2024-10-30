/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EmailBody } from './EmailBody';

export type Body_reply_to_emails = {
    /**
     * Subject of the email
     */
    subject?: string;
    /**
     * Reply to the email
     */
    reply?: EmailBody;
};
