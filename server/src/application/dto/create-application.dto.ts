export class CreateApplicationDto {
  userId: number; // ID пользователя, создающего заявку
  carBrand: string; // Марка автомобиля
  carModel: string; // Модель автомобиля
  year?: number;
  description: string; // Описание заявки
  serviceIds: number[]; // Массив ID услуг
  date: string;
  rememberCar?: boolean; // новое поле
}
