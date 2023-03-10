class ServiceError extends Error {
    constructor ({ message, service } = {}) {
        super()

        this.name = 'ServiceError'
        this.message = message
        this.service = service
    }
}


export default function fetchViaCepService (cepWithLeftPad) {
  const url = `https://viacep.com.br/ws/${cepWithLeftPad}/json/`
  const options = {
    method: 'GET',
    mode: 'cors',
    headers: {
      'content-type': 'application/json;charset=utf-8'
    }
  }

  return fetch(url, options)
    .then(analyzeAndParseResponse)
    .then(checkForViaCepError)
    .then(extractCepValuesFromResponse)
    .catch(throwApplicationError)
}

function analyzeAndParseResponse (response) {
  if (response.ok) {
    return response.json()
  }

  throw Error('Erro ao se conectar com o serviço ViaCEP.')
}

function checkForViaCepError (responseObject) {
  if (responseObject.erro === true) {
    throw new Error('CEP não encontrado na base do ViaCEP.')
  }

  return responseObject
}

function extractCepValuesFromResponse (responseObject) {
  return {
    cep: responseObject.cep.replace('-', ''),
    state: responseObject.uf,
    city: responseObject.localidade,
    neighborhood: responseObject.bairro,
    street: responseObject.logradouro
  }
}

function throwApplicationError (error) {
  const serviceError = new ServiceError({
    message: error.message,
    service: 'viacep'
  })

  if (error.name === 'FetchError') {
    serviceError.message = 'Erro ao se conectar com o serviço ViaCEP.'
  }

  throw serviceError
}
