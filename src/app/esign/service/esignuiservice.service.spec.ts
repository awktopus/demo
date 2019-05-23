import { TestBed, inject } from '@angular/core/testing';

import { EsignuiserviceService } from './esignuiservice.service';

describe('EsignuiserviceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EsignuiserviceService]
    });
  });

  it('should be created', inject([EsignuiserviceService], (service: EsignuiserviceService) => {
    expect(service).toBeTruthy();
  }));
});
