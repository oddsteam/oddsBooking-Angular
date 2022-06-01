import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-spinner',
  templateUrl: './dialog-spinner.component.html',
  styleUrls: ['./dialog-spinner.component.css']
})


export class DialogSpinnerComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: {msg : string}) {
  }

  ngOnInit(): void {
  }
}
