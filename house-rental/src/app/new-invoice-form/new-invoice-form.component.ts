import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-invoice-form',
  templateUrl: './new-invoice-form.component.html',
  styleUrls: ['./new-invoice-form.component.scss']
})
export class NewInvoiceFormComponent implements OnInit{
  ngOnInit(): void {
    // this.newInvoice = false;
    // this.invoicePage=  true;
  }
  newInvoice = false;
  invoicePage = true;

  backToInvoicePage(){
    this.newInvoice = true;
    this.invoicePage = false;
  }
}
