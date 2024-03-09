import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [AuthModule, UsersModule,  MailerModule.forRoot({
    transport: {
      host: 'smtp.example.com',
      port: 587,
      secure: false, // upgrade later with STARTTLS
      auth: {
        user: "username",
        pass: "password",
      },
    },
    defaults: {
      from:'"nest-modules" <modules@nestjs.com>',
    },
    template: {
      dir: process.cwd() + '/templates/',
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  }),],
  
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
