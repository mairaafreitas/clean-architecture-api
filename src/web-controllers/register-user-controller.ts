import { type HttpRequest, type HttpResponse } from '@/web-controllers/ports'
import { type UserData } from '@/entities'
import { badRequest, ok, serverError } from '@/web-controllers/util'
import { MissingParamError } from './errors'
import { type UseCase } from '@/usecases/ports'

export class RegisterAndSendEmailController {
  private readonly usecase: UseCase
  constructor (usecase: UseCase) {
    this.usecase = usecase
  }

  public async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      if (!('name' in request.body) || !('email' in request.body)) {
        let missingParam = 'name' in request.body ? '' : 'name '
        missingParam += 'email' in request.body ? '' : 'email'
        return badRequest(new MissingParamError(missingParam.trim()))
      }

      const userData: UserData = request.body
      const response = await this.usecase.perform(userData)

      if (response.isLeft() as boolean) {
        return badRequest(response.value)
      }

      return ok(response.value)
    } catch (error) {
      return serverError(error)
    }
  }
}
