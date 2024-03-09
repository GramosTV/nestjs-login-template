import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly mailerService: MailerService
  ) { }

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.usersService.findOne(username);
    // const isMatch = await bcrypt.compare(password, hash);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.userId, username: user.username };
    const refreshTokenPayload = { sub: user.userId };
    return {
      access_token: await this.jwtService.signAsync(payload),
      refresh_token: await this.jwtService.signAsync(refreshTokenPayload, { expiresIn: '90d', secret: jwtConstants.refreshTokenSecret })
    };
  }

  async emailPasswordChange(id: string) {

      // CHECK IF OLD PASS MATCHES THE CURRENT PASS

      const token = await this.jwtService.signAsync({id}, { expiresIn: '30m', secret: jwtConstants.passwordChangeSecret })

    this
      .mailerService
      .sendMail({
        to: 'test@nestjs.com',
        from: 'noreply@nestjs.com',
        subject: 'Password change',
        template: 'passwordChange',
        context: {
          token,
        },
      })
      .then((success) => {
        console.log(success)
      })
      .catch((err) => {
        console.log(err)
      });
  }

  async changePassword(token: string, pass: string) {
    // HANDLE PASSWORD  CHANGE
  }
}