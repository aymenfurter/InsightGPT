import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfigService } from '../services/config.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

import { MatFormField } from '@angular/material/form-field';
import { MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatError } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatCheckbox } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';



@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {
  configForm: FormGroup = new FormGroup({});
  standardEntitiesEnabled: boolean = false;
  customEntitiesList: string = '';
  openAIToken: string = '';
  endpointUrl: string = '';
  modelName: string = '';
  amountOfEntities: string = '10';




  constructor(
    private configService: ConfigService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.configForm = this.formBuilder.group({
      standardEntitiesEnabled: [this.configService.getStandardEntitiesEnabled(), Validators.required],
      customEntitiesList: [this.configService.getCustomEntitiesList(), [Validators.pattern(/^[\w,\s().\u00C0-\u024F]+$/)]],
      openAIToken: [this.configService.getOpenAIToken(), [Validators.required, Validators.minLength(32), Validators.maxLength(32), Validators.pattern(/^[\w-]+$/)]],
      endpointUrl: [this.configService.getEndpointUrl(), [Validators.required, Validators.pattern(/^https?:\/\/[\w./-]+$/)]],
      modelName: [this.configService.getModelName(), Validators.required],
      amountOfEntities: [this.configService.getAmountOfEntities(), Validators.required]
    });
  }

  onCancel(): void {
  }

  // new Method to set all values to 0
  onSubmit() {



    if (this.configForm == null || this.configForm.invalid) {
        return;
    }

    this.standardEntitiesEnabled = this.configForm.get('standardEntitiesEnabled')?.value;
    this.customEntitiesList = this.configForm.get('customEntitiesList')?.value;
    this.openAIToken = this.configForm.get('openAIToken')?.value;
    this.endpointUrl = this.configForm.get('endpointUrl')?.value;
    this.modelName = this.configForm.get('modelName')?.value;
    this.amountOfEntities = this.configForm.get('amountOfEntities')?.value;

    this.configService.setStandardEntitiesEnabled(this.standardEntitiesEnabled);
    this.configService.setCustomEntitiesList(this.customEntitiesList);
    this.configService.setOpenAIToken(this.openAIToken);
    this.configService.setEndpointUrl(this.endpointUrl);
    this.configService.setModelName(this.modelName);
    this.configService.setAmountOfEntities(this.amountOfEntities);

  }
}
