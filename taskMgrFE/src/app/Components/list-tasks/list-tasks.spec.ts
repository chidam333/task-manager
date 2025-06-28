import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTasks } from './list-tasks';

describe('ListTasks', () => {
  let component: ListTasks;
  let fixture: ComponentFixture<ListTasks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListTasks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListTasks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
