/* eslint-disable @typescript-eslint/no-unused-vars */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Todo,
  TodoSchema,
} from 'src/shared/database/mongo/schemas/Todos.schema';
import { TodosService } from 'src/commons/guard/modules/todos/services/todo.service';
import { TodosController } from 'src/commons/guard/modules/todos/controllers/todo.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }]),
  ],
  controllers: [TodosController],
  providers: [TodosService],
})
export class TodosModule {}
