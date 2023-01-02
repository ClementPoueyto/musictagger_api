import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User } from 'src/shared/entities/user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  /**
   * Get User by @id and return it
   */
  async getById(id: string, spotifyUser?: boolean): Promise<User> {
    return User.findOneOrFail({
      where: { id: id },
      relations: {
        spotifyUser: spotifyUser,
      },
    });
  }

  /**
   * Get User by @email and return it
   */
  async getByEmail(email: string, spotifyUser?: boolean): Promise<User | null> {
    return User.findOne({
      where: {
        email: email,
      },
      relations: {
        spotifyUser: spotifyUser,
      },
    });
  }

  /**
   * Get User by @email and return it
   */
  async getByEmailOrFail(email: string, spotifyUser?: boolean): Promise<User> {
    return User.findOneOrFail({
      where: {
        email: email,
      },
      relations: {
        spotifyUser: spotifyUser,
      },
    });
  }
}
