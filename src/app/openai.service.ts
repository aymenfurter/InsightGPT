import { Injectable } from '@angular/core';
import { Configuration, OpenAIApi } from 'openai';
import { filter, from, map } from 'rxjs';
import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OpenaiService {
  // add private variable for configuration

  constructor() { }
   
  readonly configuration = new Configuration({
    apiKey: environment.openAIToken,
    basePath: environment.endpoint,
  });
  
  readonly openai = new OpenAIApi(this.configuration);

  async getDataFromOpenAPIAsync(text: string) {
    const completion = await this.openai.createCompletion({
      model: "text-davinci-003",
      prompt: text,
    });
    console.log(completion.data.choices[0].text);
  }

  getDataFromOpenAI(text: string) {
    from(this.openai.createCompletion({
      model: "text-davinci-003",
      prompt: text,
      max_tokens: 256
    })).pipe(
      filter(resp => !!resp && !!resp.data),
      map(resp => resp.data),
      filter((data: any) => data.choices && data.choices.length > 0 && data.choices[0].text),
      map(data => data.choices[0].text)
    ).subscribe(data => {
        console.log(data);
    });
  }
}
