import { Component, inject, input, model, OnInit, ViewChild, ElementRef, effect, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskFetch } from '../../Services/task-fetch';

@Component({
  selector: 'app-home-right-dialog',
  imports: [FormsModule],
  templateUrl: './home-right-dialog.html',
  styleUrl: './home-right-dialog.css',
})
export class HomeRightDialog {
  @ViewChild('homeRightDialog') dialogElement!: ElementRef<HTMLDialogElement>;
  taskFetchService = inject(TaskFetch);
  titleSignal = input.required<WritableSignal<string>>();
  title = '';
  description = '';
  dueDate = new Date();

  constructor() {
    effect(() => {
      console.log(this.titleSignal(), "title signal");
      this.title = this.titleSignal()();
    });
  }
  priority: 'High' | 'Medium' | 'Low' = 'High';
  status: 'Todo' | 'In Progress' | 'Done' = 'Todo';
  priorityOptions = ['High', 'Medium', 'Low'];
  statusOptions = ['Todo', 'In Progress', 'Done'];

  async onSubmit(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    const result = await this.taskFetchService.addTask(
      this.title,
      this.description,
      this.dueDate,
      this.priority,
      this.status
    );
    if('error' in result) {
      console.error('Error adding task:', result.error);
      alert('Error adding task: ' + result.error);
      return;
    }
    alert('Task added successfully!');
    console.log('Task added:', result);
    this.titleSignal().set('');
    this.closeModal();
  }

  showModal() {
    if (this.dialogElement) {
      this.dialogElement.nativeElement.showModal();
    }
  }

  closeModal() {
    if (this.dialogElement) {
      this.dialogElement.nativeElement.close();
    }
  }
}
