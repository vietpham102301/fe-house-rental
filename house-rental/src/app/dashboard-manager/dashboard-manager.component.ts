import { Router } from '@angular/router';
import { AuthService } from './../auth/auth.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-manager',
  templateUrl: './dashboard-manager.component.html',
  styleUrls: ['./dashboard-manager.component.scss']
})
export class DashboardManagerComponent {
  constructor(private router: Router, private authService: AuthService){}

  username: any;

  ngOnInit(): void {
    this.dashboardLink = document.getElementById('dashboardLink')
    if(this.dashboardLink){
      this.dashboardLink.style.fontWeight = 'bold';
    }
    this.openInitialPage();
    this.count = 0;
    this.username = localStorage.getItem('username');
  }


  logout() {
    this.authService.logout();
  }


  dashboardLink:any;
  count!:number;
  selectedLinkId:any;
  handleClick(event: MouseEvent, id: string) {
    if(this.count ===0){
      this.selectedLinkId = 'dashboardLink';
      this.count++;
    }
    if (this.selectedLinkId) {
      const previousLink = document.getElementById(this.selectedLinkId);
      if(previousLink)
      {
        previousLink.style.fontWeight = 'normal';
      }
      
    }
    
    const target = event.target as HTMLAnchorElement;
    target.style.fontWeight = 'bold';
    
    this.selectedLinkId = id;
    
  }

  openInitialPage(){
    this.router.navigate(["/dashboard-manager/dashboard-page"]);
  }
}
