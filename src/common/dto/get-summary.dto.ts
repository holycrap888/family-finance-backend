import { ApiProperty } from '@nestjs/swagger';

export class GetSummaryDto {
  @ApiProperty({ description: 'User ID', example: '64c8b2f2e4b0a1a2b3c4d5e6' })
  userId!: string;

  @ApiProperty({ required: false, description: 'Month in YYYY-MM format', example: '2025-08' })
  month?: string;
}
