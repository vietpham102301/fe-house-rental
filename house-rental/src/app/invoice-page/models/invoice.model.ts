export interface Invoice {
    id: number;
    tenantName: string;
    tenantEmail: string;
    roomName: string;
    houseName: string;
    creatorName: string;
    paymentMethod: string;
    closingDate: string;
    status: string;
    invoiceDetails: {
      facilityHistories: FacilityHistory[];
      totalFacilitiesPrice: number;
    };
    totalCharge: number;
    createdAt: string;
    imageData: ImageData[];
  }
  
  export interface FacilityHistory {
    id: number;
    name: string;
    previousIndex: number;
    currentIndex: number;
    usage: number;
    unitPrice: number;
    unit: string;
    price: number;
  }
  

  export interface Facility {
    id: number;
    name: string;
    previousIndex: number;
    unitPrice: number;
    unit: string;
  }

  interface ImageData {
    id: number;
    url: string;
  }
  