import { RoomPageService } from './service/room-page.service';
import { Component, Input, ViewChild } from '@angular/core';
import { InvoiceData, Room } from './models/room.model';
import { House } from '../house-page/models/house';
import { HousePageService } from '../house-page/service/house-page.service';
import { NewRoomFormComponent } from '../new-room-form/new-room-form.component';
import { HouseService } from '../new-house-form/services/house.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-room-page',
  templateUrl: './room-page.component.html',
  styleUrls: ['./room-page.component.scss']
})
export class RoomPageComponent {

  ngOnInit() {
    this.fetchRoomList('', '', '', '');
    this.fetchHouseList();
  }

  constructor(private roomPageService: RoomPageService, private houseServcie: HousePageService, private newHouseService: HouseService, private snackBar: MatSnackBar) {}

  disableArr: boolean[] = [];
  activeTab: string = 'infoTab';
  rooms: Room[] = [];
  houses: House[] = [];
  selectedHouse = '';

  selectedStatus = '';

  keywords = '';
  isSearchClicked = false;

  totalPages!: number;

  currentPage = '0';

  //
  floors: number[] = [1, 2, 3, 4, 5];
  selectedFloor:any = '';

  invoiceMap: Map<any, InvoiceData[]> = new Map();
  selectedIndexArr: number[] = [];
  showModal: boolean = false;
  selectedImageId!: number;
  selectedFiles: File[] = [];

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

  deleteImageConfirmed(roomIndex: number) {
    let imageIndex = this.selectedIndexArr[roomIndex];
    this.selectedImageId = this.rooms[roomIndex].imageData[imageIndex].id;
    this.selectedIndexArr[roomIndex] = 0;
    this.houseServcie.deleteImage(this.selectedImageId).subscribe({
      next: (response: any) => {
        console.log(response);
        if (this.isSearchClicked) {
          this.fetchRoomByKeywords(this.currentPage)
        } else {
          this.fetchRoomList(this.selectedHouse, this.selectedFloor, this.selectedStatus, this.currentPage);
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

  fetchRoomList(houseName: string, floor: string, status: string, page: string): void {
    this.roomPageService.getRoomList(houseName, floor, status, page).subscribe({
      next: (response) => {
        this.rooms = response.data;
        this.totalPages = response.totalPages;
        this.rooms.forEach((room) => {
          this.disableArr.push(true);
          this.selectedIndexArr.push(0);
          this.currentRoomsCapacity.push(room.capacity)
        });
        this.isSearchClicked = false;
        this.currentPage = page;
        // invoice data
        this.rooms.forEach((room) => {
          this.fetchInvoiceData(room.id);
        });

        console.log(this.rooms);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  fetchRoomByKeywords(page: string): void {
    this.roomPageService.searchRoom(this.keywords, page).subscribe({
      next: (response) => {
        this.rooms = response.data;
        this.totalPages = response.totalPages;
        this.isSearchClicked = true;
        this.currentPage = page;
        this.selectedHouse = '';
        this.selectedFloor = '';
        this.selectedStatus = '';
        
        this.rooms.forEach((room) => {
          this.fetchInvoiceData(room.id);
          this.currentRoomsCapacity.push(room.capacity);
        });
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  fetchHouseList(): void {
    this.houseServcie.getHouseList('', '', '', '', '', '100').subscribe({
      next: (response) => {
        this.houses = response.houses;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  fetchInvoiceData(roomId: number): void {
    this.roomPageService.getInvoiceData(roomId).subscribe({
      next: (response) => {
        this.invoiceMap.set(roomId, response.data);
      },
      error: (error) => {
        console}
      });
}

  @ViewChild(NewRoomFormComponent) newRoomForm!: NewRoomFormComponent;
  ngAfterViewInit(): void {
    this.newRoomForm.saveClicked.subscribe(() => {
      this.fetchRoomList('', '', '', '');
      
    });
  }

  onHouseChange(event: any) {
    this.selectedHouse = event.target.value;
    this.fetchRoomList(this.selectedHouse, this.selectedFloor, this.selectedStatus, '');
  }

  onStatusChange(event: any) {
    this.selectedStatus = event.target.value;
    this.fetchRoomList(this.selectedHouse, this.selectedFloor,this.selectedStatus, '');
  }

  onFloorChange(event: any) {
    this.selectedFloor = event.target.value;
    this.fetchRoomList(this.selectedHouse, this.selectedFloor,this.selectedStatus, '');
  }

  onEditButtonClick(event: Event, index: number) {
    event.stopPropagation();
    this.disableArr[index] = !this.disableArr[index];
  }

  currentRoomsCapacity: number[] = [];
  showToast() {
    this.snackBar.open('Cannot change capacity of a room that is currently occupied', 'Dismiss', {
      duration: 3000, 
      horizontalPosition: 'center',
      verticalPosition: 'bottom',  
    });
  }

  updateRoom(room: Room, index: number): void {
    if (!this.selectedFiles || this.selectedFiles.length === 0) {
      if(room.currentTenant !== 0  && room.capacity !== this.currentRoomsCapacity[index]){
        this.showToast();
        if (this.isSearchClicked) {
          this.fetchRoomByKeywords(this.currentPage);
        } else {
          this.fetchRoomList(this.selectedHouse, this.selectedFloor, this.selectedStatus, this.currentPage);
        }
        return;
      }
      this.roomPageService
      .updateRoom(
        room.name,
        room.status,
        room.floor,
        room.area,
        room.capacity,
        room.rentFee,
        room.description,
        room.id
      )
      .subscribe({
        next: (response) => {
          console.log(response);
          this.disableArr[index] = true;
          if (this.isSearchClicked) {
            this.fetchRoomByKeywords(this.currentPage);
          } else {
            this.fetchRoomList(this.selectedHouse, this.selectedFloor, this.selectedStatus, this.currentPage);
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

    this.newHouseService.uploadFiles(formData, room.id, "room").subscribe({
      next: (response: any) => {
        console.log(response);
        if(response.status === 200){
          console.log("ok");
        }
        this.roomPageService
      .updateRoom(
        room.name,
        room.status,
        room.floor,
        room.area,
        room.capacity,
        room.rentFee,
        room.description,
        room.id
      )
      .subscribe({
        next: (response) => {
          console.log(response);
          this.disableArr[index] = true;
          this.selectedFiles = [];
          if (this.isSearchClicked) {
            this.fetchRoomByKeywords(this.currentPage);
          } else {
            this.fetchRoomList(this.selectedHouse, this.selectedFloor, this.selectedStatus, this.currentPage);
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

  inactiveRoom(roomId: number): void {
    this.roomPageService.inactiveRoom(roomId).subscribe({
      next: (response) => {
        console.log(response);
        if (this.isSearchClicked) {
          this.fetchRoomByKeywords(this.currentPage);
        } else {
          this.fetchRoomList(this.selectedHouse, this.selectedStatus, '', this.currentPage);
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  onDeleteButtonClick(event: Event, roomId: number): void {
    event.stopPropagation();
    this.inactiveRoom(roomId);
  }

  
  showTab(tabId: string) {
    this.activeTab = tabId;
  }
}
