/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PostState } from './PostState';
import type { RedditPost } from './RedditPost';

export type PostTagResponse = {
    id: string;
    social?: string;
    post: RedditPost;
    status: PostState;
    added_time: string;
    user_name: string;
    job_title: string;
    contact_method?: (string | null);
    contacted_at?: (string | null);
    contacted_by?: (string | null);
};
