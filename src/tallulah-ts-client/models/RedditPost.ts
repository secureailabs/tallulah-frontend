/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type RedditPost = {
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
};
