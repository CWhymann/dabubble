import { TestBed } from '@angular/core/testing';
import { RegisterState } from './register-state';

describe('RegisterState', () => {
  let service: RegisterState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegisterState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save and clear data', () => {
    service.save({ name: 'Noah Braun', email: 'noah@email.com', password: '12345678' });
    expect(service.data()?.name).toBe('Noah Braun');
    service.clear();
    expect(service.data()).toBeNull();
  });

  it('should save the avatar and clear it with the data', () => {
    service.selectAvatar('/icons/avatar-noah-braun.svg');
    expect(service.avatar()).toBe('/icons/avatar-noah-braun.svg');
    service.clear();
    expect(service.avatar()).toBeNull();
  });
});
