import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'
import { RegisterAndSendEmailController } from '@/web-controllers'
import { MongodbUserRepository } from '@/infra/repositories/mongodb'

export const makeRegisterAndSendEmailController = (): RegisterAndSendEmailController => {
  const mongoDbUserRepository = new MongodbUserRepository()
  const registerUserOnMailingListUseCase = new RegisterUserOnMailingList(mongoDbUserRepository)
  return new RegisterAndSendEmailController(registerUserOnMailingListUseCase)
}
