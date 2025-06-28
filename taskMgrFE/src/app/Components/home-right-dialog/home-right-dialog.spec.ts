import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeRightDialog } from './home-right-dialog';

describe('HomeRightDialog', () => {
  let component: HomeRightDialog;
  let fixture: ComponentFixture<HomeRightDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeRightDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeRightDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
