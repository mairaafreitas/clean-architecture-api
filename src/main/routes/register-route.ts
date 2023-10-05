import { makeRegisterAndSendEmailController } from '@/main/factories/'
import { type Router } from 'express'
import { adaptRoute } from '@/main/adapters'

export default (router: Router): void => {
  router.post('/register', adaptRoute(makeRegisterAndSendEmailController()))
}
