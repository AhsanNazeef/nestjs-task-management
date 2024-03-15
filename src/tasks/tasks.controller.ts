import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './tasks.model';
import { createTaskDto } from './dto/create-task.dto';
import { getTasksFilterDto } from './dto/get-tasks-filter.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getTasks(@Query() getTasksFilterDto: getTasksFilterDto): Task[] {
    if (Object.keys(getTasksFilterDto).length) {
      return this.tasksService.getTasksWithFilters(getTasksFilterDto);
    }
    return this.tasksService.getAllTasks();
  }

  @Get(`:id`)
  getTaskById(@Param(`id`) id: string): Task {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  createTask(@Body() createTaskDto: createTaskDto): Task {
    return this.tasksService.createTask(createTaskDto);
  }

  @Delete(`:id`)
  deleteTask(@Param(`id`) id: string): void {
    this.tasksService.deleteTask(id);
  }

  @Patch(`:id/status`)
  updateTaskStatus(
    @Param(`id`) id: string,
    @Body(`status`) status: TaskStatus,
  ): Task {
    return this.tasksService.updateTaskStatus(id, status);
  }
}
