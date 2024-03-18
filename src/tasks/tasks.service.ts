import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import { v4 } from 'uuid';
import { createTaskDto } from './dto/create-task.dto';
import { getTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks() {
    return this.tasks;
  }

  getTasksWithFilters(getTasksFilterDto: getTasksFilterDto): Task[] {
    const { status, search } = getTasksFilterDto;
    let tasks = this.getAllTasks();
    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }
    if (search) {
      tasks = tasks.filter(
        (task) =>
          task.title.includes(search) || task.description.includes(search),
      );
    }
    return tasks;
  }

  getTaskById(id: string) {
    const task = this.tasks.find((task) => task.id === id);
    if (!task) {
      throw new NotFoundException(`Task not found with id '${id}' `);
    }
    return task;
  }

  createTask(createTaskDto: createTaskDto) {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: v4(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  deleteTask(id: string) {
    const taskToDelete = this.getTaskById(id);
    this.tasks = this.tasks.filter((task) => task.id !== taskToDelete.id);
  }

  updateTaskStatus(id: string, status: TaskStatus) {
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }
}