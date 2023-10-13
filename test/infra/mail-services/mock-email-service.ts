import { type Either, right } from '@/shared'
import { type MailServiceError } from '@/usecases/errors'
import { type EmailService, type EmailOptions } from '@/usecases/send-email/ports'

export class MailServiceMock implements EmailService {
  public static timesSendWasCalled = 0
  async send (emailOptions: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
    MailServiceMock.timesSendWasCalled++
    return right(emailOptions)
  }
}
