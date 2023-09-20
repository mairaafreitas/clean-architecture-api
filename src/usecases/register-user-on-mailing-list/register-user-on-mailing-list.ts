import { type InvalidEmailError } from '../../entities/errors/invalid-email-error'
import { type InvalidNameError } from '../../entities/errors/invalid-name-error'
import { User } from '../../entities/user'
import { type UserData } from '../../entities/user-data'
import { left, type Either, right } from '../../shared/either'
import { type UserRepository } from './ports/user-repository'

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
