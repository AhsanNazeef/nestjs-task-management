import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { createTaskDto } from './dto/create-task.dto';
import { getTasksFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task, TaskStatus } from './task.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  private logger = new Logger('TasksService');
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async getTasks(
    tasksFilterDto: getTasksFilterDto,
    user: User,
  ): Promise<Task[]> {
    const { status, search } = tasksFilterDto;
    const query = this.taskRepository.createQueryBuilder('tasks');
    query.where('tasks.userId = :userId', { userId: user.id });
    if (status) {
      query.andWhere('tasks.status = :status', { status });
    }
    if (search) {
      query.andWhere(
        '(LOWER(tasks.title) LIKE LOWER(:search) OR LOWER(tasks.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }
    return await query.getMany();
  }

  async getTaskById(id: number, user: User) {
    const task = await this.taskRepository.findOne({
      where: { id, userId: user.id },
    });
    if (!task) {
      this.logger.error(`Task not found with id '${id}' `);
      throw new NotFoundException(`Task not found with id '${id}' `);
    }
    return task;
  }

  async createTask(createTaskDto: createTaskDto, user: User) {
    const { title, description } = createTaskDto;
    const task = new Task();
    task.title = title;
    task.description = description;
    task.user = user;
    await this.taskRepository.save(task);
    delete task.user;
    return task;
  }

  async deleteTask(id: number, user: User) {
    await this.getTaskById(id, user);
    await this.taskRepository.delete(id);
  }

  async updateTaskStatus(id: number, status: TaskStatus, user: User) {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await this.taskRepository.save(task);
    return task;
  }
}
