import { Controller, Get } from 'routing-controllers'

const {
    VERSION,
    COMMITHASH,
    BRANCH,
    MODE
} = process.env

@Controller('/')
export class VersionController {
  @Get('/')
  version() {
    return {
        // Added at build time
        version: VERSION,
        commit: COMMITHASH,
        branch: BRANCH,
        mode: MODE
    }
  }
}


