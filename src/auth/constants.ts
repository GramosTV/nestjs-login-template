import { SetMetadata } from '@nestjs/common';

export const jwtConstants = {
    secret: 'secretinenv',
    refreshTokenSecret: 'secretinenv123',
    passwordChangeSecret: '12425123151234'
};


export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);