/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CardLayout } from './CardLayout';
import type { FormFieldGroup_Input } from './FormFieldGroup_Input';

export type RegisterFormTemplate_In = {
    name: string;
    description?: (string | null);
    field_groups?: Array<FormFieldGroup_Input>;
    card_layout?: (CardLayout | null);
    logo?: (string | null);
};
