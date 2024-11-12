/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PostState } from './PostState';

export type RedditPost_Db = {
    reddit_id: string;
    name: string;
    link: string;
    author: string;
    author_link: string;
    title: string;
    subreddit: string;
    selftext?: (string | null);
    images: Array<string>;
    post_time: string;
    created_utc: number;
    is_patient_story?: (boolean | null);
    _id?: string;
    organization_id: string;
    status?: PostState;
    added_time?: string;
    added_by: string;
};
