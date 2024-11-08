import { BadRequestException, Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, first, firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';
import { NATS_SERVICE, PRODUCT_SERVICE } from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';


@Controller('products')
export class ProductsController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy

  ) {}

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.client.send( {cmd: 'create_product'}, createProductDto);
    //return 'Crea un producto';
  }

  @Get()
  findAllProducts(@Query() paginationDto:PaginationDto) {
    return this.client.send({ cmd: 'find_all_products' }, paginationDto);
    //return 'Esta funcion regresa varios productos';
  }

  @Get(':id')
  async findOne(@Param('id') id: string ) {
    
    return this.client.send({ cmd: 'find_one_product'}, { id })
    .pipe(
      catchError( err => {throw new RpcException(err) })
    )
    //try {
    //  const product = await firstValueFrom(
    //    this.productsClients.send({ cmd: 'find_one_product' }, { id })
    //  )

    //  return product;

    //} catch (error) {
    //  throw new RpcException(error);
      //throw new BadRequestException(error);
    //}


    this.client.send({ cmd: 'find_one_product' }, { id })
    
    //return 'Esta funcion regresa el producto ' + id;
  }
  
  @Delete(':id')
  deleteProduct(@Param('id') id: string ) {
    
    return this.client.send( { cmd: 'delete_product' }, { id } ).pipe(
      catchError( err => {throw new RpcException(err) 
      } ),
    );
    //return 'Esta funcion elimina el producto ' + id;
  }

  @Patch(':id')
  patchProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto 
  ) {
    
    return this.client.send({ cmd: 'update_product' }, 
      {
        id,
        ...updateProductDto
      }          
    ).pipe(
      catchError( err => {throw new RpcException(err) } )
    );
    //return 'Esta funcion actualiza el producto ';
  }

}
