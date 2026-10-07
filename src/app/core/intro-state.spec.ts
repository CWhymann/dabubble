import { TestBed } from '@angular/core/testing';
import { IntroState } from './intro-state';

describe('IntroState', () => {
  let service: IntroState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntroState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
