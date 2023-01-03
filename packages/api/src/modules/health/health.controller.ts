import { Controller, Get } from 'routing-controllers'

@Controller('/health')
export class HealthController {
  @Get('/')
  health (): string {
    return 'API Running!'
  }
}
