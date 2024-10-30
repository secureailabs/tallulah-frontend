/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AudioMetadata } from './AudioMetadata';
import type { ImageMetadata } from './ImageMetadata';
import type { VideoMetadata } from './VideoMetadata';

export type FormDataMetadata = {
    video_metadata?: Array<VideoMetadata>;
    audio_metadata?: Array<AudioMetadata>;
    image_metadata?: Array<ImageMetadata>;
    structured_data?: any;
    creation_time?: string;
};
