import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { createUserDto } from './dto/create-user.dto';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async register(user: createUserDto): Promise<void> {
    const { username, password } = user;
    const existingUser = await this.userRepository.findOne({
      where: { username },
    });

    if (existingUser) {
      throw new BadRequestException('This username is taken');
    }
    const newUser = new User();
    newUser.username = username;
    newUser.salt = await bcrypt.genSalt();
    newUser.password = await this.hashPassword(password, newUser.salt);
    await this.userRepository.save(newUser);
  }

  async login(user: createUserDto): Promise<{ accessToken: string }> {
    const { username, password } = user;
    const existingUser = await this.userRepository.findOne({
      where: { username },
    });

    if (!existingUser) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.validatePassword(
      password,
      existingUser.password,
      existingUser.salt,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return { accessToken: 'fakeToken' };
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  private async validatePassword(
    password: string,
    existingHash: string,
    salt: string,
  ): Promise<boolean> {
    const newHash = await bcrypt.hash(password, salt);
    return newHash === existingHash;
  }
}
