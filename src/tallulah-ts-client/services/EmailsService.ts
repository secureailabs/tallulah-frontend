/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_reply_to_emails } from '../models/Body_reply_to_emails';
import type { EmailState } from '../models/EmailState';
import type { GetMultipleEmail_Out } from '../models/GetMultipleEmail_Out';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class EmailsService {

    /**
     * Get All Emails
     * Get all the emails from the mailbox
     * @param mailboxId Mailbox id
     * @param skip Number of emails to skip
     * @param limit Number of emails to return
     * @param sortKey Sort key
     * @param sortDirection Sort direction
     * @param filterLabels Filter tags
     * @param filterState Filter state
     * @returns GetMultipleEmail_Out Successful Response
     * @throws ApiError
     */
    public static getAllEmails(
        mailboxId: string,
        skip?: number,
        limit: number = 20,
        sortKey: string = 'received_time',
        sortDirection: number = -1,
        filterLabels?: (Array<string> | null),
        filterState?: (Array<EmailState> | null),
    ): CancelablePromise<GetMultipleEmail_Out> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/emails/',
            query: {
                'mailbox_id': mailboxId,
                'skip': skip,
                'limit': limit,
                'sort_key': sortKey,
                'sort_direction': sortDirection,
                'filter_labels': filterLabels,
                'filter_state': filterState,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Reply To Emails
     * Reply to one email or a tag, or a list of emails or tags
     * @param mailboxId Mailbox id
     * @param emailIds List of email ids
     * @param labels List of tag ids
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static replyToEmails(
        mailboxId: string,
        emailIds?: (Array<string> | null),
        labels?: (Array<string> | null),
        requestBody?: Body_reply_to_emails,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/emails/replies',
            query: {
                'mailbox_id': mailboxId,
                'email_ids': emailIds,
                'labels': labels,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `No emails or tags provided`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Email Label
     * Update the label of an email
     * @param emailId Email id
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static updateEmailLabel(
        emailId: string,
        requestBody?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/emails/{email_id}',
            path: {
                'email_id': emailId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

}