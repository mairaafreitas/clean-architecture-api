import { type InvalidEmailError, type InvalidNameError } from '../../entities/errors'
import { type UserData, User } from '../../entities'
import { left, type Either, right } from '../../shared'
import { type UserRepository } from './ports'

export class RegisterUserOnMailingList {
  private readonly userRepo: UserRepository

  constructor (userRepo: UserRepository) {
    this.userRepo = userRepo
  }

  public async registerUserOnMailingList (request: UserData): Promise<Either<InvalidNameError | InvalidEmailError, UserData>> {
    const userOrError: Either<InvalidNameError | InvalidEmailError, User> = User.create(request)
    if (userOrError.isLeft()) {
      return left(userOrError.value)
    }

    if (!(await this.userRepo.exists(request))) {
      await this.userRepo.add(request)
    }
    return right(request)
  }
}
