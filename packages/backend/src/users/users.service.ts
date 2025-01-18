import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { DeleteResult, Repository } from 'typeorm';
import { SignupDto } from 'src/auth/dto/sign-up.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(signupDto : SignupDto): Promise<User> {
    const user = await this.usersRepository.findOneBy({ email: signupDto.email });
    if(user){
      throw new ConflictException('User already exists');
    }
    return await this.usersRepository.save(signupDto);
  }
  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(email: string): Promise<User | null> {
    return await this.usersRepository.findOneBy({ email });
  }

  async remove(email: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user) {
      return await this.usersRepository.softRemove(user); // Soft delete
    }
  }

  async resetPassword(email: string, password: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user) {
      user.password = password;
      return await this.usersRepository.save(user);
    }
  }

  async changeNickname(email: string, nickName: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user) {
      user.nickName = nickName;
      return await this.usersRepository.save(user);
    }
  }

  async getAppleProfile(appleUserId : string): Promise<User | null> {
    return await this.usersRepository.findOneBy({ appleUserId });
  }
}