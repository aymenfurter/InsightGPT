import { Injectable } from '@angular/core';
import { config, filter, from, map } from 'rxjs';
import { AzureOpenAIApi } from './openai.api';
import { ConfigService } from './services/config.service';

@Injectable({
  providedIn: 'root'
})
export class OpenaiService {
  private openai: AzureOpenAIApi;

  constructor(private configService: ConfigService) { 
    this.openai = new AzureOpenAIApi(this.configService);
  }


  async getDataFromOpenAPIAsync(text: string) {
    const completion = await this.openai.createCompletion({
      model: this.configService.getModelName(),
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
    let extraEntities = "";
    if (this.configService.getCustomEntitiesList().length > 0) {
      extraEntities = "Exclusively include: " + this.configService.getCustomEntitiesList() + ", ";
    }
 
    let amountOfEntities = "10";
    if (this.configService.getAmountOfEntities() != null) {
      amountOfEntities = this.configService.getAmountOfEntities();
    }
    
    
    let prompt = "Perform the following activities: \n1. extendedCategories: Provide "+amountOfEntities+" Entity Recognition (NER) entity categories that would be suitable for named entity recognization performed on this text ("+extraEntities+"Don't include Quantity, DateTime, IP, URL, Email, PhoneNumber, Address, Skill, Product, Event, Organization, Location, PersonType, Person) \n2. date: extract most relevant date and format: YYYY-MM-DD \n3. standardCategories: Provide a list of standard NERs (Exclusively consisting of DateTime, IP, URL, Email, PhoneNumber, Address, Skill, Product, Event, Organization, Location, PersonType, Person) \n4. evaluations: Evaluate the following questions (yes/no) (\"Was this a positive user expierence?\", \"Did this help to solve the problem?\") \n\nThe format should be the following: {\"date\": \"YYYY-MM-DD\", \"standardCategories\": [{\"category1\": [\"value1\", \"value2\"]}, {\"category2\": [\"value1\", \"value2\"]}], \"extendedCategories\": [{\"category1\": [\"value1\", \"value2\"]}, {\"category2\": [\"value1\", \"value2\"]}], \"evaluations\": [{\"question\": \"Hello?\", \"answer\": \"Hi!\"}]} \nThis is the text: \n"; 
    prompt += text;

    return this.openai.createCompletion({
      model: this.configService.getModelName(),
      prompt: prompt,
      max_tokens: 2048
    })
    .then(resp => {
      if (!resp) {
        return {evaluations: [], extendedCategories: [], standardCategories: [], date: ""};
      }

      if (!resp.choices || resp.choices.length === 0 || !resp.choices[0].text) {
        return {evaluations: [], extendedCategories: [], standardCategories: [], date: ""};
      }

      const text = resp.choices[0].text;
      const startIndex = text.indexOf('{');
      const endIndex = text.lastIndexOf('}') + 1;
      if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
        return {evaluations: [], extendedCategories: [], standardCategories: [], date: ""};
      }
     
      // if error occours, provide empty object with fields "evaluations, extendedCategories, standardCategories, date"
      try {
        const jsonObject = JSON.parse(text.substring(startIndex, endIndex));
        return jsonObject;
      } catch (error) {
        return {evaluations: [], extendedCategories: [], standardCategories: [], date: ""};
      }

    });
  }
}
