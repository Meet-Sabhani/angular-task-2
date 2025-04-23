import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription, combineLatest, interval, map } from 'rxjs';
import { addRemainder, updateStore } from '../ngrx/actions';
import { taskList } from '../ngrx/selector';
import moment from 'moment';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
})
export class TaskComponent implements OnDestroy {
  public liveTime: string = '';
  public taskName: string = '';
  public taskTime: string = '';
  public taskList$: Observable<any>;
  private subscriptions = new Subscription();
  public isSpeed: boolean = false;
  public increasedTimer: any;

  constructor(private store: Store) {
    this.taskList$ = this.store.select(taskList);
  }
  public displayTasks: any = [];

  ngOnInit() {
    const taskSub = this.store.select(taskList).subscribe((tasks) => {
      this.displayTasks = tasks;
    });
    this.increasedTimer = moment();

    const timerSub = interval(1000).subscribe(() => {
      // If fast-forward is enabled, add 1 minute every second
      this.increasedTimer.add(this.isSpeed ? 1 : 0, 'minutes');
      // Always add 1 second to simulate real passage of time
      this.increasedTimer.add(1, 'seconds');

      this.liveTime = this.increasedTimer.format('hh:mm A');

      this.displayTasks = this.displayTasks.map((task:any) => ({
        ...task,
        completedTask: moment(this.liveTime, 'hh:mm A').isSameOrAfter(moment(task.time, 'hh:mm A')),
      }));
    });
  }

  toggleSpeed() {
    this.isSpeed = !this.isSpeed;
  
    if (!this.isSpeed) {
      this.increasedTimer = moment();
      this.liveTime = this.increasedTimer.format('hh:mm A');
    }
  }

  addTaskList() {
    this.store.dispatch(
      addRemainder({
        value: [
          {
            id: Date.now(),
            time: moment(this.taskTime, 'HH:mm').format('hh:mm A'),
            name: this.taskName,
            completedTask: false,
          },
        ],
      })
    );

    this.taskName = '';
    this.taskTime = '';
  }

  checkRemainder(tasks: any[], currentTime: string) {
    const updatedTasks = tasks.map((task) => {
      const taskMoment = moment(task.time, 'hh:mm A');
      const currentMoment = moment(currentTime, 'hh:mm A');
      const isDue = currentMoment.isSameOrAfter(taskMoment);

      return {
        ...task,
        completedTask: isDue,
      };
    });

    this.store.dispatch(updateStore({ value: updatedTasks }));
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
