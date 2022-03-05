import { ClassPropertyWithExcludeExtend } from '@/types'
import { defineProperties } from '@/utils/base'

export const BasicExceptionType = {
    SERVER_ERROR: {
        errCode: 500,
        err: 'server error',
        httpCode: 500,
    },
    NOT_FOUND: {
        errCode: 404,
        err: 'not found',
        httpCode: 404,
    },
    BAD_REQUEST: {
        errCode: 400,
        err: 'bad request',
        httpCode: 400,
    },
    UNAUTHORIZED: {
        errCode: 40100,
        err: 'unauthorized',
        httpCode: 401,
    },
    FORBIDDEN: {
        errCode: 403,
        err: 'forbidden',
        httpCode: 403,
    },
} as const

export class CustomException extends Error {
    errCode?: number
    err?: string
    httpCode?: number = 500
    payload?: any

    constructor(props: ClassPropertyWithExcludeExtend<CustomException, Error>) {
        super()
        defineProperties(this, props)
    }

    ErrCode(): number {
        return this.errCode
    }

    Err(): string {
        return this.err
    }

    HttpCode(): number {
        return this.httpCode
    }

    toString(): string {
        return `[errCode: ${this.errCode} httpCode: ${this.httpCode}]${this.err}\n\t\t${this.payload}`
    }

    static Make<T extends keyof typeof BasicExceptionType>(
        type: T,
        payload?: any
    ): CustomException {
        return new CustomException({ ...BasicExceptionType[type], payload })
    }
}
