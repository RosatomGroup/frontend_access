interface DataType {
  id: number;
  name: string;
  role: string;
  status: string;
  system: string;
  submissionTime: string; 
  email: string;
}

export const reqOutdata: DataType[] = [
  {
    "id": 8,
    "name": "Иванов Иван Иванович",
    "role": "Выгрузка актуальных версий ТПС из ЕОС НСИ",
    "status": "в работе",
    "system": "ЕОС НСИ",
    "submissionTime": "2025-04-18T14:58:02.704Z",
    "email": "7777@mail.ru"
  },
  {
    "id": 7,
    "name": "Иванов Иван Иванович",
    "role": "Пользователь",
    "status": "в работе",
    "system": "АРИДА",
    "submissionTime": "2025-04-18T14:52:13.173Z",
    "email": "1234@mail.ru"
  },
  {
    "id": 6,
    "name": "Маслов Аркадий Петрович",
    "role": "администратор ЕОС 2.0",
    "status": "в работе",
    "system": "ЕОС 2.0",
    "submissionTime": "2025-04-15T12:58:29.728Z",
    "email": "123333@mail.ru"
  },
  {
    "id": 5,
    "name": "Короленко Борис Петрович",
    "role": "администратор ЕОС НСИ",
    "status": "в работе",
    "system": "ЕОС 2.0",
    "submissionTime": "2025-04-15T12:57:05.414Z",
    "email": "12345@mail.ru"
  },
  {
    "id": 4,
    "name": "Жоплин Валентин Николаевич",
    "role": "администратор ЕОСДО",
    "status": "в работе",
    "system": "ЕОСДО",
    "submissionTime": "2025-04-15T12:51:36.743Z",
    "email": "1234@mail.ru"
  },
  {
    "id": 3,
    "name": "Краснов Сергей Сергеевич",
    "role": "администратор ЕОС НСИ",
    "status": "в работе",
    "system": "ЕОС НСИ",
    "submissionTime": "2023-05-15T10:30:00Z",
    "email": "example1@mail.com"
  },
  {
    "id": 2,
    "name": "Демин Павел Евгеньевич",
    "role": "помощник младшего специалиста в ЕОСДО",
    "status": "в работе",
    "system": "ЕОС 2.0",
    "submissionTime": "2023-04-22T14:15:00Z",
    "email": "example2@mail.com"
  },
  {
    "id": 1,
    "name": "Федянин Игорь Юрьевич",
    "role": "администратор ЕОС НСИ",
    "status": "в работе",
    "system": "ЕОС НСИ",
    "submissionTime": "2023-03-10T09:45:00Z",
    "email": "example3@mail.com"
  }
];