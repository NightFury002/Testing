import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

import { UserRole } from 'src/commons/enums/user.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Todo' }], default: [] })
  todos: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
