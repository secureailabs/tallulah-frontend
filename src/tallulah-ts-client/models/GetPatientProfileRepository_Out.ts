/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CardLayout } from './CardLayout';
import type { PatientProfileRepositoryState } from './PatientProfileRepositoryState';

export type GetPatientProfileRepository_Out = {
    name: string;
    description?: (string | null);
    card_layout?: (CardLayout | null);
    id: string;
    user_id: string;
    organization_id: string;
    creation_time: string;
    state: PatientProfileRepositoryState;
};
