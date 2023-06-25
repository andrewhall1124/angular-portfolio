import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAnalytics,getAnalytics,ScreenTrackingService,UserTrackingService } from '@angular/fire/analytics';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { RouterModule } from '@angular/router';
import { routes } from './routes';
import { NgChartsModule } from 'ng2-charts';

//Material
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTableModule} from '@angular/material/table';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {ReactiveFormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';

//Components
import { StockDialogComponent } from './dialogs/stock-dialog/stock-dialog.component';
import { EditWeightDialogComponent } from './dialogs/edit-weight-dialog/edit-weight-dialog.component';
import { RemoveStockDialogComponent } from './dialogs/remove-stock-dialog/remove-stock-dialog.component';
import { StockChartComponent } from './components/stock-chart/stock-chart.component';
import { PortfoliosComponent } from './pages/portfolios/portfolios.component';
import { HomeComponent } from './pages/home/home.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    StockDialogComponent,
    StockChartComponent,
    EditWeightDialogComponent,
    RemoveStockDialogComponent,
    PortfoliosComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()),
    RouterModule.forRoot(routes),
    MatToolbarModule,
    MatTableModule,
    MatCardModule,
    NgChartsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatMenuModule,
    FormsModule,
    MatSidenavModule,
    MatListModule,
  ],
  providers: [
    ScreenTrackingService,UserTrackingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
