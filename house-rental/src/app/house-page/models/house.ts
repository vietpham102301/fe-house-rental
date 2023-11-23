export interface House {
    id: number;
    name: string;
    address: {
      id: number;
      city: string;
      district: string;
      ward: string;
      street: string;
      houseNumber: number;
    };
    facilities: {
      id: number;
      name: string;
      unit: string;
      price: number;
    }[];
    establishDate: Date;
    totalRoom: number;
    manager: number;
    status: string;
    description: string;
    createdAt: string;
    imageData: ImageData[];
  }

export interface ImageData {
    id: number;
    url: string;
}
  
  