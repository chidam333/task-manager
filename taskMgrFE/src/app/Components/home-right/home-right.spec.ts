import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeRight } from './home-right';

describe('HomeRight', () => {
  let component: HomeRight;
  let fixture: ComponentFixture<HomeRight>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeRight]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeRight);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
