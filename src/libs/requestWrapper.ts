// requestWrapper.ts
import { request as originalRequest } from '@/tallulah-ts-client/core/request'
import { OpenAPI, OpenAPIConfig } from '@/tallulah-ts-client/core/OpenAPI'
import { AuthenticationService } from '@/tallulah-ts-client/services/AuthenticationService'
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ApiRequestOptions } from '@/tallulah-ts-client/core/ApiRequestOptions'
import { OnCancel } from '@/tallulah-ts-client/core/CancelablePromise'

// Wrapper function for refreshing the access token
const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = localStorage.getItem('refresh_token')
  if (refreshToken) {
    try {
      const response = await AuthenticationService.getRefreshToken({ refresh_token: refreshToken })
      if (response.access_token) {
        localStorage.setItem('access_token', response.access_token)
        localStorage.setItem('refresh_token', response.refresh_token)
        OpenAPI.TOKEN = async () => response.access_token
        return response.access_token
      }
    } catch (error) {
      console.error('Failed to refresh token', error)
      throw error
    }
  }
  throw new Error('Refresh token not available')
}

// Wrapper function to send requests with retry logic
const sendRequest = async <T>(
  config: OpenAPIConfig,
  options: ApiRequestOptions,
  url: string,
  body: any,
  formData: FormData | undefined,
  headers: Record<string, string>,
  onCancel: OnCancel
): Promise<AxiosResponse<T>> => {
  const source = axios.CancelToken.source()

  const requestConfig: AxiosRequestConfig = {
    url,
    headers,
    data: body ?? formData,
    method: options.method,
    withCredentials: config.WITH_CREDENTIALS,
    cancelToken: source.token
  }

  onCancel(() => source.cancel('The user aborted a request.'))

  let retryAttempt = 0
  let shouldRetry = true

  while (retryAttempt < 2 && shouldRetry) {
    try {
      return await axios.request(requestConfig)
    } catch (error) {
      const axiosError = error as AxiosError

      if (axiosError.response && axiosError.response.status === 401 && !url.includes('refresh-token')) {
        retryAttempt++
        if (retryAttempt < 2 && shouldRetry) {
          try {
            const newAccessToken = await refreshAccessToken()
            // @ts-ignore
            requestConfig.headers['Authorization'] = `Bearer ${newAccessToken}`
            continue
          } catch (refreshError) {
            console.error('Error refreshing token', refreshError)
            shouldRetry = false
            throw refreshError
          }
        } else {
          shouldRetry = false
        }
      } else {
        shouldRetry = false
      }

      if (axiosError.response) {
        return axiosError.response as AxiosResponse<T>
      }
      throw error
    }
  }

  throw new Error('Request failed after retry attempt')
}
