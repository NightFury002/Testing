/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user.schema';
import { RegisterUserDto, LoginUserDto, UpdateUserDto } from '../user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRole } from 'src/commons/enums/user.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterUserDto) {
    const exist = await this.userModel.findOne({ username: dto.username });
    if (exist) throw new ForbiddenException('Username already exists');
    const hash = await bcrypt.hash(dto.password, 10);
    const user = new this.userModel({ ...dto, password: hash });
    await user.save();
    return { message: 'Register success' };
  }

  async login(dto: LoginUserDto) {
    const user = await this.userModel.findOne({ username: dto.username });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');
    const payload = { sub: user._id, username: user.username, role: user.role };
    const token = await this.jwtService.signAsync(payload);
    return { access_token: token };
  }

  async findAll() {
    return this.userModel.find().select('-password');
  }

  async findOne(id: string) {
    return this.userModel.findById(id).select('-password');
  }

  async update(id: string, dto: UpdateUserDto, currentUser: any) {
    if (currentUser.role !== UserRole.ADMIN && currentUser.sub !== id) {
      throw new ForbiddenException('No permission');
    }
    if (dto.password) dto.password = await bcrypt.hash(dto.password, 10);
    return this.userModel
      .findByIdAndUpdate(id, dto, { new: true })
      .select('-password');
  }

  async remove(id: string, currentUser: any) {
    if (currentUser.role !== UserRole.ADMIN && currentUser.sub !== id) {
      throw new ForbiddenException('No permission');
    }
    return this.userModel.findByIdAndDelete(id);
  }

  async getTodosOfUser(userId: string) {
    const user = await this.userModel.findById(userId).populate('todos');
    if (!user) throw new NotFoundException('User not found');
    return {
      statusCode: 200,
      data: {
        user: {
          _id: user._id,
          username: user.username,
          role: user.role,
        },
        todos: user.todos,
        totalTodos: user.todos.length,
      },
    };
  }
}
