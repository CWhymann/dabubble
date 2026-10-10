import { TestBed } from '@angular/core/testing';
import { Toast } from './toast';

describe('Toast', () => {
  let service: Toast;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({});
    service = TestBed.inject(Toast);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should show the content and hide it after the duration', async () => {
    const shown = service.show('Hallo', '/icons/send-white.svg');
    expect(service.content()).toEqual({ text: 'Hallo', icon: '/icons/send-white.svg' });
    await vi.advanceTimersByTimeAsync(2000);
    await shown;
    expect(service.content()).toBeNull();
  });
});
