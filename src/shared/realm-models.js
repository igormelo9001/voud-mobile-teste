
export const termsSchema = {
	name: 'terms',
	properties: {
		offset: { type: 'int' },
		value: { type: 'string' }
	}
};

export const structuredFormattingSchema = {
	name: 'structured_formatting',
	properties: {
		main_text: { type: 'string' },
		main_text_matched_substrings: { type: 'matched_substrings[]' },
		secondary_text: { type: 'string' }
	}
};

export const matchedSubstringsSchema = {
	name: 'matched_substrings',
	properties: {
		length: { type: 'int' },
		offset: { type: 'int' }
	}
};

export const predictionSchema = {
	name: 'Predictions',
	primaryKey: 'id',
	properties: {
		id: { type: 'string', indexed: true },
		description: { type: 'string', indexed: true },
		place_id: { type: 'string', },
		reference: { type: 'string' },
		matched_substrings: { type: 'matched_substrings[]' },
		structured_formatting: { type: 'structured_formatting' },
		terms: { type: 'terms[]' },
		types: 'string[]',
		timestamp: 'date',
		searchTerm: 'string'
	}
};

export const locationSchema = {
	name: 'location',
	properties: {
		lat: { type: 'float'},
		lng: { type: 'float'}
	}
}

export const viewportSchema = {
	name: 'viewport',
	properties: {
		northeast: { type: 'location' },
		southerst: { type: 'location' }
	}
}

export const geometrySchema = {
	name: 'geometry',
	properties: {
		location: { type: 'location' },
		viewport: { type: 'viewport' }
	}
}

export const plusCodeSchema = {
	name: 'pluscode',
	properties: {
		compound_code: { type: 'string' },
		global_code: 'string'
	}
}

export const textSearchSchema = {
	name: 'TextSearch',
	primaryKey: 'id',
	properties: {
		id: { type: 'string', optional: true},
		formatted_address: { type: 'string' },
		icon: { type: 'string', },
		name: { type: 'string' },
		geometry: { type: 'geometry' },
		place_id: { type: 'string',  indexed: true },
		reference: { type: 'string' },
		plus_code: { type: 'pluscode' },
		types: 'string[]',
		timestamp: 'date',
		query: 'string'
	}
};

export const itemsSchema = {
	name: 'Items',
	properties: {
		'Valor 89': { type: 'string', optional: true },
		'Valor 13': { type: 'string', optional: true },
		BOM: { type: 'string', optional: true },
		BOM_MSG: { type: 'string', optional: true },
		BU: { type: 'string', optional: true },
		BU_MSG: { type: 'string', optional: true },
		MERCHANT_KEY: { type: 'string', optional: true },
		'novo item': { type: 'string', optional: true },
		MERCHANT_ID: { type: 'string', optional: true },
		MAX_CREDIT_VALUE: { type: 'string', optional: true },
		MIN_CREDIT_VALUE: { type: 'string', optional: true },
		SMART_PURCHASE_HELP: { type: 'string', optional: true },
		SCHOOL_CARD_DETAILS_HELP: { type: 'string', optional: true },
		NEXT_RECHARGES_HELP: { type: 'string', optional: true },
		CARD_HELP: { type: 'string', optional: true },
		imageUrl: { type: 'string', optional: true },
		content: { type: 'string', optional: true },
		expiryDate: { type: 'string', optional: true },
		title: { type: 'string', optional: true },
		message: { type: 'string', optional: true },
		diners: { type: 'string', optional: true },
		amex: { type: 'string', optional: true },
		visa: { type: 'string', optional: true },
		elo: { type: 'string', optional: true },
		master: { type: 'string', optional: true },
		CIELO_PK: { type: 'string', optional: true },
		ADYEN_PK: { type: 'string', optional: true },
		REQUEST_CARD_PARAMETER_VALUE: { type: 'string', optional: true },
		VALUE_PAGAMENTO_SEGURO: { type: 'string', optional: true },
		VALUE_SEGURO_SORTEIO: { type: 'string', optional: true },
		VALUE_COBERTURA_SEGURO: { type: 'string', optional: true }
	}
};

export const contentListSchema = {
	name: 'ContentList',
	properties: {
		id: { type: 'int', optional: true },
		type: 'string?',
		name: 'string?',
		channel: 'string?',
		items: { type: 'Items', optional: true },
		timestamp: 'date'

	}
};
