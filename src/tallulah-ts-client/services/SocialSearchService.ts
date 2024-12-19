/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PostTagResponse } from '../models/PostTagResponse';
import type { PostTagUpdate } from '../models/PostTagUpdate';
import type { RedditPost } from '../models/RedditPost';
import type { SearchHistoryResponse } from '../models/SearchHistoryResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SocialSearchService {

    /**
     * Search History
     * Search History
     * @param sortKey Sort key
     * @param sortDirection Sort direction
     * @param skip Number of form data to skip
     * @param limit Number of form data to return
     * @returns SearchHistoryResponse Successful Response
     * @throws ApiError
     */
    public static searchHistory(
        sortKey: string = 'search_time',
        sortDirection: number = -1,
        skip?: number,
        limit: number = 10,
    ): CancelablePromise<Array<SearchHistoryResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/social/search/history',
            query: {
                'sort_key': sortKey,
                'sort_direction': sortDirection,
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Reddit Search
     * Reddit Search
     * @param query Search query
     * @param filterPatientStories Filter patient stories
     * @param after Page after, use value from name field
     * @returns RedditPost Successful Response
     * @throws ApiError
     */
    public static redditSearch(
        query: string,
        filterPatientStories: boolean = true,
        after?: (string | null),
    ): CancelablePromise<Array<RedditPost>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/social/search/reddit',
            query: {
                'query': query,
                'filter_patient_stories': filterPatientStories,
                'after': after,
            },
            errors: {
                400: `Query is required`,
                404: `No results found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Reddit Tags
     * Reddit Tagged Posts
     * @param userId User ID
     * @param sortKey Sort key
     * @param sortDirection Sort direction
     * @param skip Number of form data to skip
     * @param limit Number of form data to return
     * @returns PostTagResponse Successful Response
     * @throws ApiError
     */
    public static redditTags(
        userId?: (string | null),
        sortKey: string = 'added_time',
        sortDirection: number = -1,
        skip?: number,
        limit: number = 10,
    ): CancelablePromise<Array<PostTagResponse>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/social/search/reddit/tags',
            query: {
                'user_id': userId,
                'sort_key': sortKey,
                'sort_direction': sortDirection,
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Reddit Add Tag
     * Reddit Tagged Posts
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static redditAddTag(
        requestBody: RedditPost,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/social/search/reddit/tags',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Reddit Update Tag
     * Reddit Tagged Post Update
     * @param postId Post ID
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static redditUpdateTag(
        postId: string,
        requestBody: PostTagUpdate,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/social/search/reddit/tags/{post_id}',
            path: {
                'post_id': postId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

}