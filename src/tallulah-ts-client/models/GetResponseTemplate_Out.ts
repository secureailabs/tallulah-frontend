/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EmailBody } from './EmailBody';

export type GetResponseTemplate_Out = {
    name: string;
    subject?: (string | null);
    body?: (EmailBody | null);
    note?: (string | null);
    id: string;
    creation_time?: string;
    last_edit_time?: string;
};
