import { Clients } from './../entities/clients.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entities/users.entity';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Clients)
    private readonly clientsRepo: Repository<Clients>,
    @InjectRepository(Users)
    private readonly usersRepo: Repository<Users>,
  ) {}

  async getClientIdByUserId(id: number) {
    const {
      client: { id: clientId },
    } = await this.usersRepo
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.client', 'client')
      .where({ id })
      .getOne();
    return clientId;
  }

  async recentlyViewed(id: number) {
    const clientId = await this.getClientIdByUserId(id);

    const { recentlyViewedFreelancers } = await this.clientsRepo
      .createQueryBuilder('client')
      .leftJoinAndSelect('client.recentlyViewedFreelancers', 'freelancer')
      .leftJoinAndSelect('freelancer.user', 'user')
      .where({ id: clientId })
      .getOne();

    return recentlyViewedFreelancers;
  }
}
