/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { app__models__content_generation__ContentGenerationState } from './app__models__content_generation__ContentGenerationState';

export type GetContentGeneration_Out = {
    template_id: string;
    values: any;
    id: string;
    state: app__models__content_generation__ContentGenerationState;
    generated?: (string | null);
    error_message?: (string | null);
    creation_time: string;
};
