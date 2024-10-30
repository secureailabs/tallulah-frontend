/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CardLayout } from './CardLayout';

export type RegisterETapestryRepository_In = {
    name: string;
    description: string;
    card_layout?: (CardLayout | null);
    database_name: string;
    api_key: string;
};
