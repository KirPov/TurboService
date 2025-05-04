import { IsNotEmpty } from "class-validator";

export class CreateServiceDto {

    @IsNotEmpty()
    title: string
    description: string
    price: number
    duration: number
}
