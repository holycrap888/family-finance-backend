import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ description: 'Full name of the user', example: 'John Doe' })
  name!: string;

  @ApiProperty({ description: 'Email address', example: 'john@example.com' })
  email!: string;

  @ApiProperty({ description: 'Password', example: 'strongPassword123' })
  password!: string;

  @ApiProperty({ description: 'Monthly salary', example: 5000 })
  salary!: number;
}
