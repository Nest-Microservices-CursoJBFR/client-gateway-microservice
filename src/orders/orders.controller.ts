import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseUUIDPipe, Query } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ORDER_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { OrderPaginationDto, StatusDto } from './dto';
import { PaginationDto } from 'src/common';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(ORDER_SERVICE) private readonly ordersClient: ClientProxy,

  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersClient.send('createOrder', createOrderDto);
    
    //return this.ordersService.create(createOrderDto);
  }

  @Get()
  findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    
    //return orderPaginationDto;
    return this.ordersClient.send('findAllOrders', orderPaginationDto);
    //return this.ordersService.findAll();
  }


  @Get('id/:id')
  async findOne(@Param('id', ParseUUIDPipe ) id: string) {

    try {
      const order = await firstValueFrom(
        this.ordersClient.send('findOneOrder', { id })
      );
      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get(':status')
  async findAllByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationDto : PaginationDto,
    ) {

    try {
      return this.ordersClient.send('findAllOrders', {
        ...paginationDto,
        status: statusDto.status,
      });
      //const order = await firstValueFrom(
      //  this.ordersClient.send('findOneOrder', { id })
      //);
      //return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }  

  @Patch(':id')
  changeStatus(
    @Param('id', ParseUUIDPipe ) id: string,
    @Body() statusDto: StatusDto,

  ){

    try {
      return this.ordersClient.send('changeOrderStatus', { id, status:statusDto.status})
    } catch (error) {
      throw new RpcException(error);
    }
    //return {
    //  id, status: statusDto.status
    //}
  }

}
