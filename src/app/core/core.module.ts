import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { environment } from '../../environments/environment';

import { throwIfAlreadyLoaded } from './module-import-guard';

const logLevel = environment.production ? NgxLoggerLevel.ERROR : NgxLoggerLevel.DEBUG;
@NgModule({
    imports: [
        CommonModule,
        LoggerModule.forRoot({level: logLevel}),
    ]
})

export class CoreModule {
    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        throwIfAlreadyLoaded(parentModule, 'Core Module');
      }

      static forRoot(): ModuleWithProviders<CoreModule> {
        return {
          ngModule: CoreModule
        };
      }
}
