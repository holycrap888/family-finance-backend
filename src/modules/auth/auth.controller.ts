import { RegisterDto, LoginDto } from "@/common/dto";
import { Controller, Post, Body } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation, ApiBody, ApiResponse, ApiOkResponse } from "@nestjs/swagger";
import { AuthService } from "./auth.service";


@ApiTags('auth')
@ApiBearerAuth('JWT-auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto, description: 'User registration data' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiOkResponse({ description: 'User logged in successfully', schema: { type: 'object', example: { accessToken: 'jwt-token' } } })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBody({ type: LoginDto, description: 'User login data' })
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }
}
