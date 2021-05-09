import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor(private logger: NGXLogger) {}

  trace(message: any, ...additional: any[]): void {
    this.logger.trace(message, additional);
  }

  debug(message: any, ...additional: any[]): void {
    this.logger.debug(message, additional);
  }

  info(message: any, ...additional: any[]): void {
    this.logger.info(message, additional);
  }

  log(message: any, ...additional: any[]): void {
    this.logger.log(message, additional);
  }

  warn(message: any, ...additional: any[]): void {
    this.logger.warn(message, additional);
  }

  error(message: any, ...additional: any[]): void {
    this.logger.error(message, additional);
  }

  fatal(message: any, ...additional: any[]): void {
    this.logger.fatal(message, additional);
  }
}
