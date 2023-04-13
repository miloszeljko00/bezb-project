import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeViewComponent } from './tree-view.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../material/material.module';



@NgModule({
  declarations: [TreeViewComponent],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
  ],
  exports: [TreeViewComponent]
})
export class TreeViewModule { }
