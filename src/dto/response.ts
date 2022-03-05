import { AccessToken } from '@/model/accessToken/accessToken'
import { ClassProperty } from '@/types'
import { defineProperties } from '@/utils/base'
import { Context } from '@midwayjs/koa'

export class AuthResp {
    err?: string
    errCode?: number
    httpCode?: number
    token?: AccessToken
    found?: boolean

    constructor(props: ClassProperty<AuthResp>) {
        defineProperties(this, props)
    }

    isValid() {
        return this.err === '' && this.token && this.token.isValid()
    }

    WarpProxyRequestHeader(ctx: Context) {
        const header = new Map<string, string | string[]>()
        header.set('User-Agent', ctx.header['User-Agent'])
        header.set('Referer', ctx.header['Referer'])
        if (this.isValid()) {
            header.set('staffID', this.token.staffID)
        } else {
            header.set('staffID', '')
        }
        return header
    }

    static makeSuccessAuth(token: AccessToken): AuthResp {
        return new AuthResp({ token: token, found: true })
    }

    static makeAuthNotFound(): AuthResp {
        return new AuthResp({
            err: 'unauthorized',
            errCode: 40100,
            httpCode: 401,
            found: false,
        })
    }
}

export class ServiceResp {
    code?: number
    data?: any
    msg?: string
    redirect?: string
}

export enum ResponseType {
    JSON = 0,
    REDIRECT = 1,
    HTML = 2,
    DIRECT = -1,
}

export class Response<T extends ResponseType> {
    type: T
    JSON: T extends ResponseType.JSON
        ? {
              code: number
              data?: any
              msg?: string
              httpCode?: number
          }
        : never

    redirect: T extends ResponseType.REDIRECT
        ? {
              httpCode: number
              url: string
          }
        : never

    render: T extends ResponseType.HTML
        ? {
              html: string
              params: any
              code: number
          }
        : never

    constructor(props: ClassProperty<Response<T>>) {
        defineProperties(this, props)
    }

    static MakeJSONSuccess(
        data: any,
        msg: string = 'success'
    ): Response<ResponseType.JSON> {
        return new Response({
            type: ResponseType.JSON,
            JSON: {
                code: 0,
                data: data,
                msg: msg,
                httpCode: 200,
            },
        })
    }

    static MakeJSONError(
        httpCode,
        code: number,
        msg: string
    ): Response<ResponseType.JSON> {
        return new Response({
            type: ResponseType.JSON,
            JSON: {
                code: code,
                msg: msg,
                httpCode: httpCode,
            },
        })
    }

    static MakeJSONErrorWithData(
        httpCode,
        code: number,
        msg: string,
        data: any
    ): Response<ResponseType.JSON> {
        return new Response({
            type: ResponseType.JSON,
            JSON: {
                code: code,
                msg: msg,
                data: data,
                httpCode: httpCode,
            },
        })
    }

    static MakeRedirect(url: string): Response<ResponseType.REDIRECT> {
        return new Response({
            type: ResponseType.REDIRECT,
            redirect: {
                url: url,
                httpCode: 302,
            },
        })
    }

    static MakeRender(
        code: number,
        html: string,
        params: any
    ): Response<ResponseType.HTML> {
        return new Response({
            type: ResponseType.HTML,
            render: {
                html: html,
                params: params,
                code: code,
            },
        })
    }

    static MakeDirect(data: any): Response<ResponseType.DIRECT> {
        return new Response({
            type: ResponseType.DIRECT,
        })
    }
}
