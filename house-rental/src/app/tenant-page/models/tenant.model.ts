export interface Tenant {
    id: number;
    tenantRoomId: number;
    tenantName: string;
    houseName: string;
    roomName: string;
    roomId: number;
    birthDate: Date;
    gender: string;
    phone: string;
    email: string;
    idNumber: string;
    permanentAddress: {
      id: number;
      city: string;
      district: string;
      ward: string;
      street: string;
      houseNumber: number;
    };
    licensePlates: string;
    rentDate: Date;
    status: string;
    description: string;
    imageData: ImageData[];
  }

interface ImageData {
    id: number;
    url: string;
  }
  