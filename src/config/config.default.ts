import { MidwayConfig } from '@midwayjs/core'
import { tmpdir } from 'os'
import { join } from 'path'
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
    cos: {
        // normal oss bucket
        client: {
            SecretId: 'AKIDkLl4D8ILG8qKcgU23qPilY6OSJwJRqzv',
            SecretKey: 'lJekdHhGc5LOEqEPN7dzA9uQghT3OUMz',
        },
    },
    upload: {
        mode: 'file',
        fileSize: '5mb',
        // whitelist: string[]，文件扩展名白名单
        whitelist: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'],
        // tmpdir: string，上传的文件临时存储路径
        tmpdir: join(tmpdir(), 'blue-upload-files'),
        // cleanTimeout: number，上传的文件在临时目录中多久之后自动删除，默认为 5 分钟
        cleanTimeout: 5 * 60 * 1000,
    },
} as MidwayConfig
