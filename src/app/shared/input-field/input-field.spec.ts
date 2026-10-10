import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputField } from './input-field';

describe('InputField', () => {
  let component: InputField;
  let fixture: ComponentFixture<InputField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputField],
    }).compileComponents();

    fixture = TestBed.createComponent(InputField);
    fixture.componentRef.setInput('icon', '/icons/mail.svg');
    fixture.componentRef.setInput('label', 'E-Mail');
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
