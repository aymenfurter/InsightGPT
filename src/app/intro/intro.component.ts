import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OpenaiService } from '../openai.service';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.css'],
})
export class IntroComponent {
  constructor(private router: Router, private openAi: OpenaiService) { }

  ngOnInit(): void {
  }
  onDrop(event: Event) {
    event.preventDefault();
    const files = (event.target as HTMLInputElement).files;
    console.log(files);
    // process the files here
  }

  onDragOver(event: Event) {
    event.preventDefault();
  }

  onFileSelected(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    console.log(files);
    this.router.navigate(['/browse']);
    var response = this.openAi.getDataFromOpenAI("Hi? Anyone listening?");
    
    console.log(response);

    // process the files here
  }
}
