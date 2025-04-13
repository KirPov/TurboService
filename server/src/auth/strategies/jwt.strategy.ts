
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { IUser } from 'src/types/types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService) {

      super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: configService.get('JWT_SECRET') as string,
      })

      console.log(configService.get('JWT_SECRET'))
    }
  
    async validate(user: IUser) {
      // Возвращаем объект с данными пользователя
      return { id: user.id, email: user.email};
    }
  }