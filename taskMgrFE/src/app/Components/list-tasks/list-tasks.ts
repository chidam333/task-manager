import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
  computed,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskFetch } from '../../Services/task-fetch';

@Component({
  selector: 'app-list-tasks',
  imports: [DatePipe, FormsModule],
  templateUrl: './list-tasks.html',
  styleUrl: './list-tasks.css',
})
export class ListTasks implements OnInit {
  tasks: WritableSignal<any[]> = signal([]);
  searchTerm: WritableSignal<string> = signal('');
  statusFilter: WritableSignal<string> = signal('');
  priorityFilter: WritableSignal<string> = signal('');
  sortBy: WritableSignal<string> = signal('dueDate');
  sortOrder: WritableSignal<'asc' | 'desc'> = signal('asc');
  
  taskService = inject(TaskFetch);

  filteredAndSortedTasks = computed(() => {
    let filteredTasks = this.tasks();

    if (this.searchTerm()) {
      const search = this.searchTerm().toLowerCase();
      filteredTasks = filteredTasks.filter(task => 
        task.title.toLowerCase().includes(search) ||
        task.description.toLowerCase().includes(search)
      );
    }

    if (this.statusFilter()) {
      filteredTasks = filteredTasks.filter(task => 
        task.status === this.statusFilter()
      );
    }

    if (this.priorityFilter()) {
      filteredTasks = filteredTasks.filter(task => 
        task.priority === this.priorityFilter()
      );
    }

    if (this.sortBy() === 'dueDate') {
      filteredTasks.sort((a, b) => {
        const dateA = new Date(a.dueDate).getTime();
        const dateB = new Date(b.dueDate).getTime();
        return this.sortOrder() === 'asc' ? dateA - dateB : dateB - dateA;
      });
    }

    return filteredTasks;
  });
  async ngOnInit() {
    await this.fetchTask();
  }
  async fetchTask() {
    const response = await this.taskService.getTasks();
    if ('error' in response) {
      console.error('Error fetching tasks:', response.error);
      alert('Error fetching tasks: ' + response.error);
      return;
    }
    console.log('Tasks fetched successfully:', response);
    this.tasks.set(response);
  }

  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
  }

  onStatusFilterChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.statusFilter.set(target.value);
  }

  onPriorityFilterChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.priorityFilter.set(target.value);
  }

  toggleSortOrder() {
    this.sortOrder.set(this.sortOrder() === 'asc' ? 'desc' : 'asc');
  }

  clearFilters() {
    this.searchTerm.set('');
    this.statusFilter.set('');
    this.priorityFilter.set('');
  }

  onPriorityChange(task: any, event: Event) {
    const target = event.target as HTMLSelectElement;
    if (target && target.value) {
      this.changePriority(task, target.value);
    }
  }

  onStatusChange(task: any, event: Event) {
    const target = event.target as HTMLSelectElement;
    if (target && target.value) {
      this.changeStatus(task, target.value);
    }
  }

  async changePriority(task: any, priority: string) {
    if (priority == task.priority) {
      return;
    }
    const response = await this.taskService.updateTask(
      task.id,
      task.title,
      task.description,
      task.dueDate,
      priority,
      task.status
    );
    if ('error' in response) {
      alert('Error updating task priority: ' + response.error);
      return;
    }
    console.log('Task priority updated successfully:', response);
    await this.fetchTask();
  }

  async changeStatus(task: any, status: string) {
    if (status == task.status) {
      return;
    }
    const response = await this.taskService.updateTask(
      task.id,
      task.title,
      task.description,
      task.dueDate,
      task.priority,
      status
    );
    if ('error' in response) {
      alert('Error updating task status: ' + response.error);
      return;
    }
    console.log('Task status updated successfully:', response);
    await this.fetchTask();
  }
}
