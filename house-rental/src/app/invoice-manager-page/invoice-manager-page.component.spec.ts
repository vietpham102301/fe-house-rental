import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceManagerPageComponent } from './invoice-manager-page.component';

describe('InvoiceManagerPageComponent', () => {
  let component: InvoiceManagerPageComponent;
  let fixture: ComponentFixture<InvoiceManagerPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvoiceManagerPageComponent]
    });
    fixture = TestBed.createComponent(InvoiceManagerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
