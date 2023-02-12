import { Injectable } from '@angular/core';
import { filter, from, map } from 'rxjs';
import { environment } from './../environments/environment';
import { AzureOpenAIApi, Configuration } from './openai.api';

@Injectable({
  providedIn: 'root'
})
export class OpenaiService {
  private configuration: Configuration;
  private openai: AzureOpenAIApi;

  constructor() { 
    this.configuration = {
      apiKey: environment.openAIToken as string,
      basePath: environment.endpoint as string
    };
    
    this.openai = new AzureOpenAIApi(this.configuration);
  }


  async getDataFromOpenAPIAsync(text: string) {
    const completion = await this.openai.createCompletion({
      model: "whitlock",
      prompt: text,
    });
    console.log(completion.data.choices[0].text);
  }

  getDataFromOpenAI(text: string) {
  
  /*
  Perform the following activities:
  1. extendedCategories: Provide 10 Entity Recognition (NER) entity categories that would be suitable for named entity recognization performed on this text (Don't include Quantity, DateTime, IP, URL, Email, PhoneNumber, Address, Skill, Product, Event, Organization, Location, PersonType, Person)
  2. date: extract most relevant date and format: YYYY-MM-DD 
  3. standardCategories: Provide a list of standard NERs (Exclusively consisting of DateTime, IP, URL, Email, PhoneNumber, Address, Skill, Product, Event, Organization, Location, PersonType, Person)
  4. evaluations: Evaluate the following questions (yes/no) ("Was this a positive user expierence?", "Did this help to solve the problem?")

  The format should be the following: {"date": "YYYY-MM-DD", "standardCategories": [{"category1": ["value1", "value2"]}, {"category2": ["value1", "value2"]}], "extendedCategories": [{"category1": ["value1", "value2"]}, {"category2": ["value1", "value2"]}], "evaluations": [{"question": "Hello?", "answer": "Hi!"}]}  
  This is the text:
  */
    let prompt = "Perform the following activities: \n1. extendedCategories: Provide 10 Entity Recognition (NER) entity categories that would be suitable for named entity recognization performed on this text (Don't include Quantity, DateTime, IP, URL, Email, PhoneNumber, Address, Skill, Product, Event, Organization, Location, PersonType, Person) \n2. date: extract most relevant date and format: YYYY-MM-DD \n3. standardCategories: Provide a list of standard NERs (Exclusively consisting of DateTime, IP, URL, Email, PhoneNumber, Address, Skill, Product, Event, Organization, Location, PersonType, Person) \n4. evaluations: Evaluate the following questions (yes/no) (\"Was this a positive user expierence?\", \"Did this help to solve the problem?\") \n\nThe format should be the following: {\"date\": \"YYYY-MM-DD\", \"standardCategories\": [{\"category1\": [\"value1\", \"value2\"]}, {\"category2\": [\"value1\", \"value2\"]}], \"extendedCategories\": [{\"category1\": [\"value1\", \"value2\"]}, {\"category2\": [\"value1\", \"value2\"]}], \"evaluations\": [{\"question\": \"Hello?\", \"answer\": \"Hi!\"}]} \nThis is the text: \n"; 
    prompt += text;

    return this.openai.createCompletion({
      model: "whitlock",
      prompt: prompt,
      max_tokens: 2048
    })
    .then(resp => {
      if (!resp) {
        return Promise.reject(new Error('No data received from OpenAI API'));
      }

      if (!resp.choices || resp.choices.length === 0 || !resp.choices[0].text) {
        return Promise.reject(new Error('No text received from OpenAI API'));
      }

      const text = resp.choices[0].text;
      const startIndex = text.indexOf('{');
      const endIndex = text.lastIndexOf('}') + 1;
      if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
        return Promise.reject(new Error('No JSON object found in the text'));
      }
      
      const jsonObject = JSON.parse(text.substring(startIndex, endIndex));

      return jsonObject;
    });
  }
}
