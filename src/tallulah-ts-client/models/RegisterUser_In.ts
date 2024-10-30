/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UserRole } from './UserRole';

export type RegisterUser_In = {
    name: string;
    email: string;
    job_title: string;
    roles: Array<UserRole>;
    avatar?: (string | null);
    password: string;
    organization_id?: (string | null);
    organization_name?: (string | null);
};
