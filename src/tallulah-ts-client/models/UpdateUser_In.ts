/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UserAccountState } from './UserAccountState';
import type { UserRole } from './UserRole';

export type UpdateUser_In = {
    job_title?: (string | null);
    roles?: (Array<UserRole> | null);
    account_state?: (UserAccountState | null);
    avatar?: (string | null);
    phone?: (string | null);
};
