import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AVATARS } from '../../core/avatars';
import { RegisterState } from '../../core/register-state';
import { Avatar } from './avatar';

describe('Avatar', () => {
  let fixture: ComponentFixture<Avatar>;
  let state: RegisterState;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Avatar] }).compileComponents();
    state = TestBed.inject(RegisterState);
    state.clear();
    fixture = TestBed.createComponent(Avatar);
    await fixture.whenStable();
  });

  function avatarButtons(): HTMLButtonElement[] {
    const group = fixture.nativeElement.querySelector('[role="group"]');
    return Array.from(group.querySelectorAll('button'));
  }

  it('should show all avatars', () => {
    expect(avatarButtons().length).toBe(AVATARS.length);
  });

  it('should disable continue until an avatar is chosen', async () => {
    const next = fixture.nativeElement.querySelector('app-button-primary button');
    expect(next.disabled).toBe(true);
    avatarButtons()[0].click();
    await fixture.whenStable();
    expect(next.disabled).toBe(false);
  });

  it('should save the chosen avatar and mark it as pressed', async () => {
    avatarButtons()[2].click();
    await fixture.whenStable();
    expect(state.avatar()).toBe(AVATARS[2].src);
    expect(avatarButtons()[2].getAttribute('aria-pressed')).toBe('true');
    expect(avatarButtons()[0].getAttribute('aria-pressed')).toBe('false');
  });
});
