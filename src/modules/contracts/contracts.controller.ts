import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { ContractsService } from 'src/modules/contracts/contracts.service';
import { CreateContractDto } from 'src/modules/contracts/dto/create-contract.dto';
import { UpdateContractDto } from 'src/modules/contracts/dto/update-contract.dto';
import { Contracts } from 'src/modules/contracts/entities/contracts.entity';
import { AuthRequest } from 'src/utils/@types/AuthRequest';
import { InsertResult } from 'typeorm';

@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createContractDto: CreateContractDto): Promise<InsertResult> {
    return this.contractsService.create(createContractDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<Contracts[]> {
    return this.contractsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/freelancer/my-contracts')
  findOwnContractsAsFreelancer(@Req() req: AuthRequest): Promise<Contracts[]> {
    const { id } = req.user;
    return this.contractsService.findOwnAsFreelancer(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/client/my-contracts')
  findOwnContractsAsClient(@Req() req: AuthRequest): Promise<Contracts[]> {
    const { id } = req.user;
    return this.contractsService.findOwnAsClient(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Contracts> {
    return this.contractsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateContractDto: UpdateContractDto,
  ): Promise<void> {
    return this.contractsService.update(+id, updateContractDto);
  }
}
