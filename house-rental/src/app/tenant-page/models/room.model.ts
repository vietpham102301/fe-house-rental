export interface Room {
    id: number;
    name: string;
    houseName: string;
    status: string;
    floor: number;
    area: number;
    currentTenant: number;
    capacity: number;
    rentFee: number;
    description: string;
    services: string[];
  }
  