/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UserRole } from './UserRole';

export type GetUsers_Out = {
    name: string;
    email: string;
    job_title: string;
    roles: Array<UserRole>;
    avatar?: (string | null);
    id: string;
    organization_id: string;
};
