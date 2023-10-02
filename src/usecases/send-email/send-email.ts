import { type UserData } from '@/entities'
import { type UseCase } from '../ports'
import { type EmailOptions, type EmailService } from './ports'
import { type MailServiceError } from '../errors'
import { type Either } from '@/shared'

export class SendEmail implements UseCase {
  private readonly emailOptions: EmailOptions
  private readonly emailService: EmailService

  constructor (emailOptions: EmailOptions, emailService: EmailService) {
    this.emailOptions = emailOptions
    this.emailService = emailService
  }

  async perform (user: UserData):
  Promise<Either<MailServiceError, EmailOptions>> {
    const greetings = 'E aí <b>' + user.name + '</b>, beleza?'
    const customizedHtml = greetings + '<br> <br>' + this.emailOptions.html
    const emailInfo: EmailOptions = {
      host: this.emailOptions.host,
      port: this.emailOptions.port,
      username: this.emailOptions.username,
      password: this.emailOptions.password,
      from: this.emailOptions.from,
      to: user.name + '<' + user.email + '>',
      subject: this.emailOptions.subject,
      text: this.emailOptions.text,
      html: customizedHtml,
      attachments: this.emailOptions.attachments
    }
    return await this.emailService.send(emailInfo)
  }
}
// export class SendEmail implements UseCase {
//   private readonly emailOptions: EmailOptions
//   private readonly emailService: EmailService

//   constructor (emailOptions: EmailOptions, emailService: EmailService) {
//     this.emailOptions = emailOptions
//     this.emailService = emailService
//   }

//   async perform (userData: UserData): Promise<Either<MailServiceError, EmailOptions>> {
//     const greetings = `E aí <b> ${userData.name} </b>, beleza?`
//     const customizedHtml = `${greetings}<br><br>${this.emailOptions.html}`
//     const emailInfo: EmailOptions = {
//       ...this.emailOptions,
//       to: `${userData.name}<${userData.email}>`,
//       html: customizedHtml
//     }
//     return await this.emailService.send(emailInfo)
//   }
// }
