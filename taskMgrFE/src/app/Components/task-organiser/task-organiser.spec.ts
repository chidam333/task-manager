import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskOrganiser } from './task-organiser';

describe('TaskOrganiser', () => {
  let component: TaskOrganiser;
  let fixture: ComponentFixture<TaskOrganiser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskOrganiser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskOrganiser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
