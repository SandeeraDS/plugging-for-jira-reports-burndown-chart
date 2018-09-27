import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts'
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';


import { LineChartComponent } from './ChartDrawing/line-chart/line-chart.component';
import { GraphComponent } from './graph/graph.component';
import { ApiServices } from './GraphFactory.model';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    GraphComponent,
    LineChartComponent,
  
  ],
  imports: [
    BrowserModule,
    ChartsModule,
  ],
  providers: [ApiServices],
  bootstrap: [AppComponent]
})
export class AppModule { }
