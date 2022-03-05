import { Rule, RuleType } from '@midwayjs/validate'

export class LoginRequest {
    @Rule(RuleType.string().min(5).max(10).required())
    staffID: string

    @Rule(RuleType.string().min(6).max(20).required())
    password: string
}
