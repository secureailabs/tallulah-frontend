/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Guardian } from './Guardian';
import type { PatientRequests } from './PatientRequests';

export type UpdatePatientProfile_In = {
    name?: (string | null);
    race?: (string | null);
    ethnicity?: (string | null);
    gender?: (string | null);
    primary_cancer_diagnosis?: (string | null);
    social_worker_name?: (string | null);
    social_worker_organization?: (string | null);
    date_of_diagnosis?: (string | null);
    age?: (number | null);
    guardians?: (Array<Guardian> | null);
    household_details?: (string | null);
    family_net_monthly_income?: (number | null);
    address?: (string | null);
    recent_requests?: (Array<PatientRequests> | null);
    photos?: (Array<string> | null);
    videos?: (Array<string> | null);
    notes?: (string | null);
    tags?: (Array<string> | null);
};
