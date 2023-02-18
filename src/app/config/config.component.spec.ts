import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigComponent } from './config.component';
import { ConfigService } from '../services/config.service';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

describe('ConfigComponent', () => {
  let component: ConfigComponent;
  let fixture: ComponentFixture<ConfigComponent>;
  let configService: ConfigService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigComponent ],
      imports: [
        MatDialogModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatInputModule,
        MatCheckboxModule,
        MatButtonModule
      ],
      providers: [
        ConfigService,
        {
          provide: MatDialogRef,
          useValue: {
            close: () => {}
          }
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    configService = TestBed.inject(ConfigService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the config form with saved values', () => {
    spyOn(configService, 'getStandardEntitiesEnabled').and.returnValue(true);
    spyOn(configService, 'getCustomEntitiesList').and.returnValue('entity1, entity2');
    spyOn(configService, 'getOpenAIToken').and.returnValue('mytoken');
    spyOn(configService, 'getEndpointUrl').and.returnValue('https://myendpoint.openai.azure.com');
    spyOn(configService, 'getModelName').and.returnValue('mymodelname');

    component.ngOnInit();

  });

  it('should update the config service with new values', () => {
    const spy = spyOn(configService, 'setStandardEntitiesEnabled').and.callThrough();

    component.onSubmit();

    expect(spy).toHaveBeenCalledWith(false);
  });
});

describe('ConfigService', () => {
  let service: ConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get and set standard entities enabled', () => {
    expect(service.getStandardEntitiesEnabled()).toBe(true);
    service.setStandardEntitiesEnabled(false);
    expect(service.getStandardEntitiesEnabled()).toBe(false);
  });

  it('should get and set custom entities list', () => {
    expect(service.getCustomEntitiesList()).toBe('');
    service.setCustomEntitiesList('entity1, entity2');
    expect(service.getCustomEntitiesList()).toBe('entity1, entity2');
  });

  it('should get and set openAI token', () => {
    expect(service.getOpenAIToken()).toBe('');
    service.setOpenAIToken('mytoken');
});

it('should get and set endpoint URL', () => {
expect(service.getEndpointUrl()).toBe('');
service.setEndpointUrl('https://myendpoint.openai.azure.com');
expect(service.getEndpointUrl()).toBe('https://myendpoint.openai.azure.com');
});

it('should get and set model name', () => {
expect(service.getModelName()).toBe('');
service.setModelName('mymodelname');
expect(service.getModelName()).toBe('mymodelname');
});
});