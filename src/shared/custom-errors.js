export class SessionExpiredError extends Error {

  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = SessionExpiredError.getName();
  }

  static getName() {
    return 'SessionExpiredError';
  }
}

export class VoudError extends Error {

  constructor(message, statusCode, additionalData) {
    super(message);
    this.statusCode = statusCode;
    this.additionalData = additionalData;
    this.name = VoudError.getName();
  }

  static getName() {
    return 'VoudError';
  }
}

export class UnsupportedVersionError extends Error {
  
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = UnsupportedVersionError.getName();
  }

  static getName() {
    return 'UnsupportedVersionError';
  }
}

export class ServiceUnavailableError extends Error {
  
  constructor(title, message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = ServiceUnavailableError.getName();
    this.messageTitle = title;
  }

  static getName() {
    return 'ServiceUnavailableError';
  }
}

export class FetchError extends Error {

  constructor(message) {
    super(message);
    this.name = FetchError.getName();
  }

  static getName() {
    return 'FetchError';
  }
}