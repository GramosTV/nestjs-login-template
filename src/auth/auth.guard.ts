import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY, jwtConstants } from './constants';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private reflector: Reflector,
        private usersService: UsersService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        let token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: jwtConstants.secret,
            });

            request['user'] = payload;
            return true;
        } catch {
            const refreshToken = this.extractRefreshTokenFromCookie(request);
            if (!refreshToken) {
                throw new UnauthorizedException();
            }

            try {
                
                const decodedRefreshToken = await this.jwtService.verifyAsync(refreshToken, {
                    secret: jwtConstants.refreshTokenSecret,
                });
                
                const user = await this.usersService.findOneById(decodedRefreshToken.sub);
                
                const newAccessToken = this.jwtService.sign({ sub: user.userId, username: user.username });
                
                request['user'] = { sub: user.userId, username: user.username };

                request.res.setHeader('Authorization', `Bearer ${newAccessToken}`);

                return true;
            } catch (e) {
                console.log(e)
                throw new UnauthorizedException();
            }
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    private extractRefreshTokenFromCookie(request: Request): string | undefined {
        return request.cookies?.refreshToken;
    }
}