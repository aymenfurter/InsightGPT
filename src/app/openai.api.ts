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
	basePath: string;
	apiKey: string;

	constructor(config: Configuration) {
		this.basePath = config.basePath;
		this.apiKey = config.apiKey;
	}

	async createCompletion(data: GPT3Params) {
		const url = `${this.basePath}/openai/deployments/${data.model}/completions?api-version=2022-12-01`;

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'api-key': `${this.apiKey}`,
			},
			body: JSON.stringify(data),
		});

		return await response.json();
	}
}
