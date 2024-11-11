/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type SearchHistory_Db = {
    user_id: string;
    organization_id: string;
    query: string;
    social?: string;
    search_time: string;
    after?: (string | null);
    _id?: string;
};
