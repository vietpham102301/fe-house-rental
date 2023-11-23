import { TestBed } from '@angular/core/testing';

import { HousePageService } from './house-page.service';

describe('HousePageService', () => {
  let service: HousePageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HousePageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
