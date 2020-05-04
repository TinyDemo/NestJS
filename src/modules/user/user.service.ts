import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { PassportService } from '../auth/passport.service';
import { TokenService } from '../auth/token.service';
import { AllowUserUpdateProfileDto } from './dto/allow-user-update-profile.dto';

const crypto = require('crypto');
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly tokenService: TokenService,
    @Inject(forwardRef(() => PassportService))
    private readonly passportService: PassportService,
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

  /**
   * 删除用户
   * @param user
   */
  async delete(user: User): Promise<boolean> {
    await this.passportService.deleteAllPassport(user);
    await this.tokenService.deleteAllToken(user);
    await this.userRepository.remove(user);
    return true;
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
  updateProfile(user: User, data: AllowUserUpdateProfileDto): Promise<User> {
    if (data.nickname) {
      user.nickname = data.nickname;
    }
    return this.userRepository.save(user);
  }

  /**
   * {
   *   fieldname: 'file',
   *   originalname: '251 GI.jpg',
   *   encoding: '7bit',
   *   mimetype: 'image/jpeg',
   *   buffer: <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 00 00 01 00 01 00 00 ff db 00 43 00 05 03 04 04 04 03 05 04 04 04 05 05 05 06 07 0c 08 07 07 07 07 0f 0b 0b 09 ... 78027 more bytes>,
   *   size: 78077
   * }
   * @param file
   */
  private async saveUserAvatarFile(file) {
    const extensions = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
    };
    const timestamp = new Date().getTime();
    const randomStr = await crypto.randomBytes(8);
    const filename = `${timestamp}${randomStr.toString('hex')}`;
    const extension = extensions[file.mimetype.toLowerCase()];
    const filePath = path.join('public/uploads/', `${filename}.${extension}`);
    fs.writeFileSync(filePath, file.buffer);
    return {
      filename: filename,
      path: filePath,
    };
  }
  async updateUserAvatar(user: User, file) {
    const result = await this.saveUserAvatarFile(file);
    user.avatar = result.path;
    return this.userRepository.save(user);
  }

  /**
   * 用户更新密码
   * @param user
   * @param password
   */
  async updateUserPassword(user: User, password: string): Promise<User> {
    user = this.setUserPassword(user, password);
    return this.userRepository.save(user);
  }

  /**
   * 为 User 对象设置密码
   * @param user
   * @param password
   */
  setUserPassword(user: User, password: string): User {
    user.password = bcrypt.hashSync(password, 10);
    return user;
  }
}
