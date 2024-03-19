import { Injectable, NotFoundException } from '@nestjs/common';
import { createTaskDto } from './dto/create-task.dto';
import { getTasksFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task, TaskStatus } from './task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async getTasks(tasksFilterDto: getTasksFilterDto): Promise<Task[]> {
    const { status, search } = tasksFilterDto;
    const query = this.taskRepository.createQueryBuilder('tasks');
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

  async getTaskById(id: number) {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task not found with id '${id}' `);
    }
    return task;
  }

  async createTask(createTaskDto: createTaskDto) {
    const { title, description } = createTaskDto;
    const task = new Task();
    task.title = title;
    task.description = description;
    return await this.taskRepository.save(task);
  }

  async deleteTask(id: number) {
    await this.getTaskById(id);
    await this.taskRepository.delete(id);
  }

  async updateTaskStatus(id: number, status: TaskStatus) {
    await this.getTaskById(id);
    await this.taskRepository.update(id, { status });
    return await this.getTaskById(id);
  }
}
