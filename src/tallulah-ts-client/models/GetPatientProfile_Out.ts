/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Guardian } from './Guardian';
import type { PatientProfileState } from './PatientProfileState';
import type { PatientRequests } from './PatientRequests';

export type GetPatientProfile_Out = {
    patient_id: string;
    repository_id: string;
    name: string;
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
    id: string;
    creation_time?: string;
    state?: PatientProfileState;
    organization_id: string;
    owner_id: string;
};
