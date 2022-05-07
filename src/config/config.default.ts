import { MidwayConfig } from '@midwayjs/core'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

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
        host: '121.36.224.18',
        port: 22223,
        username: 'root',
        password: 'root22223',
        database: 'blue_dev',
        namingStrategy: new SnakeNamingStrategy(),
    },
    cors: {
        credentials: false,
        allowHeaders: '*',
        allowMethods: '*',
        origin: '*',
    },
    view: {
        defaultViewEngine: 'nunjucks',
        mapping: {
            '.nj': 'nunjucks',
        },
    },
} as MidwayConfig
