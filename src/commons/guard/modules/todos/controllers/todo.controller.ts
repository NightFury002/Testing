/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TodosService } from 'src/commons/guard/modules/todos/services/todo.service';
import {
  CreateTodoDto,
  UpdateTodoDto,
  QueryTodoDto,
} from 'src/commons/guard/modules/todos/todo.dto';
import { JwtAuthGuard } from 'src/commons/guard/modules/auth/jwt.guard';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createTodoDto: CreateTodoDto, @Req() req) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const todo = await this.todosService.create(req.user.userId, createTodoDto);
    return todo;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query() query: QueryTodoDto, @Req() req) {
    return this.todosService.findAll(req.user.userId, query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req) {
    return this.todosService.findOne(req.user.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
    @Req() req,
  ) {
    return this.todosService.update(req.user.userId, id, updateTodoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Req() req) {
    await this.todosService.remove(req.user.userId, id);
    return;
  }
}
