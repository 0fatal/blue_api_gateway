import { MidwayConfig } from '@midwayjs/core'

export default {
    // use for cookie sign key, should change to your own and keep security
    keys: '1646199237666_8403',
    koa: {
        port: 7001,
    },
    authService: {
        TOKEN_EXPIRE: 86400 * 30, // 60天
        AUTH_FLAG: 'GatewayAuth',
    },
    orm: {
        synchronize: true,
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '123456',
        database: 'blue_api_gateway',
    },
    cors: {
        credentials: false,
        allowHeaders: '*',
        allowMethods: '*',
        origin: '*',
    },
} as MidwayConfig
