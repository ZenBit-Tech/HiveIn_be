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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotAcceptableResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { ContractsService } from 'src/modules/contracts/contracts.service';
import { CreateContractDto } from 'src/modules/contracts/dto/create-contract.dto';
import { UpdateContractDto } from 'src/modules/contracts/dto/update-contract.dto';
import { Contracts } from 'src/modules/contracts/entities/contracts.entity';
import { AuthRequest } from 'src/utils/@types/AuthRequest';
import { InsertResult } from 'typeorm';

@ApiTags('Contracts')
@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @ApiCreatedResponse({
    description: 'Contract was created',
  })
  @ApiNotAcceptableResponse({
    description: 'Contract to this user related to this job post already exist',
  })
  @ApiUnprocessableEntityResponse({
    description: 'Unprocessable Entity',
  })
  @ApiInternalServerErrorResponse()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createContractDto: CreateContractDto): Promise<InsertResult> {
    return this.contractsService.create(createContractDto);
  }

  @ApiOkResponse({
    description: 'Self contracts',
    type: [Contracts],
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<Contracts[]> {
    return this.contractsService.findAll();
  }

  @ApiNotFoundResponse({
    description: 'Not found contract',
  })
  @ApiOkResponse({
    description: 'Freelancers contracts',
    type: [Contracts],
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/freelancer/my-contracts')
  findOwnContractsAsFreelancer(@Req() req: AuthRequest): Promise<Contracts[]> {
    const { id } = req.user;
    return this.contractsService.findOwnAsFreelancer(id);
  }

  @ApiNotFoundResponse({
    description: 'Not found contract',
  })
  @ApiOkResponse({
    description: 'Client contracts',
    type: [Contracts],
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/client/my-contracts')
  findOwnContractsAsClient(@Req() req: AuthRequest): Promise<Contracts[]> {
    const { id } = req.user;
    return this.contractsService.findOwnAsClient(id);
  }

  @ApiOkResponse({
    description: 'Contract by id',
    type: Contracts,
  })
  @ApiInternalServerErrorResponse()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Contracts> {
    return this.contractsService.findOne(+id);
  }

  @ApiNotFoundResponse({
    description: 'Not found contract',
  })
  @ApiOkResponse({
    description: 'Contract by id was updated',
  })
  @ApiInternalServerErrorResponse()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateContractDto: UpdateContractDto,
  ): Promise<void> {
    return this.contractsService.update(+id, updateContractDto);
  }
}
