import { BrazeEventsService } from '@blc-mono/members/application/events/BrazeEventsService';
import { DwhEventsService } from '@blc-mono/members/application/events/DwhEventsService';
import { EmailEventsService } from '@blc-mono/members/application/events/EmailEventsService';
import { LegacyEventsService } from '@blc-mono/members/application/events/LegacyEventsService';
import { SystemEventsService } from '@blc-mono/members/application/events/SystemEventsService';

let _brazeEventsService: BrazeEventsService;
let _dwhEventsService: DwhEventsService;
let _emailEventsService: EmailEventsService;
let _legacyEventsService: LegacyEventsService;
let _systemEventsService: SystemEventsService;

export function brazeEventsService(): BrazeEventsService {
  if (!_brazeEventsService) {
    _brazeEventsService = new BrazeEventsService();
  }

  return _brazeEventsService;
}

export function dwhEventsService(): DwhEventsService {
  if (!_dwhEventsService) {
    _dwhEventsService = new DwhEventsService();
  }

  return _dwhEventsService;
}

export function emailEventsService(): EmailEventsService {
  if (!_emailEventsService) {
    _emailEventsService = new EmailEventsService();
  }

  return _emailEventsService;
}

export function legacyEventsService(): LegacyEventsService {
  if (!_legacyEventsService) {
    _legacyEventsService = new LegacyEventsService();
  }

  return _legacyEventsService;
}

export function systemEventsService(): SystemEventsService {
  if (!_systemEventsService) {
    _systemEventsService = new SystemEventsService();
  }

  return _systemEventsService;
}
