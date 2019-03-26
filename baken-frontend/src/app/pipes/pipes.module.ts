import { NgModule } from '@angular/core';
import { FechaPipe } from './fecha.pipe';
import { FilterPipe } from './filter.pipe';

@NgModule({
  imports: [],
  declarations: [FechaPipe, FilterPipe],
  exports: [FechaPipe, FilterPipe]
})
export class PipesModule {}
