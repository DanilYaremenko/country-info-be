import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    this.logger.debug('Finding all users');

    return await this.userRepository.find({ relations: ['calendarEvents'] });
  }

  async findOne(id: number): Promise<User> {
    this.logger.debug(`Finding user with id: ${id}`);

    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['calendarEvents'],
    });

    if (!user) {
      this.logger.warn(`User with id ${id} not found`);
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    this.logger.debug(`Creating new user with email: ${createUserDto.email} `);

    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      this.logger.warn(`User with email ${createUserDto.email} already exists`);
      throw new BadRequestException(
        `User with email ${createUserDto.email} already exists`,
      );
    }

    const user = this.userRepository.create(createUserDto);

    return await this.userRepository.save(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<boolean> {
    this.logger.debug(`Updating user with id: ${id}`);

    if (!updateUserDto || Object.keys(updateUserDto).length === 0) {
      this.logger.warn('No update data provided');
      throw new BadRequestException('No update data provided');
    }

    const user = await this.findOne(id);
    if (!user) {
      this.logger.warn(`User with id ${id} not found`);
      throw new NotFoundException(`User with id ${id} not found`);
    }

    if (updateUserDto.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });

      if (existingUser && existingUser.id !== id) {
        this.logger.warn(
          `Email ${updateUserDto.email} is already in use by another user`,
        );
        throw new BadRequestException(
          `Email ${updateUserDto.email} is already in use by another user`,
        );
      }
    }

    await this.userRepository.update(id, updateUserDto);

    return true;
  }

  async remove(id: number): Promise<boolean> {
    this.logger.debug(`Removing user with id: ${id}`);

    const user = await this.findOne(id);
    if (!user) {
      this.logger.warn(`User with id ${id} not found`);
      throw new NotFoundException(`User with id ${id} not found`);
    }

    await this.userRepository.delete(id);

    return true;
  }
}
