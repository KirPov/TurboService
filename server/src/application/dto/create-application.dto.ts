export class CreateApplicationDto {
  userId: number; // ID пользователя, создающего заявку
  carBrand: string; // Марка автомобиля
  carModel: string; // Модель автомобиля
  description: string; // Описание заявки
  serviceIds: number[]; // Массив ID услуг
}
