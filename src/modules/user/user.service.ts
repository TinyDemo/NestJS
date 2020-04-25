import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * 获取指定 email 用户
   * @param email
   */
  async findUserByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ email: email });
  }
  async findUserById(id: number): Promise<User | undefined> {
    return this.userRepository.findOne({ id: id });
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
}
