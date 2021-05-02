import { CommonModule } from "@angular/common";
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from "@angular/core";

import { throwIfAlreadyLoaded } from "./module-import-guard";
import { HttpErrorInterceptor } from "./services/http/httperrorinterceptor.service";
import { ToasterService } from "./services/toaster.service";

@NgModule({
    imports: [
        CommonModule
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