/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GetPatientProfile_Out } from './GetPatientProfile_Out';

export type GetMultiplePatientProfiles_Out = {
    count: number;
    next?: number;
    limit?: number;
    patient_profiles: Array<GetPatientProfile_Out>;
};
