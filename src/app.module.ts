/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './commons/guard/modules/auth/auth.module';
import { TodosModule } from './commons/guard/modules/todos/todos.module';
import { UsersModule } from './commons/guard/modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    MongooseModule.forRoot(process.env.MONGO_URI || ''),
    TodosModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
