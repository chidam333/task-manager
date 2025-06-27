import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormErrorToast } from './form-error-toast';

describe('FormErrorToast', () => {
  let component: FormErrorToast;
  let fixture: ComponentFixture<FormErrorToast>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormErrorToast]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormErrorToast);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
