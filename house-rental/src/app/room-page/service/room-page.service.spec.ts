import { TestBed } from '@angular/core/testing';

import { RoomPageService } from './room-page.service';

describe('RoomPageService', () => {
  let service: RoomPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoomPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
