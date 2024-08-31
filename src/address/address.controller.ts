import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { ApiTags } from '@nestjs/swagger';
import { InjectMapper, MapInterceptor } from 'automapper-nestjs';
import { Address } from './entities/address.entity';
import { AddressDto } from './dto/address.dto';
import { Mapper } from 'automapper-core';

@ApiTags('Address')
@Controller({ path: 'address', version: '1' })
export class AddressController {
  constructor(
    private readonly addressService: AddressService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async create(@Body() createAddressDto: CreateAddressDto) {
    return await this.addressService.create(createAddressDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(MapInterceptor(Address, AddressDto, { isArray: true }))
  async findAll(): Promise<Address[]> {
    return await this.addressService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(MapInterceptor(Address, AddressDto))
  async findOne(@Param('id') id: number) {
    return await this.addressService.findOne({ id: id });
  }

  @Get('find/all-cities')
  @HttpCode(HttpStatus.OK)
  async findAllCities() {
    return await this.addressService.findAllCities();
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(MapInterceptor(Address, AddressDto))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return await this.addressService.update(id, updateAddressDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.addressService.remove(id);
  }
}
