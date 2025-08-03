import { Controller, Get, Param, Put, Body, NotFoundException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { IUser } from '../../interfaces/user.interface';
import { UpdateSettingsDto } from '../../common/dto';
import { UserId } from '../../common/decorators/user-id.decorator';

@ApiTags('users')
@Controller('users')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user' })
  async getCurrentUser(@UserId() userId: string): Promise<IUser> {;
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', required: true })
  async getUser(@Param('id') id: string): Promise<IUser> {
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Put('settings')
  @ApiOperation({ summary: 'Update user settings' })
  @ApiBody({ type: UpdateSettingsDto, description: 'User settings data' })
  async updateSettings(
    @UserId() userId: string,
    @Body() body: UpdateSettingsDto,
  ): Promise<{ message: string }> {
    await this.usersService.updateSettings(userId, body.settings);
    return { message: 'Settings updated successfully' };
  }
}
