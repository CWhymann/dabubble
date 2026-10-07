import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrDivider } from './or-divider';

describe('OrDivider', () => {
  let component: OrDivider;
  let fixture: ComponentFixture<OrDivider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrDivider],
    }).compileComponents();

    fixture = TestBed.createComponent(OrDivider);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
