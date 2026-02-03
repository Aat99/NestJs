import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status-enum';
//import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  //   getAllTasks(): Task[] {
  //     return this.tasks;
  //   }

  async getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;

    const query = this.taskRepository.createQueryBuilder('task');
    query.where('task.userId = :userId', { userId: user.id });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    return await query.getMany();
  }

  //   getTasksWithFilters(filterDto: GetTaskFilterDto): Task[] {
  //     const { status, search } = filterDto;
  //     //define a temperory array to hold the result
  //     let tasks = this.getAllTasks();
  //     //do something with status
  //     if (status) {
  //       tasks = tasks.filter((task) => task.status === status);
  //     }
  //     //do something with search
  //     if (search) {
  //       tasks = tasks.filter((task) => {
  //         if (task.title.includes(search) || task.description.includes(search)) {
  //           return true;
  //         }
  //         return false;
  //       });
  //     }

  //     //return final result
  //     return tasks;
  //   }

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({ id, user });

    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return found;
  }

  //   getTaskById(id: string): Task {
  //     const found = this.tasks.find((task) => task.id === id);

  //     if (!found) {
  //       throw new NotFoundException(`Task with ID "${id}" not found`);
  //     }

  //     return found;
  //   }
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.taskRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user, // attach user here
    });

    await this.taskRepository.save(task);

    return task;
  }

  //   createTask(createTaskDto: CreateTaskDto): Task {
  //     const { title, description } = createTaskDto;
  //     const task: Task = {
  //       // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  //       id: uuid(),
  //       title,
  //       description,
  //       status: TaskStatus.OPEN,
  //     };
  //     this.tasks.push(task);
  //     return task;
  //   }

  async deleteTask(id: string, user: User): Promise<void> {
    const result = this.taskRepository.delete({ id, user });
    if ((await result).affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  //   deleteTask(id: string): void {
  //     const found = this.getTaskById(id);
  //     this.tasks = this.tasks.filter((task) => task.id !== found.id);
  //   }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await this.taskRepository.save(task);
    return task;
  }

  //   updateTaskStatus(id: string, status: TaskStatus) {
  //     const task = this.getTaskById(id);
  //     task.status = status;
  //     return task;
  //   }
}
