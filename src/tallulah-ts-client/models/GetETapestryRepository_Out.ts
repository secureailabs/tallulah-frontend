/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CardLayout } from './CardLayout';
import type { ETapestryRepositoryState } from './ETapestryRepositoryState';

export type GetETapestryRepository_Out = {
    name: string;
    description: string;
    card_layout?: (CardLayout | null);
    id: string;
    user_id: string;
    organization_id: string;
    last_refresh_time: string;
    state: ETapestryRepositoryState;
    creation_time?: string;
};
