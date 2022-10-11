import { Injectable } from '@nestjs/common';
import { SchedulerRegistry, Timeout } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  constructor(private schedulerRegistry: SchedulerRegistry) {}

  @Timeout(100)
  some() {
    const ar = [0, 1, 2, 3, 4];
    ar.forEach((a) => {
      this.addNewTimeout(`${a}-timeout`, 2000 * a, () => {
        console.log(`Timeout ${a} executing after ${2000 * a}`);
      });
    });
    this.listTimeouts();
  }

  addNewTimeout(
    timeoutName: string,
    milliseconds: number,
    callback: () => void,
  ) {
    const timeout = setTimeout(callback, milliseconds);
    this.schedulerRegistry.addTimeout(timeoutName, timeout);
  }

  listTimeouts() {
    const timeouts = this.schedulerRegistry.getTimeouts();
    timeouts.forEach((key) => console.log(`Timeout Name: ${key}`));
  }
}
