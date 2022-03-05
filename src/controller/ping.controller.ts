import { Controller, Get, Provide } from '@midwayjs/decorator'

@Provide()
@Controller('/')
export class PingController {
    @Get('/ping')
    async ping() {
        return {
            success: true,
            message: 'pong',
        }
    }
}
