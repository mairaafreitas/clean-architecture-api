import { type RegisterUserOnMailingList } from '@/usecases/register-user-on-mailing-list'
import { type SendEmail } from '@/usecases/send-email'
import { type UseCase } from '@/usecases/ports'
import { User, type UserData } from '@/entities'
import { type InvalidEmailError, type InvalidNameError } from '@/entities/errors'
import { type MailServiceError } from '@/usecases/errors'
import { type Either, left, right } from '@/shared'

export class RegisterAndSendEmail implements UseCase {
  private readonly registerUserOnMailingList: RegisterUserOnMailingList
  private readonly sendEmail: SendEmail

  constructor (registerUserOnMailingList: RegisterUserOnMailingList, sendEmail: SendEmail) {
    this.registerUserOnMailingList = registerUserOnMailingList
    this.sendEmail = sendEmail
  }

  async perform (request: UserData): Promise<Either<InvalidNameError | InvalidEmailError | MailServiceError, UserData>> {
    const userOrError: Either<InvalidNameError | InvalidEmailError, User> = User.create(request)
    if (userOrError.isLeft()) {
      return left(userOrError.value)
    }
    const user = userOrError.value

    await this.registerUserOnMailingList.perform(user)

    const result = await this.sendEmail.perform(user)
    if (result.isLeft()) {
      return left(result.value)
    }

    return right({ name: user.name.value, email: user.email.value })
  }
}
