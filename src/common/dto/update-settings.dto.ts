import { ApiProperty } from '@nestjs/swagger';

export class UpdateSettingsDto {
  @ApiProperty({
    description: 'User settings object',
    example: {
      budgetRatio: {
        needs: 50,
        savings: 20,
        wants: 10,
        investments: 10,
        emergency: 10
      }
    }
  })
  settings!: {
    budgetRatio: {
      needs: number;
      savings: number;
      wants: number;
      investments: number;
      emergency: number;
    };
  };
}
