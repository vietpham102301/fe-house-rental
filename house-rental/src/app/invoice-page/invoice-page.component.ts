import { Component, Input } from '@angular/core';
import { Invoice, FacilityHistory, Facility } from './models/invoice.model';
import { InvoicePageService } from './service/invoice-page.service';
import { HousePageService } from '../house-page/service/house-page.service';
import { House } from '../house-page/models/house';
import { TenantPageService } from '../tenant-page/service/tenant-page.service';
import { Room } from '../tenant-page/models/room.model';
import { Tenant } from '../tenant-page/models/tenant.model';

@Component({
  selector: 'app-invoice-page',
  templateUrl: './invoice-page.component.html',
  styleUrls: ['./invoice-page.component.scss']
})
export class InvoicePageComponent {

  isCollapsed: { [target: string]: boolean } = {};
  toggleCollapse(target: string) {
    this.isCollapsed[target] = !this.isCollapsed[target];
  }


  ngOnInit() {
  
    this.invoicePage = false;
    this.newInvoiceForm = true;
    this.fetchInvoiceList("", "", "", "");
    this.fetchHouseList();
    this.createdDate = new Date();
  }
  constructor(private invoicePageService: InvoicePageService, private houseServcie: HousePageService, private tenantPageService: TenantPageService) { }

  
  selectedIndexArr: number[] = [];
  @Input() indicators = true;

  selectedImage(index:number, houseIndex: number): void{
    this.selectedIndexArr[houseIndex] = index;
  }


  
  invoicePage!:boolean;
  newInvoiceForm!:boolean;
  activeTab: string = 'infoTab';
  

  isSearchClicked = false;

  totalPages!: number;
  currentPage= '0';
  disableArr: boolean[] = [];

  invoices: Invoice[] = [];
  houses: House[] = [];
  housesForNewInvoice: House[] = [];

  from: any = '';
  selectedHouse = '';
  selectedStatus = '';

  keywords = '';

  editMode = false;


  //new invoice form

  newInvoiceSelectedHouse = '';
  newInvoiceSelectedRoomName = '';
  newInvoiceSelectedTenant = '';
  rooms: Room[] = [];
  tenants: Tenant[] = [];
  newInvoiceSelectedRoom!: any;

  createdDate!:Date;
  paymentMethod = '';
  closingDate:Date| null = null;
  facilities: Facility[] = [];

  usageAndPrice: any[] = [];

  currentIndexFacilities: any[] = [];

  //error message

  errorMessage: string = '';
  tenantErrorMessage: string = '';
  roomErrorMessage: string = '';
  paymentMethodErrorMessage: string = '';
  closingDateErrorMessage: string = '';


  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }


  fetchInvoiceList(from: any, houseId: any,  status: string, page: string): void {
    this.invoicePageService.getInvoiceList(from, houseId, status, page).subscribe({
      next: (response) => {
        this.invoices = response.data;
        this.totalPages  = response.totalPages;
        this.invoices.forEach((_)=>{
          this.disableArr.push(true);
          this.selectedIndexArr.push(0);
        })
        this.isSearchClicked = false;
        this.currentPage = page;
        console.log(this.invoices);
      }
    })
  }

  fetchInvoiceByKeywords(page: string): void {
    this.invoicePageService.searchInvoice(this.keywords, page).subscribe({
      next:(response) => {
        this.invoices = response.data;
        this.totalPages  = response.totalPages;
        this.isSearchClicked = true;
        this.currentPage = page;
        this.selectedHouse = '';
        this.from = '';
        this.selectedStatus = '';
      },
      error: (error) =>{
        console.log(error);
      }
    })
  }

  fetchHouseList(): void {
    this.houseServcie.getHouseList("", "", "", "", "", "100").subscribe({
      next:(response) => {this.houses = response.houses;
        this.housesForNewInvoice = this.houses.filter((house) => house.status === "Active");
      },
      error:(error) => {
        console.log(error);
      }
    });
  }


  fetchRoomList(): void {
    this.tenantPageService.getRoomList(this.newInvoiceSelectedHouse).subscribe({
      next: (response) => {this.rooms = response.data;},
      error: (error) => {
        console.log(error);
      }
    })
  }

  

  onHouseChange(event: any){
    this.selectedHouse = event.target.value;
    
    this.fetchInvoiceList(this.from, this.selectedHouse, this.selectedStatus, "");
  }


  onHouseNewInvoiceChange(event: any){
    this.newInvoiceSelectedHouse = event.target.value;
    
    this.fetchRoomList();
  }

  onRoomNewInvoiceChange(event: any){
    this.newInvoiceSelectedRoomName = event.target.value;
   
    this.fetchTenantList(this.newInvoiceSelectedHouse, this.newInvoiceSelectedRoomName, "Active");
    console.log(this.rooms);
    this.newInvoiceSelectedRoom = this.rooms.find((room) => room.name === this.newInvoiceSelectedRoomName);

    
    console.log(this.newInvoiceSelectedRoom);
    this.fetchFacilitesByRoomId(this.newInvoiceSelectedRoom.id);

    //reset
    this.currentIndexFacilities.fill('', 0);

    this.usageAndPrice.fill('', 0);

  }

  fetchTenantList(houseName: string, roomName: string, status: string): void {
    this.invoicePageService.getTenantList(houseName, roomName, status).subscribe({
      next: (response) => {
        this.tenants = response.data;
      
        console.log(this.tenants);
      }
    })
  }

  onStatusChange(event: any){
    this.selectedStatus = event.target.value;
    this.fetchInvoiceList(this.from, this.selectedHouse, this.selectedStatus, "");
  }

  onFromChange(event: any){
    this.from = event.target.value;
    this.fetchInvoiceList(this.from, this.selectedHouse, this.selectedStatus, "");
  }

  facilityHistoryErrorMessage = '';
  errIndex = -1;
  updateInvoice(invoice: Invoice, index: number): void{
    let updateRequest ={
      paymentMethod: invoice.paymentMethod,
      closingDate: invoice.closingDate,
      status: invoice.status,
      facilities: [
        {
          id: invoice.invoiceDetails.facilityHistories[0].id,
          currentIndex: invoice.invoiceDetails.facilityHistories[0].currentIndex
        },
        {
          id: invoice.invoiceDetails.facilityHistories[1].id,
          currentIndex: invoice.invoiceDetails.facilityHistories[1].currentIndex
        },
        {
          id: invoice.invoiceDetails.facilityHistories[2].id,
          currentIndex: invoice.invoiceDetails.facilityHistories[2].currentIndex
        }
      ]
    }
    this.invoicePageService.updateInvoice(updateRequest, invoice.id).subscribe({
        next: (response) => {
          console.log(response);
          this.disableArr[index] = true;
          this.editMode = !this.editMode;
          if(this.isSearchClicked){
            this.fetchInvoiceByKeywords(this.currentPage)
          }else{
            this.fetchInvoiceList(this.from, this.selectedHouse , this.selectedStatus, this.currentPage);
          }
          this.facilityHistoryErrorMessage = '';
          this.errIndex = -1;
        },
        error: (e) => {
          if(e.status === 500){
            this.errIndex = index;
            this.facilityHistoryErrorMessage = e.error.message;
          }
          console.log(e);
        }
      })
  }


  cancelInvoice(invoiceId: number): void{
    this.invoicePageService.cancelInvoice(invoiceId).subscribe({
      next:(response) => {
        console.log(response);
        if(this.isSearchClicked){
          this.fetchInvoiceByKeywords(this.currentPage)
        }else{
          this.fetchInvoiceList(this.from, this.selectedHouse , this.selectedStatus, this.currentPage);
        }
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  createNewInvoice(): void{
    
    if(this.newInvoiceSelectedRoomName === ''){
      this.roomErrorMessage = "Please select room";
      return;
    }

    if(this.newInvoiceSelectedTenant === ''){
      this.tenantErrorMessage = "Please select tenant";
      return;
    }
    if(this.paymentMethod === ''){
      this.paymentMethodErrorMessage = "Please select payment method";
      return;
    }
    if(this.closingDate === null){
      this.closingDateErrorMessage = "Please select closing date";
      return;
    }

    if(this.currentIndexFacilities[0] === '' || this.currentIndexFacilities[1] === '' || this.currentIndexFacilities[2] === '' || this.currentIndexFacilities[3] === ''){
      this.errorMessage = "Please fill in current index";
      return;
    }


    let newInvoiceRequest = {
      tenantId: this.newInvoiceSelectedTenant,
      roomId: this.newInvoiceSelectedRoom.id,
      creatorId: localStorage.getItem('userId'),
      paymentMethod: this.paymentMethod,
      closingDate: this.closingDate,
      facilities: [
        {
          id: this.facilities[1].id,
          currentIndex: this.currentIndexFacilities[1]
        },
        {
          id: this.facilities[2].id,
          currentIndex: this.currentIndexFacilities[2]
        },
        {
          id: this.facilities[3].id,
          currentIndex: this.currentIndexFacilities[3]
        }
      ]
    }
    this.invoicePageService.createInvoice(newInvoiceRequest).subscribe({
      next: (response) => {
        console.log(response);
        this.invoicePage = false;
        this.newInvoiceForm = true;
        this.fetchInvoiceList("", "", "", "");

        //reset
        this.selectedHouse = '';
        this.newInvoiceSelectedRoomName = '';
        this.newInvoiceSelectedTenant = '';
        this.paymentMethod = '';
        this.closingDate = null;
        this.currentIndexFacilities.fill('', 0);
        this.usageAndPrice.fill('', 0);
        this.facilities = [];

        //error message reset

        this.roomErrorMessage = '';
        this.tenantErrorMessage = '';
        this.paymentMethodErrorMessage = '';
        this.closingDateErrorMessage = '';
        this.errorMessage = '';
        
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
  fetchFacilitesByRoomId(roomId: any):void{
    this.invoicePageService.getFacilitiesList(roomId).subscribe({
      next: (response) => {
        this.facilities = response;
        this.currentIndexFacilities = [];
        this.usageAndPrice = [];
        this.facilities.forEach((facility) => {

          this.currentIndexFacilities.push('');
          this.usageAndPrice.push('');
        });
        console.log(this.facilities);
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  createNewInvoicePage(){
    this.invoicePage = true;
    this.newInvoiceForm = false;
  }

  calPrice(event:any, index: number){
    if(this.facilities[index].unit === 'month'){ 
      this.usageAndPrice[index] = {
        usage: 1,
        price: this.facilities[index].unitPrice
      }
      this.currentIndexFacilities[index] = 1;
      return;
    }
    if(this.currentIndexFacilities[index] < this.facilities[index].previousIndex || 
      this.currentIndexFacilities[index] <= 0 && this.facilities[index].unit !== 'month'){
      this.errorMessage ="Current index is a positive integer must greater or equal to previous index";
      return;
    }
 

    let result = {
        usage: this.currentIndexFacilities[index] - this.facilities[index].previousIndex,
        price: (this.currentIndexFacilities[index] - this.facilities[index].previousIndex)*this.facilities[index].unitPrice,
      }
      this.usageAndPrice[index] = result;
      
  }

  totalCal(): number{
    let total = 0;
    this.usageAndPrice.forEach((u)=>{
      total += u.price;
    })

    return total;
  }


  onEditButtonClick(event: Event, index: number){
    event.stopPropagation();
    this.editMode = !this.editMode;
    if(this.editMode){
      this.disableArr[index] = false;
    }else{
      this.disableArr[index] = true;
    }
  }

  onDeleteButtonClick(event: Event, invoiceId: number): void {
    event.stopPropagation();
    this.cancelInvoice(invoiceId);
  }


  

  showTab(tabId: string) {
    this.activeTab = tabId;
  }

  backToInvoicePage(){
    this.newInvoiceForm = true;
    this.invoicePage = false;
  }
}
