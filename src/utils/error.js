class ErrorHandler {
  constructor (config = {}) {
    this.config = config
  }

  handleError (error) {
    /**
     * Add error logic
     */
    throw error
  }
}

export default ErrorHandler
