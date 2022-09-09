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
import { AuthRequest } from 'src/utils/@types/AuthRequest';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';

@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createContractDto: CreateContractDto) {
    return this.contractsService.create(createContractDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.contractsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/freelancer/my-contracts')
  findOwnContractsAsFreelancer(@Req() req: AuthRequest) {
    const { id } = req.user;
    return this.contractsService.findOwnAsFreelancer(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/client/my-contracts')
  findOwnContractsAsClient(@Req() req: AuthRequest) {
    const { id } = req.user;
    return this.contractsService.findOwnAsClient(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contractsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateContractDto: UpdateContractDto,
  ) {
    return this.contractsService.update(+id, updateContractDto);
  }
}
