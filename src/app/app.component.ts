import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Validators } from 'ngx-editor';
import { MaxLengthValidator } from './text-editor/validators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  public title = 'ngx-editor-prod-issue';
  public form: FormGroup;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      editor: new FormControl('', [Validators.required(), MaxLengthValidator(5000)])
    });
  }
}
