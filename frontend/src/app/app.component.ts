import { Component, OnInit } from '@angular/core';
import { DataService } from './shared/services/data/data.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  files: any = [];
  myForm: FormGroup;
  isLoading = false;

  constructor(
    private dataService: DataService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.createForm();
  }


  createForm() {
    this.myForm = this.formBuilder.group({
      folder_path: ['', Validators.required],
      search_text: ['', Validators.required],
      replacement_text: ['', Validators.required],
    });
  }

  public resetForm() {
    this.myForm.reset();
    this.files.length = 0;
  }


  public searchAndReplaceData(valid) {
    if (!valid) {
      return;
    }

    this.isLoading = true;

    this.dataService.getDataFromDB(this.myForm.value)
      .subscribe((response: any) => {
        this.files = response.arr;
        this.isLoading = false;
      }, (error) => {
        this.isLoading = false;
        console.error('error', error);
        alert('Something Went wrong');
      });
  }
}
