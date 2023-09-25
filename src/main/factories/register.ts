import { InMemoryUserRepository } from '@test/usecases/register-user-on-mailing-list/repository'
import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'
import { RegisterUserController } from '@/web-controllers'

export const makeRegisterUserController = (): RegisterUserController => {
  const inMemoryUserRepository = new InMemoryUserRepository([])
  const registerUserOnMailingListUseCase = new RegisterUserOnMailingList(inMemoryUserRepository)
  return new RegisterUserController(registerUserOnMailingListUseCase)
}
