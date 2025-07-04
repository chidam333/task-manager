import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthFetch } from '../Components/auth/auth-service/auth-fetch';
@Injectable({
  providedIn: 'root'
})
export class TaskFetch {
  authFetch = inject(AuthFetch);
  async getTasks(){
    const token = this.authFetch.getStoredToken();
    const response = await fetch(`${environment.apiUrl}/task`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      const errorData = await response.text();
      return {error:errorData || 'Failed to fetch tasks'};
    }
    const data = await response.json();
    if(!data['$values']){
      return {error: 'No tasks found'};
    }
    return data['$values'];
  }
  async addTask(title: string, description: string, dueDate: Date, priority: string, status:string){
    const token = this.authFetch.getStoredToken();
    const response = await fetch(`${environment.apiUrl}/task`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, description, dueDate, priority, status })
    });
    if (!response.ok) {
      const errorData = await response.text();
      return {error:errorData || 'Failed to add task'};
    }
    const data = await response.json();
    console.log('Added task:', data);
    return data;
  }
  async updateTask(id: string, title: string, description: string, dueDate: Date, priority: string, status:string){
    const token = this.authFetch.getStoredToken();
    const response = await fetch(`${environment.apiUrl}/task/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, description, dueDate, priority, status })
    });
    if (!response.ok) {
      const errorData = await response.text();
      return {error:errorData || 'Failed to update task'};
    }
    const data = await response.json();
    console.log('Updated task:', data);
    return data;
  }

  async deleteTask(id: string){
    const token = this.authFetch.getStoredToken();
    const response = await fetch(`${environment.apiUrl}/task/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      const errorData = await response.text();
      return {error:errorData || 'Failed to delete task'};
    }
    const data = await response.json();
    return data['$values'] || {message: 'Some error check console'};
  }

  async getHistory(taskId: string){
    const token = this.authFetch.getStoredToken();
    const response = await fetch(`${environment.apiUrl}/task/history/${taskId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      const errorData = await response.text();
      return {error:errorData || 'Failed to fetch task history'};
    }
    const data = await response.json();
    return data['$values'] || [];
  }
}
