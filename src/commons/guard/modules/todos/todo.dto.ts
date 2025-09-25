/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
  IsMongoId,
  MinLength,
  MaxLength,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { TodosStatus } from 'src/commons/enums/Todos.enums';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  content?: string;

  @IsEnum(TodosStatus)
  @IsOptional()
  status?: TodosStatus = TodosStatus.PENDING;
}

export class UpdateTodoDto {
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(100)
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  content?: string;

  @IsEnum(TodosStatus)
  @IsOptional()
  status?: TodosStatus;
}

export class QueryTodoDto {
  @IsEnum(TodosStatus)
  @IsOptional()
  status?: TodosStatus;

  @IsString()
  @IsOptional()
  search?: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  limit?: number = 10;

  @IsNumber()
  @IsOptional()
  @Min(0)
  offset?: number = 0;
}
