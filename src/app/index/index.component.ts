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

  images = []
  texts = []
  numbers = []
  sound: string;
  videoS: string;
  status: any;

  uploadEndpoint: string = 'https://upload-236609.appspot.com/upload'
  shotsEndpoint: string = 'https://get-shots.appspot.com/shots/'
  descEndpoint: string = 'https://cloud-proj-images.azurewebsites.net/api/images/descg'
  ttsEndpoint: string = 'https://cloud-proj-images.azurewebsites.net/api/images/tts'
  bucketUrl: string = 'https://storage.googleapis.com/galeata_magica_123/'
  dbEndpoint: string = 'https://cloud-proj-images.azurewebsites.net/api/db'

  ngOnInit() {
    this.status = document.getElementById("status")
    this.status.innerHTML = "Waiting for user input"
  }

  setStatus(text: string) {
    this.status.innerHTML = text
  }

  fileToUpload: File = null;
  hidden: boolean = true;

  postFile(fileToUpload: File): Observable<Object> {
    const endpoint = this.uploadEndpoint;
    const formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, fileToUpload.name);
    return this.httpClient
      .post(endpoint, formData)
  }

  toggleImages() {
    this.hidden = !this.hidden;
  }

  handleFileInput(files: FileList) {
    let id: string
    this.fileToUpload = files.item(0);
    this.setStatus("Uploading file")
    console.log(this.fileToUpload)
    this.postFile(this.fileToUpload).subscribe(
      data => {
        console.log("upload done")
        id = data["id"]
        this.videoS = this.bucketUrl + id + ".mp4"
        let video: any = document.getElementById('video')
        video.load()
        console.log(id)
        let endpoint = this.shotsEndpoint + id
        this.setStatus("Breaking video into shots")
        this.httpClient.get(endpoint).subscribe(
          data => {
            console.log("shots done")
            console.log(data)
            let count = data["Counter"]
            this.images = []
            for (var i = 0; i < count; i++) {
              this.images.push(id + '/' + i + ".jpg");
            }
            console.log(this.images)
            this.setStatus("Analyzing images")
            this.httpClient.post(this.descEndpoint, { "Filename": id, "Count": count }).subscribe(
              data => {
                console.log("desc done")
                console.log(data)
                this.texts = []
                this.numbers = []
                for (var i = 0; i < count; i++) {
                  this.texts.push(data[i]);
                  this.numbers.push(i)
                }
                this.setStatus("\"Reading\" the text")
                this.httpClient.post(this.ttsEndpoint, { "Text": this.texts, }).subscribe(
                  data => {
                    console.log("tts done")
                    console.log(data)

                    this.sound = this.bucketUrl + data

                    let audio: any = document.getElementById('audio')
                    audio.load()

                    this.setStatus("Done, please enjoy or upload a new file")

                    this.httpClient.post(this.dbEndpoint, { "VideoUrl": this.videoS, "AudioUrl": this.sound }).subscribe(
                      data => { 
                        console.log("db done")
                        console.log(data)
                      },
                      error => {
                        console.log("error at post db")
                        console.log(JSON.stringify(error))
                      }
                    )
                  }, error => {
                    console.log("error at post tts")
                    console.log(JSON.stringify(error))
                  })
              },
              error => {
                console.log("error at post desc")
                console.log(JSON.stringify(error))
              }
            )
          },
          error => {
            console.log("error at get shots")
            console.log(JSON.stringify(error))
          }
        )
      },
      error => {
        console.log("error at upload")
        console.log(JSON.stringify(error))
      })
  }

}
