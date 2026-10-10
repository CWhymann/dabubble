import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Toast as ToastState } from '../../core/toast';
import { Toast } from './toast';

describe('Toast', () => {
  let fixture: ComponentFixture<Toast>;
  let state: ToastState;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Toast] }).compileComponents();
    state = TestBed.inject(ToastState);
    fixture = TestBed.createComponent(Toast);
    await fixture.whenStable();
  });

  it('should render nothing without content', () => {
    expect(fixture.nativeElement.textContent.trim()).toBe('');
  });

  it('should render the text when content is set', async () => {
    state.content.set({ text: 'E-Mail gesendet', icon: '' });
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('E-Mail gesendet');
  });
});
