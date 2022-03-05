import { Application, Framework } from '@midwayjs/koa'
import { AuthService } from './Auth.service'
import { close, createApp } from '@midwayjs/mock'

describe('test/service/auth/auth.service.ts', () => {
    let app: Application
    beforeAll(async () => {
        // 只创建一次 app，可以复用
        try {
            // 由于Jest在BeforeAll阶段的error会忽略，所以需要包一层catch
            // refs: https://github.com/facebook/jest/issues/8688
            app = await createApp<Framework>()
        } catch (err) {
            console.error('test beforeAll error', err)
            throw err
        }
    })

    afterAll(async () => {
        // close app
        await close(app)
    })

    it('register user', async () => {
        const authService = await app
            .getApplicationContext()
            .getAsync<AuthService>(AuthService)
        const user = await authService.registerUser(
            '20051000',
            '123456',
            'admin'
        )
        return expect(user).toBeTruthy()
    })
})
