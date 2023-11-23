export interface Employee {
    id: number;
    name: string;
    username: string;
    email: string;
    phone: string;
    role: string;
    position: string;
    status: string;
    houseNames: string[];
    birthDate: Date;
    gender: string;
    startedDate: Date;
    idNumber: string;
    description: string;
    imageData: ImageData[];
  }

interface ImageData {
    id: number;
    url: string;
}

  