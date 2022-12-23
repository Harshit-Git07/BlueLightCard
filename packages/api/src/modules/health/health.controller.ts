import { Controller, Get } from 'routing-controllers'

@Controller('/')
export class HealthController {
  @Get('/')
  health() {
    return 'API Running!'
  }
}