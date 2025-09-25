import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { TodosStatus } from 'src/commons/enums/Todos.enums';

export type TodoDocument = Todo & Document;

@Schema({ timestamps: true })
export class Todo {
  @Prop({ required: true })
  title: string;

  @Prop()
  content?: string;

  @Prop({
    type: String,
    enum: TodosStatus,
    default: TodosStatus.PENDING,
  })
  status: TodosStatus;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
