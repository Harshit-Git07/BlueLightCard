import { Controller, Get } from 'routing-controllers'
import * as pjson from '../../../package.json'
import { GetVersionResponseDto } from './dto/version.request.dto'

const {
  COMMITHASH,
  BRANCH,
  ENV
} = process.env

@Controller('/version')
export class VersionController {
  @Get('/')
  version (): GetVersionResponseDto {
    return {
      // Added at build time
      version: pjson.version,
      commit: COMMITHASH ?? '',
      branch: BRANCH ?? '',
      env: ENV ?? 'production'
    }
  }
}
