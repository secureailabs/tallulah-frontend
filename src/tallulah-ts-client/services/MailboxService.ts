/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GetMailbox_Out } from '../models/GetMailbox_Out';
import type { GetMultipleMailboxes_Out } from '../models/GetMultipleMailboxes_Out';
import type { RegisterMailbox_In } from '../models/RegisterMailbox_In';
import type { RegisterMailbox_Out } from '../models/RegisterMailbox_Out';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class MailboxService {

    /**
     * Get All Mailboxes
     * Get all the mailboxes for the current user
     * @returns GetMultipleMailboxes_Out Successful Response
     * @throws ApiError
     */
    public static getAllMailboxes(): CancelablePromise<GetMultipleMailboxes_Out> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mailbox/',
        });
    }

    /**
     * Add New Mailbox
     * Add a new mailbox by code
     * @param requestBody
     * @returns RegisterMailbox_Out Successful Response
     * @throws ApiError
     */
    public static addNewMailbox(
        requestBody: RegisterMailbox_In,
    ): CancelablePromise<RegisterMailbox_Out> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/mailbox/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid mailbox provider`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Mailbox
     * Get the mailbox for the current user
     * @param mailboxId Mailbox id
     * @returns GetMailbox_Out Successful Response
     * @throws ApiError
     */
    public static getMailbox(
        mailboxId: string,
    ): CancelablePromise<GetMailbox_Out> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/mailbox/{mailbox_id}',
            path: {
                'mailbox_id': mailboxId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete Mailbox
     * Delete the mailbox and all the emails for the current user
     * @param mailboxId Mailbox id
     * @returns void
     * @throws ApiError
     */
    public static deleteMailbox(
        mailboxId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/mailbox/{mailbox_id}',
            path: {
                'mailbox_id': mailboxId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}