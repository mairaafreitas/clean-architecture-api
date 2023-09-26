import { type HttpRequest } from '@/web-controllers/ports/'
import { type RegisterUserController } from '@/web-controllers/'
import { type Request, type Response } from 'express'

export const adaptRoute = (controller: RegisterUserController) => {
  return async (req: Request, res: Response) => {
    const HttpRequest: HttpRequest = {
      body: req.body
    }
    const HttpResponse = await controller.handle(HttpRequest)
    res.status(HttpResponse.statusCode).json(HttpResponse.body)
  }
}
