/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CardLayout } from './CardLayout';
import type { FormFieldGroup_Input } from './FormFieldGroup_Input';

export type UpdateFormTemplate_In = {
    name?: (string | null);
    description?: (string | null);
    field_groups?: (Array<FormFieldGroup_Input> | null);
    card_layout?: (CardLayout | null);
    logo?: (string | null);
};
