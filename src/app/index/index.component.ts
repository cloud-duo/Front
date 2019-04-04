import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
  }

  fileToUpload: File = null;

  postFile(fileToUpload: File): Observable<Object> {
    const endpoint = 'https://upload-236609.appspot.com/upload';
    const formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, fileToUpload.name);
    return this.httpClient
      .post(endpoint, formData)
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    console.log(this.fileToUpload)
    this.postFile(this.fileToUpload).subscribe(
      data => {
        console.log("data")
        console.log(JSON.stringify(data))
      },
      error => {
        console.log("error")
      console.log(JSON.stringify(error))
    })
  }

}
