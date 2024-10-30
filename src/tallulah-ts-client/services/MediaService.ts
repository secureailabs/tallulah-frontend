/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FormMediaTypes } from '../models/FormMediaTypes';
import type { GetStorageUrl_Out } from '../models/GetStorageUrl_Out';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class MediaService {

    /**
     * Get Media Upload Url
     * Get the upload url for the media
     * @param mediaType Media type
     * @returns GetStorageUrl_Out Successful Response
     * @throws ApiError
     */
    public static getMediaUploadUrl(
        mediaType: FormMediaTypes,
    ): CancelablePromise<GetStorageUrl_Out> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/media/upload',
            query: {
                'media_type': mediaType,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Media Download Url
     * Get the download url for the media
     * @param mediaId Form media id
     * @param mediaType Media type
     * @returns GetStorageUrl_Out Successful Response
     * @throws ApiError
     */
    public static getMediaDownloadUrl(
        mediaId: string,
        mediaType: FormMediaTypes,
    ): CancelablePromise<GetStorageUrl_Out> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/media/download',
            query: {
                'media_id': mediaId,
                'media_type': mediaType,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}