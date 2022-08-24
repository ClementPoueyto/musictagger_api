
import { Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginDto } from './dto/auth.dto';
 import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/api/user/entities/user.entity';
import { JwtDto } from './dto/jwt.dto';

@Injectable()
export class AuthService {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  @Inject(JwtService)
  private readonly jwtService: JwtService;



  async login(authLoginDto: AuthLoginDto) {
    const user = await this.validateUser(authLoginDto);

    return this.refresh_jwt_token(user);
  }

  async refresh_jwt_token(user : User) : Promise<JwtDto> {

    const payload = {
      userId: user.id,
      spotifyId: user.spotifyUser?.spotifyId
    };
    console.log(payload)
    User.update(user.id, { lastLoginAt: new Date() });

    return new JwtDto(this.jwtService.sign(payload));
  }

  async validateUser(authLoginDto: AuthLoginDto): Promise<User> {
    const { email, password } = authLoginDto;
    const user = await this.userRepository.findOne({where:{email : email}, relations : { spotifyUser : true}});
    if(!user) throw new NotFoundException();
    if (!await user.validatePassword(password)) {
      throw new UnauthorizedException();
    }

    return user;
  }

 
}