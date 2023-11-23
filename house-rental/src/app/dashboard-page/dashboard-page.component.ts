import { Component, OnInit, Inject } from '@angular/core';
import Chart from 'chart.js/auto';
import { APP_SERVICE_CONFIG } from '../AppConfig/appconfig.service';
import { AppConfig } from '../AppConfig/appconfig.interface';
import { DashboardPageService } from './service/dashboard-page.service';
import { GeneralGrow } from './models/general-grow';
@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit {
  ngOnInit(): void {

    this.fetchGeneralGrow();
    this.dashboardService.getChartInfor("/income").subscribe(result => {
      this.barChartData = result;
      if(this.barChartData != null){
        for(let i=0; i <this.barChartData.length; i++){
          // console.log(this.barChartData[i]);
          this.labelData1.push(this.barChartData[i].month);
          this.data1.push(this.barChartData[i].amount);
      
        }
        this.renderChart(this.labelData1, this.data1, "bar", "barChart");
        
      }
    });
    this.dashboardService.getChartInfor("/income-per-house").subscribe(result => {
      this.doughnutChartData = result;
      if(this.doughnutChartData != null){
        for(let i=0; i<this.doughnutChartData.length; i++){
          this.labelData2.push(this.doughnutChartData[i].house);
          this.data2.push(this.doughnutChartData[i].amount);
        }
        this.renderChart(this.labelData2, this.data2, "doughnut", "doughnutChart");
      }
    });

    this.dashboardService.getChartInfor("/tenants-by-house").subscribe(result => {
      this.lineChartData = result;
      if(this.lineChartData != null){
        for(let i=0; i<this.lineChartData.length; i++){
          this.labelData3.push(this.lineChartData[i].house);
          this.data3.push(this.lineChartData[i].amount);
        }
        this.renderChart(this.labelData3, this.data3, "line", "lineChart");
      }
    });
  }



  constructor(private dashboardService: DashboardPageService){
  
  }

  barChartData:any;
  labelData1:any[] = [];
  data1:any[] = [];

  doughnutChartData: any;
  labelData2: any[] = [];
  data2: any[] = [];

  lineChartData: any;
  labelData3: any[] = [];
  data3: any[] = [];
  
  

  renderChart(labelData:any, data:any, type:any, id:any, colorCode?:any){
    const myChart = new Chart(id, {
      type: type,
      data: {
        labels: labelData,
        datasets: [{
          label: 'VND',
          data: data,
          borderWidth: 1,
        }
      ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }


  generalGrow!: GeneralGrow;

  
  fetchGeneralGrow() {
    this.dashboardService.getGeneralGrow().subscribe({
      next: (response) => {
        console.log(response);
        this.generalGrow = response;
      },
      error: (error) => {
        console.log(error);
      }

    })
  }
  
}
