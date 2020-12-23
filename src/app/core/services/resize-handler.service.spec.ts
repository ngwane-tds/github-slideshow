import { TestBed } from '@angular/core/testing';

import { ResizeHandlerService } from './resize-handler.service';

describe('ResizeHandlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ResizeHandlerService = TestBed.get(ResizeHandlerService);
    expect(service).toBeTruthy();
  });
});
