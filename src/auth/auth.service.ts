import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { UserModel } from './user.model';
import { InjectModel } from 'nestjs-typegoose';
import * as bcrypt from 'bcrypt';
import { USER_NOT_FOUNDED, WRONG_PASSWORD } from './auth.constats';
import { getJWTConfig } from 'src/configs/jwt.config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(dto: AuthDto) {
    const salt = await bcrypt.genSaltSync();

    const hash = await bcrypt.hashSync(dto.password, salt);

    const newUser = new this.userModel({
      email: dto.login,
      passwordHash: hash,
    });
    return newUser.save();
  }

  async findUser(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async vallidateUser(
    email: string,
    password: string,
  ): Promise<Pick<UserModel, 'email'>> {
    const user = await this.findUser(email);

    if (!user) {
      throw new UnauthorizedException(USER_NOT_FOUNDED);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      throw new UnauthorizedException(WRONG_PASSWORD);
    }

    return { email: (await user).email };
  }

  async login(email: string) {
    //create jwt token

    //Create payload
    const payload = { email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
