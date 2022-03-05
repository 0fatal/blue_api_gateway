import { Configuration, App } from '@midwayjs/decorator'
import * as koa from '@midwayjs/koa'
import * as validate from '@midwayjs/validate'
import * as info from '@midwayjs/info'
import { join } from 'path'
// import { DefaultErrorFilter } from './filter/default.filter';
// import { NotFoundFilter } from './filter/notfound.filter';
import 'tsconfig-paths/register'
import * as orm from '@midwayjs/orm'
import { AuthMiddleware } from '@/middleware/auth.middleware'
import * as crossDomain from '@midwayjs/cross-domain'
import { ReportMiddleware } from './middleware/report.middleware'
import { ExceptionMiddleware } from './middleware/exception.middleware'
import { RespMiddleware } from './middleware/resp.middleware'
import { NotFoundFilter } from './filter/notfound.filter'
import { DefaultErrorFilter } from './filter/default.filter'
import 'tsconfig-paths/register'

@Configuration({
    imports: [
        koa,
        validate,
        orm,
        crossDomain,
        {
            component: info,
            enabledEnvironment: ['local'],
        },
    ],
    importConfigs: [join(__dirname, './config')],
})
export class ContainerLifeCycle {
    @App()
    app: koa.Application

    async onReady() {
        // add middleware
        this.app.useMiddleware([
            ReportMiddleware,
            RespMiddleware,
            ExceptionMiddleware,
            AuthMiddleware,
        ])
        // add filter
        this.app.useFilter([NotFoundFilter, DefaultErrorFilter])
    }
}
