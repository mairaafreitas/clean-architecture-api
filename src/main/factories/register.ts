import { RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'
import { RegisterAndSendEmailController } from '@/web-controllers'
import { MongodbUserRepository } from '@/infra/repositories/mongodb'
import { SendEmail } from '@/usecases/send-email'
import { NodemailerEmailService } from '@/infra/mail-services'
import { getEmailOptions } from '@/main/config/email'
import { RegisterAndSendEmail } from '@/usecases/register-and-send-email'

export const makeRegisterAndSendEmailController = (): RegisterAndSendEmailController => {
  const mongoDbUserRepository = new MongodbUserRepository()
  const registerUserOnMailingList = new RegisterUserOnMailingList(mongoDbUserRepository)
  const emailService = new NodemailerEmailService()
  const sendEmailUsecase = new SendEmail(getEmailOptions(), emailService)
  const registerAndSendEmailUseCase = new RegisterAndSendEmail(registerUserOnMailingList, sendEmailUsecase)
  const registerUserOnMailingListController = new RegisterAndSendEmailController(registerAndSendEmailUseCase)
  return registerUserOnMailingListController
}
