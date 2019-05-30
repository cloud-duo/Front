import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  numbers = []
  sounds = []
  videos = []

  dbEndpoint: string = 'https://cloud-proj-images.azurewebsites.net/api/db'

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    this.httpClient.get(this.dbEndpoint).subscribe(
      data => {
        let dataArray = (data as Array<any>)
        for(let i=0; i<dataArray.length; ++i){
          this.numbers.push(i)
          this.sounds.push(dataArray[i]["AudioUrl"])
          this.videos.push(dataArray[i]["VideoUrl"])
        }
      },
      error => {
        console.log("error at get from db")
        console.log(JSON.stringify(error))
      }
    )
  }

}
