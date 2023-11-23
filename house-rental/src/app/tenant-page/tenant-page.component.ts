
import { TenantPageService } from './service/tenant-page.service';
import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Tenant } from './models/tenant.model';
import { House } from '../house-page/models/house';
import { HousePageService } from '../house-page/service/house-page.service';
import { Room } from './models/room.model';
import { NewTenantFormComponent } from '../new-tenant-form/new-tenant-form.component';
import { HouseService } from '../new-house-form/services/house.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-tenant-page',
  templateUrl: './tenant-page.component.html',
  styleUrls: ['./tenant-page.component.scss']
})
export class TenantPageComponent {

  ngOnInit() {
    this.fetchTenantList("", "", "", "");
    this.fetchHouseList()
    this.fetchAllRoomList();
    this.fetchRoomListForUpdateTenant()
  }
  constructor(private tenantPageService: TenantPageService, private houseServcie: HousePageService, private newHouseService: HouseService, private snackBar: MatSnackBar){

  }


  disableArr: boolean[] = [];

  tenants: Tenant[] = [];
  houses: House[] = [];
  selectedHouse = ''; 

  rooms: Room[] = []
  selectedRoom = '';

  selectedStatus = '';

  keywords = '';
  isSearchClicked = false;

  totalPages!: number;

  allRooms: Room[] =[];


  editMode: boolean = false;

  currentPage= '0';

  selectedIndexArr: number[] = [];
  showModal: boolean = false;
  selectedImageId!: number;
  selectedFiles: File[] = [];
  roomListForUpdateTenant: Room[] = [];

  @Input() indicators = true;

  selectedImage(index:number, houseIndex: number): void{
    this.selectedIndexArr[houseIndex] = index;
  }

  onFileSelected(event: any) {
    this.selectedFiles = event.target.files;
  }
  
  showDeleteConfirmationModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  deleteImageConfirmed(tenantIndex: number) {
    let imageIndex = this.selectedIndexArr[tenantIndex];
    this.selectedImageId = this.tenants[tenantIndex].imageData[imageIndex].id;
    this.selectedIndexArr[tenantIndex] = 0;
    this.houseServcie.deleteImage(this.selectedImageId).subscribe({
      next: (response: any) => {
        console.log(response);
        if (this.isSearchClicked) {
          this.fetchTenantByKeywords(this.currentPage)
        } else {
          this.fetchTenantList(this.selectedHouse, this.selectedRoom, this.selectedStatus, this.currentPage);
        }
        this.closeModal();
      },
      error: (error) => {
        console.log(error);
      }
    });
    
  }

  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }


  isCollapsed: { [target: string]: boolean } = {};
  toggleCollapse(target: string) {
    this.isCollapsed[target] = !this.isCollapsed[target];
  }

  fetchTenantList(houseName: string, roomName: string, status: string, page: string): void {
    this.tenantPageService.getTenantList(houseName, roomName, status, page).subscribe({
      next: (response) => {
        this.tenants = response.data;
        this.totalPages  = response.totalPages;
        this.tenants.forEach((_)=>{
          this.disableArr.push(true);
          this.selectedIndexArr.push(0);
        })
        this.isSearchClicked = false;
        this.currentPage = page;
        
        console.log(this.tenants);
      }
    })
  }

  fetchTenantByKeywords(page: string): void {
    this.tenantPageService.searchTenant(this.keywords, page).subscribe({
      next:(response) => {
        this.tenants = response.data;
        this.totalPages  = response.totalPages;
        this.isSearchClicked = true;
        this.currentPage = page;
        this.selectedHouse = '';
        this.selectedRoom = '';
        this.selectedStatus = '';
      },
      error: (error) =>{
        console.log(error);
      }
    })
  }

  fetchHouseList(): void {
    this.houseServcie.getHouseList("", "", "", "", "", "100").subscribe({
      next:(response) => {this.houses = response.houses;},
      error:(error) => {
        console.log(error);
      }
    });
  }

  fetchRoomList(): void {
    this.tenantPageService.getRoomList(this.selectedHouse).subscribe({
      next: (response) => {this.rooms = response.data;},
      error: (error) => {
        console.log(error);
      }
    })
  }

  fetchRoomListForUpdateTenant(): void {
    this.tenantPageService.getRoomList(this.selectedHouse).subscribe({
      next: (response) => {this.roomListForUpdateTenant = response.data;},
      error: (error) => {
        console.log(error);
      }
    })
  }
  fetchAllRoomList(): void {
    this.tenantPageService.getRoomList("").subscribe({
      next: (response) => {this.allRooms = response.data;},
      error: (error) => {
        console.log(error);
      }
    })
  }

  @ViewChild('newTenantForm', { static: false }) newTenantForm!: NewTenantFormComponent;
  ngAfterViewInit(): void {
    this.newTenantForm.saveClicked.subscribe(()=> {
      this.fetchTenantList("", "", "", "");
      this.newTenantForm.fetchRoomList();
    })
  }

  onHouseChange(event: any){
    this.selectedHouse = event.target.value;
    this.selectedRoom = '';
    this.selectedStatus = '';
    this.fetchRoomList();
    this.fetchTenantList(this.selectedHouse, "", this.selectedStatus, "");
  }

  onRoomChange(event: any){
    this.selectedRoom = event.target.value;
    this.selectedStatus = '';
    this.fetchTenantList(this.selectedHouse, this.selectedRoom, this.selectedStatus, "");
  }

  onStatusChange(event: any){
    this.selectedStatus = event.target.value;
    this.fetchTenantList(this.selectedHouse, this.selectedRoom, this.selectedStatus, "");
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


  
  showToast() {
    this.snackBar.open('This room is reached capacity!', 'Dismiss', {
      duration: 3000, 
      horizontalPosition: 'center',
      verticalPosition: 'bottom',  
    });
  }

  

  updateTenant(tenant: Tenant, index: number): void{
    if (!this.selectedFiles || this.selectedFiles.length === 0) {
      if(tenant.status === "Active"){
        let tenantRoom: any  = this.roomListForUpdateTenant.find((room) => room.id === tenant.roomId);
        if(tenantRoom.currentTenant === tenantRoom.capacity){
          this.showToast();
          if(this.isSearchClicked){
            this.fetchTenantByKeywords(this.currentPage)
          }else{
            this.fetchTenantList(this.selectedHouse, this.selectedRoom , this.selectedStatus, this.currentPage);
          }
          return;
        }
      }
      this.tenantPageService.updateTenant(tenant.tenantName, tenant.roomId, tenant.birthDate, tenant.gender,
        tenant.phone, tenant.email, tenant.idNumber, tenant.permanentAddress, tenant.licensePlates,
        tenant.rentDate, tenant.status, tenant.description, tenant.tenantRoomId).subscribe({
          next: (response) => {
            console.log(response);
            this.disableArr[index] = true;
            this.editMode = !this.editMode;
            this.newTenantForm.fetchRoomList();
            if(this.isSearchClicked){
              this.fetchTenantByKeywords(this.currentPage)
            }else{
              this.fetchTenantList(this.selectedHouse, this.selectedRoom , this.selectedStatus, this.currentPage);
            }
          },
          error: (e) => {
            console.log(e);
          }
        });
      return;
    }
    const formData = new FormData();

    for (let i = 0; i < this.selectedFiles.length; i++) {
      formData.append('files', this.selectedFiles[i]);
    }

    this.newHouseService.uploadFiles(formData, tenant.id, "tenant").subscribe({
      next: (response: any) => {
        console.log(response);
        if(response.status === 200){
          console.log("ok");
        }
        this.tenantPageService.updateTenant(tenant.tenantName, tenant.roomId, tenant.birthDate, tenant.gender,
          tenant.phone, tenant.email, tenant.idNumber, tenant.permanentAddress, tenant.licensePlates,
          tenant.rentDate, tenant.status, tenant.description, tenant.tenantRoomId).subscribe({
            next: (response) => {
              console.log(response);
              this.newTenantForm.fetchRoomList();
              this.disableArr[index] = true;
              this.editMode = !this.editMode;
              this.selectedFiles = []; 
              if(this.isSearchClicked){
                this.fetchTenantByKeywords(this.currentPage)
              }else{
                this.fetchTenantList(this.selectedHouse, this.selectedRoom , this.selectedStatus, this.currentPage);
              }
            },
            error: (e) => {
              console.log(e);
            }
          });
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  inactiveTenant(tenantId: number): void{
    this.tenantPageService.inactiveTenant(tenantId).subscribe({
      next:(response) => {
        console.log(response);
        if(this.isSearchClicked){
          this.fetchTenantByKeywords(this.currentPage)
        }else{
          this.fetchTenantList(this.selectedHouse, this.selectedRoom , this.selectedStatus, this.currentPage);
        }
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  onDeleteButtonClick(event: Event, tenantId: number): void {
    event.stopPropagation();
    this.inactiveTenant(tenantId);
  }
}
