/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CardLayout } from './CardLayout';
import type { FormFieldGroup_Output } from './FormFieldGroup_Output';
import type { FormTemplateState } from './FormTemplateState';

export type GetFormTemplate_Out = {
    name: string;
    description?: (string | null);
    field_groups?: Array<FormFieldGroup_Output>;
    card_layout?: (CardLayout | null);
    logo?: (string | null);
    id: string;
    creation_time?: string;
    state: FormTemplateState;
    last_edit_time?: string;
    email_subscription?: (Array<string> | null);
};
