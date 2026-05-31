import { IsNumber, IsNotEmpty, Min } from 'class-validator';

export class AddMaterialDto {
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @IsNumber()
  @Min(0.0001)
  quantityUsed: number;
}
