import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../Service/api.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-associations',
  templateUrl: './associations.component.html',
  styleUrls: ['./associations.component.scss']
})
export class AssociationsComponent implements OnInit {

  AssocitionData;
  imageResult: SafeResourceUrl;
  constructor(private apiService:ApiService,private _sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.getAssociations()
  }
  getAssociations(){
    this.apiService.get('Association').subscribe(data => {
      if (data.statusCode === '201' && data.result){
        this.AssocitionData = data.result
        // this.imageResult = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + data.result[0].imageResult);
        console.log(this.AssocitionData)
      }
    }, );
  }
}
