import { Component, HostListener, ViewChild, ElementRef, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HomeRightDialog } from '../home-right-dialog/home-right-dialog';
import { TaskFetch } from '../../Services/task-fetch';
import { TaskOrganiser } from "../task-organiser/task-organiser";
import { ListTasks } from "../list-tasks/list-tasks";

@Component({
  selector: 'app-home-right',
  imports: [FormsModule, HomeRightDialog, TaskOrganiser, ListTasks],
  templateUrl: './home-right.html',
  styleUrl: './home-right.css',
})
export class HomeRight {
  @ViewChild('taskInput') taskInput!: ElementRef<HTMLInputElement>;
  @ViewChild(HomeRightDialog) dialog!: HomeRightDialog;

  taskFetchService = inject(TaskFetch);
  inputValue = signal('');
  isInputFocused: boolean = false;

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.ctrlKey && event.code === 'Space') {
      event.preventDefault();
      this.focusInput();
    }
  }

  focusInput() {
    if (this.taskInput) {
      this.taskInput.nativeElement.focus();
    }
  }

  onInputFocus() {
    this.isInputFocused = true;
  }

  onInputBlur() {
    this.isInputFocused = false;
  }
  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.inputValue().trim() !== '') {
      event.preventDefault();
      event.stopPropagation();
      console.log('Task getting added:', this.inputValue());
      this.showDialog();
       this.isInputFocused = false;
      if (this.taskInput) {
        this.taskInput.nativeElement.blur();
      }
    }
  }

  showDialog() {
    if (this.dialog) {
      this.dialog.showModal();
    }
  }
}
