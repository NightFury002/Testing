/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import {
  Todo,
  TodoDocument,
} from 'src/shared/database/mongo/schemas/Todos.schema';
import { TodosStatus } from 'src/commons/enums/Todos.enums';
import {
  CreateTodoDto,
  UpdateTodoDto,
  QueryTodoDto,
} from 'src/commons/guard/modules/todos/todo.dto';

@Injectable()
export class TodosService {
  constructor(
    @InjectModel(Todo.name) private readonly todoModel: Model<TodoDocument>,
  ) {}

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const created = new this.todoModel(createTodoDto);
    return created.save();
  }

  async findAll(query: QueryTodoDto) {
    const filter: FilterQuery<TodoDocument> = {};
    if (query.status) filter.status = query.status;
    if (query.search) {
      filter.$or = [
        { title: { $regex: query.search, $options: 'i' } },
        { content: { $regex: query.search, $options: 'i' } },
      ];
    }
    const limit = query.limit ?? 5;
    const offset = query.offset ?? 0;
    const [items, total] = await Promise.all([
      this.todoModel
        .find(filter)
        .skip(offset)
        .limit(limit)
        .sort({ createdAt: -1 }),
      this.todoModel.countDocuments(filter),
    ]);
    return {
      statusCode: 200,
      data: {
        items,
        meta: {
          limit,
          offset,
          total,
          totalPages: Math.ceil(total / limit) || null,
        },
      },
    };
  }

  async findOne(id: string): Promise<Todo> {
    const todo = await this.todoModel.findById(id);
    if (!todo) throw new NotFoundException('Todo not found');
    return todo;
  }

  async update(id: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const todo = await this.todoModel.findByIdAndUpdate(id, updateTodoDto, {
      new: true,
    });
    if (!todo) throw new NotFoundException('Todo not found');
    return todo;
  }

  async remove(id: string): Promise<void> {
    const result = await this.todoModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Todo not found');
  }
}
