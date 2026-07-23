/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_auth_cookie_login_api_auth_login_post } from '../models/Body_auth_cookie_login_api_auth_login_post';
import type { Body_reset_forgot_password_api_auth_forgot_password_post } from '../models/Body_reset_forgot_password_api_auth_forgot_password_post';
import type { Body_reset_reset_password_api_auth_reset_password_post } from '../models/Body_reset_reset_password_api_auth_reset_password_post';
import type { Body_verify_verify_api_auth_verify_post } from '../models/Body_verify_verify_api_auth_verify_post';
import type { OAuth2AuthorizeResponse } from '../models/OAuth2AuthorizeResponse';
import type { UserBeforeVerify } from '../models/UserBeforeVerify';
import type { UserCreate } from '../models/UserCreate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
    /**
     * Auth:Cookie.Login
     * @param formData
     * @returns any Successful Response
     * @throws ApiError
     */
    public static authCookieLoginApiAuthLoginPost(
        formData: Body_auth_cookie_login_api_auth_login_post,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/login',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                400: `Bad Request`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Auth:Cookie.Logout
     * @returns any Successful Response
     * @throws ApiError
     */
    public static authCookieLogoutApiAuthLogoutPost(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/logout',
            errors: {
                401: `Missing token or inactive user.`,
            },
        });
    }
    /**
     * Register:Register
     * Не регирируем пользователя сразу,
     * создаем данные для регистрации и валидируем их
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static registerRegisterApiAuthRegisterPost(
        requestBody: UserCreate,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/register',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Reset:Forgot Password
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static resetForgotPasswordApiAuthForgotPasswordPost(
        requestBody: Body_reset_forgot_password_api_auth_forgot_password_post,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/forgot-password',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Reset:Reset Password
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static resetResetPasswordApiAuthResetPasswordPost(
        requestBody: Body_reset_reset_password_api_auth_reset_password_post,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/reset-password',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Verify:Verify
     * @param requestBody
     * @returns UserBeforeVerify Successful Response
     * @throws ApiError
     */
    public static verifyVerifyApiAuthVerifyPost(
        requestBody: Body_verify_verify_api_auth_verify_post,
    ): CancelablePromise<UserBeforeVerify> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/verify',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Oauth:Google.Cookie.Authorize
     * @param scopes
     * @returns OAuth2AuthorizeResponse Successful Response
     * @throws ApiError
     */
    public static oauthGoogleCookieAuthorizeApiAuthGoogleAuthorizeGet(
        scopes?: Array<string>,
    ): CancelablePromise<OAuth2AuthorizeResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/auth/google/authorize',
            query: {
                'scopes': scopes,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Oauth:Google.Cookie.Callback
     * The response varies based on the authentication backend used.
     * @param code
     * @param codeVerifier
     * @param state
     * @param error
     * @returns any Successful Response
     * @throws ApiError
     */
    public static oauthGoogleCookieCallbackApiAuthGoogleCallbackGet(
        code?: (string | null),
        codeVerifier?: (string | null),
        state?: (string | null),
        error?: (string | null),
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/auth/google/callback',
            query: {
                'code': code,
                'code_verifier': codeVerifier,
                'state': state,
                'error': error,
            },
            errors: {
                400: `Bad Request`,
                422: `Validation Error`,
            },
        });
    }
    /**
     * Token:Refresh Token
     * @returns void
     * @throws ApiError
     */
    public static tokenRefreshTokenApiAuthRefreshPost(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/refresh',
            errors: {
                400: `Bad Request`,
                401: `Missing token or inactive user.`,
            },
        });
    }
}
