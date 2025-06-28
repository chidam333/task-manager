import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TaskFetch } from '../../Services/task-fetch';

@Component({
  selector: 'app-list-tasks',
  imports: [DatePipe],
  templateUrl: './list-tasks.html',
  styleUrl: './list-tasks.css'
})
export class ListTasks implements OnInit{
  tasks:WritableSignal<any[]> = signal([]);
  taskService = inject(TaskFetch);
  async ngOnInit() {
    const response = await this.taskService.getTasks();
    if('error' in response) {
      console.error('Error fetching tasks:', response.error);
      alert('Error fetching tasks: ' + response.error);
      return;
    }
    console.log('Tasks fetched successfully:', response);
    this.tasks.set(response);
  }
}
