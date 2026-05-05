import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findOrCreate(telegramUser: {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
  }): Promise<User> {
    let user = await this.userRepo.findOne({
      where: { telegramId: String(telegramUser.id) },
    });

    if (!user) {
      user = this.userRepo.create({
        telegramId: String(telegramUser.id),
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name,
        username: telegramUser.username,
      });
      await this.userRepo.save(user);
    }

    return user;
  }

  async linkJiraAccount(telegramId: string, jiraAccountId: string) {
    await this.userRepo.update({ telegramId }, { jiraAccountId });
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.find();
  }
}
