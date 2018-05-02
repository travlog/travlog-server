const message = {
  2000: 'SUCCESS',
  4000: 'BAD_REQUEST_ERROR',
  4001: 'NOT_AUTHORIZED_ERROR',
  4009: 'DUPLICATED_ERROR',
  5000: 'ERROR.DEFAULT'
}

module.exports = {
  RESULT: function (code, data) {
    if (this.CODE.SUCCESS === code) {
      return {
        code: message[code],
        codeno: this.CODE.SUCCESS,
        success: true,
        data: data,
        err: null
      }
    }
    return {
      code: message[code],
      codeno: code,
      success: false,
      data: null,
      err: data
    }
  },
  CODE: {
    SUCCESS: 2000,
    NOT_FOUND: 4000,
    ERROR: {
      DEFAULT: 5000,
      NOT_AUTHORIZED: 4001,
      DUPLICATED: 4009
    }
  }
}