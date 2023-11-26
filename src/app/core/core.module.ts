import { NgModule } from '@angular/core';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { SpinnerComponent } from './components/spinner/spinner.component';

const COMPONENTS: any[] = [HeaderComponent, FooterComponent, SpinnerComponent];

@NgModule({
  imports: [COMPONENTS],
  exports: COMPONENTS,
})
export class CoreModule {}
