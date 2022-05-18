import { Response } from '@/dto/response'
import { CustomException } from '@/exception'
import { AuthService } from '@/service/Auth/Auth.service'
import { COSService } from '@midwayjs/cos'
import { Controller, Files, Inject, Post, Provide } from '@midwayjs/decorator'
import { Context } from '@midwayjs/koa'
import { UploadFileInfo } from '@midwayjs/upload'
import { randomUUID } from 'crypto'

@Provide()
@Controller('/v1/upload')
export class AuthController {
    @Inject()
    cosService: COSService

    @Inject()
    authService: AuthService

    @Inject()
    ctx: Context

    @Post('')
    async saveFile(@Files() files: UploadFileInfo<string>[]) {
        const authStatus = this.authService.getAuthStatus(this.ctx)
        if (!authStatus.isValid()) {
            throw CustomException.Make('UNAUTHORIZED')
        }

        const res = await this.cosService.uploadFiles({
            files: files.map(file => ({
                FilePath: file.data,
                Bucket: 'blue-1303950953',
                Region: 'ap-shanghai',
                Key: randomUUID(),
            })),
        })

        const data = res.files.map((file, idx) => {
            return {
                url: file.data.Location
                    ? `https://${file.data.Location}`
                    : null,
                error: file.error,
            }
        })

        return Response.MakeJSONSuccess(data)
    }
}
