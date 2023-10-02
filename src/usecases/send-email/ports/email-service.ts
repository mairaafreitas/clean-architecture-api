import { type Either } from '@/shared'
import { type MailServiceError } from '@/usecases/errors'

export interface EmailAttachment {
  filename: string
  contentType: string
}

export interface EmailOptions {
  readonly host: string
  readonly port: number
  readonly username: string
  readonly password: string
  readonly from: string
  readonly to: string
  readonly subject: string
  readonly text: string
  readonly html: string
  readonly attachments: EmailAttachment[]
}

export interface EmailService {
  send: (options: EmailOptions) => Promise<Either<MailServiceError, EmailOptions>>
}
