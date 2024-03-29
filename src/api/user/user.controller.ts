import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { NotFoundInterceptor } from 'src/shared/interceptors/not-found.interceptor';
import { JwtDto } from '../authentication/auth/dto/jwt.dto';
import { JwtAuthGuard } from '../authentication/auth/guards/jwt-auth.guards';
import { SpotifyUserDto } from '../authentication/spotify-auth/dto/spotify-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.services';

@ApiTags('user')
@Controller('users')
export class UserController {
  @Inject(UserService)
  private readonly service: UserService;

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    description: 'Return the corresponding user',
    type: UserDto,
  })
  @ApiUnauthorizedResponse({ description: 'Invalid Authorization header' })
  @UseInterceptors(NotFoundInterceptor)
  @ApiNotFoundResponse({ description: 'User not found' })
  public async getUser(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: string,
  ): Promise<UserDto> {
    if (id != req.user.id) {
      throw new UnauthorizedException();
    }
    const user = await this.service.findById(id);
    return plainToInstance(UserDto, user);
  }

  @Post()
  @ApiOkResponse({ description: 'Create and Return the user', type: UserDto })
  @ApiBadRequestResponse()
  @UseInterceptors(NotFoundInterceptor)
  @ApiConflictResponse({ description: 'Login already exist' })
  public async createUser(@Body() body: CreateUserDto): Promise<UserDto> {
    const user = await this.service.create(body);
    return plainToInstance(UserDto, user);
  }

  @Post(':id/spotify')
  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse()
  @ApiBearerAuth()
  @UseInterceptors(NotFoundInterceptor)
  @ApiOkResponse({ description: 'login Spotify Account to user' })
  public async loginSpotifyUser(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: string,
  ): Promise<JwtDto> {
    const spotifyUserDto: SpotifyUserDto = req.body;
    if (id != req.user.id) {
      throw new UnauthorizedException();
    }
    if (
      spotifyUserDto.spotifyId == null ||
      spotifyUserDto.spotifyRefreshToken == null ||
      spotifyUserDto.spotifyAccessToken == null
    ) {
      throw new BadRequestException();
    }
    return await this.service.loginSpotifyAccount(id, spotifyUserDto);
  }

  @Delete(':id/spotify')
  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse()
  @UseInterceptors(NotFoundInterceptor)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'logout Spotify Account to user' })
  public async logoutSpotifyUser(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: string,
  ): Promise<JwtDto> {
    if (id != req.user.id) {
      throw new UnauthorizedException();
    }

    return this.service.logoutSpotifyAccount(id);
  }
}
