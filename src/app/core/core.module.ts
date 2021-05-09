import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { environment } from '../../environments/environment';

import { throwIfAlreadyLoaded } from './module-import-guard';
import { HttpErrorInterceptor } from './services/http/httperrorinterceptor.service';
import { ToasterService } from './services/toaster.service';

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
          ngModule: CoreModule,
          providers: [
            {
              provide: HTTP_INTERCEPTORS,
              useClass: HttpErrorInterceptor,
              multi: true,
              deps: [ToasterService]
            }
          ],
        };
      }
}
