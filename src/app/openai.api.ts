import { ConfigService } from './services/config.service';

export interface Configuration {
	basePath: string;
	apiKey: string;
}

interface GPT3Params {
	model: string;
	prompt: string;
	temperature?: number;
	max_tokens?: number;
	presence_penalty?: number;
	stop?: string[];
}

export class AzureOpenAIApi {
	configService: ConfigService;

	constructor(confService: ConfigService) {
		this.configService = confService;
	}

	async createCompletion(data: GPT3Params) {
		var endpointUrl = this.configService.getEndpointUrl();
		var modelName = this.configService.getModelName();
		var openAIToken = this.configService.getOpenAIToken();

		const url = endpointUrl + '/openai/deployments/' + modelName + '/completions?api-version=2022-12-01';

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'api-key': openAIToken,
			},
			body: JSON.stringify(data),
		});

		return await response.json();
	}
}
