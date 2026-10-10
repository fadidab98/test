'use strict';
const crypto = require('node:crypto');
// Node/OpenSSL legacy algorithm incompatibility (ERR_OSSL_EVP_UNSUPPORTED).
crypto.createHash('md4').update('devops-ml-lab').digest('hex');
console.log('Legacy OpenSSL check passed');
