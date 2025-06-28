import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskFetch } from '../../Services/task-fetch';
import { ActivatedRoute, Router } from '@angular/router';

interface TaskChange {
  $id: string;
  changedAt: string;
  id: number;
  priority: string;
  status: string;
  uTask: any;
  uTaskId: number;
}

@Component({
  selector: 'app-history-page',
  imports: [CommonModule],
  templateUrl: './history-page.html',
  styleUrl: './history-page.css'
})
export class HistoryPage implements OnInit {
  history = inject(TaskFetch);
  activatedRoute = inject(ActivatedRoute);
  changes = signal<TaskChange[]>([]);
  router = inject(Router);
  
  async ngOnInit() {
    const taskId = this.activatedRoute.snapshot.params['id'];
    if (taskId) {
      const response = await this.history.getHistory(taskId);
      if ('error' in response) {
        alert(response.error);
      } else {
        console.log('History response:', response);
        this.changes.set(response);
      }
    } else {
      this.router.navigate(['/']);
    }
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'todo':
        return 'bg-yellow-100 text-yellow-800';
      case 'in progress':
      case 'inprogress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
      case 'done':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getPriorityClass(priority: string): string {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
