import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from './app.component';
import { EnvironmentListComponent } from './environment-list/environment-list.component';
import { EnvironmentDetailComponent } from './environment-detail/environment-detail.component';
import { HealthCheckListComponent } from './health-check-list/health-check-list.component';
import { HealthCheckDetailComponent } from './health-check-detail/health-check-detail.component';

import { EnvironmentsService } from './environments.service';
import { HealthChecksService } from './health-checks.service';
import { HealthStatusPipe } from './health-status.pipe';
import { StartCasePipe } from './start-case.pipe';

@NgModule({
  declarations: [
    AppComponent,
    EnvironmentListComponent,
    EnvironmentDetailComponent,
    HealthCheckListComponent,
    HealthCheckDetailComponent,
    HealthStatusPipe,
    StartCasePipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    FlexLayoutModule
  ],
  providers: [EnvironmentsService, HealthChecksService, HealthStatusPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
