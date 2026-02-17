import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',     // ✅ SMTP host
        port: 587,                  // ✅ STARTTLS port
        secure: false,              // ✅ 465 bo'lsa true, 587 STARTTLS uchun false
        auth: {
          user: 'moxirbekmoxirbek29@gmail.com',  // ✅ Gmail email
          pass: 'dojbkreglzmwgbaq',             // ✅ Gmail App password
        },
      },
      defaults: {
        from: `"No Reply" <moxirbekmoxirbek29@gmail.com>`,
      },
      template: {
        dir: join(process.cwd(), 'src', 'templates'),  // template papkasi
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
