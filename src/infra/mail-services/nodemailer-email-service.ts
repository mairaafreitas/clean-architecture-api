import { right, type Either, left } from '@/shared'
import { MailServiceError } from '@/usecases/errors'
import { type EmailOptions, type EmailService } from '@/usecases/send-email/ports'
import * as nodemailer from 'nodemailer'

export class NodemailerEmailService implements EmailService {
  async send (options: EmailOptions): Promise<Either<MailServiceError, EmailOptions>> {
    try {
      const transporter = nodemailer.createTransport({
        host: options.host,
        port: options.port,
        auth: {
          user: options.username,
          password: options.password
        }
      })
      await transporter.sendMail({
        from: options.from,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        attachments: options.attachments
      })
    } catch (error) {
      return left(new MailServiceError())
    }
    return right(options)
  }
}
