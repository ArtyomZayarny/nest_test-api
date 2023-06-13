import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { USER_ALREDY_REGISTERED } from './auth.constats';

@Controller('auth')
export class AuthController {
  constructor(private readonly authSevice: AuthService) {}
  @Post('register')
  async register(@Body() dto: AuthDto) {
    // check old user
    const oldUser = await this.authSevice.findUser(dto.login);

    if (oldUser) {
      throw new BadRequestException(USER_ALREDY_REGISTERED);
    }
    return this.authSevice.createUser(dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(@Body() { login, password }: AuthDto) {
    const { email } = await this.authSevice.vallidateUser(login, password);
    return this.authSevice.login(email);
  }
}
