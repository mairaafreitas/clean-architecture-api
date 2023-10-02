import { type HttpRequest, type HttpResponse } from '@/web-controllers/ports'
import { type UserData } from '@/entities'
import { badRequest, created, serverError } from '@/web-controllers/util'
import { MissingParamError } from './errors'
import { type UseCase } from '@/usecases/ports'

export class RegisterUserController {
  private readonly usecase: UseCase
  constructor (usecase: UseCase) {
    this.usecase = usecase
  }

  public async handle (request: HttpRequest): Promise<HttpResponse> {
    try {
      if (!(request.body.name) || !(request.body.email)) {
        let missingParam = request.body.name ? '' : 'name '
        missingParam += request.body.email ? '' : 'email'
        return badRequest(new MissingParamError(missingParam.trim()))
      }

      const userData: UserData = request.body
      const response = await this.usecase.perform(userData)

      if (response.isLeft()) {
        return badRequest(response.value)
      }

      return created(response.value)
    } catch (error) {
      return serverError(error)
    }
  }
}
