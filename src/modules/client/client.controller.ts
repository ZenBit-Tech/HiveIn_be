import { ClientService } from './client.service';
import { Controller, Get, HttpCode, UseGuards, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  @Get('recently-viewed/:id')
  recentlyViewed(@Param('id') id: string) {
    return this.clientService.recentlyViewed(+id);
  }
}
