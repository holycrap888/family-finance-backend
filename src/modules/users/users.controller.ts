import { UserId } from "@/common/decorators/user-id.decorator";
import { UpdateSettingsDto } from "@/common/dto";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import { IUser } from "@/interfaces";
import { Controller, UseGuards, Get, NotFoundException, Param, Put, Body } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiBody, ApiResponse } from "@nestjs/swagger";
import { UsersService } from "./users.service";


@ApiTags('users')
@Controller('users')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({
    status: 200,
    description: 'Current user retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '60d0fe4f5311236168a109ca' },
        name: { type: 'string', example: 'John Doe' },
        email: { type: 'string', example: 'john@example.com' },
        passwordHash: { type: 'string', example: 'hashedpassword' },
        salary: { type: 'number', example: 50000 },
        settings: {
          type: 'object',
          properties: {
            budgetRatio: {
              type: 'object',
              properties: {
                needs: { type: 'number', example: 50 },
                savings: { type: 'number', example: 20 },
                wants: { type: 'number', example: 20 },
                investments: { type: 'number', example: 5 },
                emergency: { type: 'number', example: 5 },
              }
            }
          }
        },
        createdAt: { type: 'string', format: 'date-time', example: '2024-06-01T12:00:00Z' },
        updatedAt: { type: 'string', format: 'date-time', example: '2024-06-10T12:00:00Z' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async getCurrentUser(@UserId() userId: string): Promise<IUser> {;
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({
    status: 200,
    description: 'Current user retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        _id: { type: 'string', example: '60d0fe4f5311236168a109ca' },
        name: { type: 'string', example: 'John Doe' },
        email: { type: 'string', example: 'john@example.com' },
        passwordHash: { type: 'string', example: 'hashedpassword' },
        salary: { type: 'number', example: 50000 },
        settings: {
          type: 'object',
          properties: {
            budgetRatio: {
              type: 'object',
              properties: {
                needs: { type: 'number', example: 50 },
                savings: { type: 'number', example: 20 },
                wants: { type: 'number', example: 20 },
                investments: { type: 'number', example: 5 },
                emergency: { type: 'number', example: 5 },
              }
            }
          }
        },
        createdAt: { type: 'string', format: 'date-time', example: '2024-06-01T12:00:00Z' },
        updatedAt: { type: 'string', format: 'date-time', example: '2024-06-10T12:00:00Z' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async getUser(@Param('id') id: string): Promise<IUser> {
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Put('settings')
  @ApiOperation({ summary: 'Update user settings' })
  @ApiResponse({ status: 200, description: 'Settings updated successfully', schema: { type: 'object', example: { message: 'Settings updated successfully' } } })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: UpdateSettingsDto, description: 'User settings data' })
  async updateSettings(
    @UserId() userId: string,
    @Body() body: UpdateSettingsDto,
  ): Promise<{ message: string }> {
    await this.usersService.updateSettings(userId, body.settings);
    return { message: 'Settings updated successfully' };
  }
}
