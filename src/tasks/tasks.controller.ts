import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
//import type { TaskStatus } from './task-status-enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  getTasks(
    @Query() filterDto: GetTaskFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    return this.taskService.getTasks(filterDto, user);
  }

  //   @Get()
  //   getTasks(@Query() filterDto: GetTaskFilterDto): Task[] {
  //     if (Object.keys(filterDto).length) {
  //       return this.taskService.getTasksWithFilters(filterDto);
  //     } else {
  //       return this.taskService.getAllTasks();
  //     }
  //   }
  @Get('/:id')
  getTaskBy(@Param('id') id: string, @GetUser() user: User,): Promise<Task> {
    return this.taskService.getTaskById(id, user);
  }

  //   @Get('/:id')
  //   getTaskBy(@Param('id') id: string): Task {
  //     return this.taskService.getTaskById(id);
  //   }

  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.taskService.createTask(createTaskDto, user);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string, @GetUser() user: User): Promise<void> {
    return this.taskService.deleteTask(id, user);
  }

  //   @Delete('/:id')
  //   deleteTask(@Param('id') id: string): void {
  //     return this.taskService.deleteTask(id);
  //   }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUser() user: User,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;
    return this.taskService.updateTaskStatus(id, status, user);
  }

  //   @Patch('/:id/status')
  //   updateTaskStatus(
  //     @Param('id') id: string,
  //     @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  //   ): Task {
  //     const { status } = updateTaskStatusDto;
  //     return this.taskService.updateTaskStatus(id, status);
  //   }
}
