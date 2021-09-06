#!/usr/bin/env node
const http = require('http');
const https = require('https');

// Avoid non-Node.js modules
// Roll our own barebone command line argument processor
const args = process.argv.slice(2);
const options = {
};
while (args.length > 0) {
  const option = args.shift();

  switch (option.toLowerCase()) {
    case '--listen':
      if (args.length < 1) throw new Error('--listen: mandatory argument missing');
      options.listen = parseInt(args.shift());
      break;

    default:
      throw new Error(`Unknown option '${option}'`);
  }
}
if (!options.listen) throw new Error('Mandatory option --listen missing');

console.log('Proxy Options', options);
const {listen} = options;

// HTTP server
const server = http.createServer((origReq, origRes) => {
  const {headers, method, url} = origReq;

  // disable CORS on response
  origRes.setHeader('Access-Control-Allow-Origin', '*');

  // handle pre-flight requests
  if (method === 'OPTIONS') {
    origRes.setHeader('Access-Control-Allow-Headers', 'x-forward-to');
    origRes.setHeader('Access-Control-Allow-Methods', 'GET');
    return origRes.end();
  }

  // error handling
  const abort = error => {
    console.error(error);
    origRes.statusCode = 500;
    origRes.end();
  };
  const processFailure = message => {
    console.error(message);
    origRes.statusCode = 422;
    origRes.write(message);
    origRes.end();
  };

  // get forward URL
  const proxyURL = headers['x-forward-to'];
  if (!proxyURL)
    return processFailure('mandatory X-Forward-To header missing');
  let forwardURLObject;
  try {
    forwardURLObject = new URL(proxyURL);
  } catch (error) {
    console.error(error);
    return processFailure('parsing of forward URL failed.');
  }

  // forward request
  const protocolModule = forwardURLObject.protocol === 'http' ? http : https;
  const proxyReq = protocolModule.get(
    proxyURL,
    {
      headers: // copy headers from original request
        [
          'cache-control',
          'user-agent',
        ].reduce((a, key) => {
          const value = headers[key];
          if (value) a[key] = headers[key];
          return a;
        }, {}),
    },
    proxyRes => {
      const {headers, statusCode} = proxyRes;

      console.log('PROXY', proxyURL, statusCode);

      // process proxy response
      try {
        // copy header from proxy response
        origRes.statusCode = statusCode;
        [
          'date',
          'content-length',
          'content-type',
          'expires',
          'location',
          'pragma',
          'server',
        ].forEach(key => {
          const value = headers[key];
          // console.log(key, value);
          if (value) origRes.setHeader(key, value);
        });
        // console.log(headers)

        // copy data from proxy response
        proxyRes.on('data', data => origRes.write(data));
        proxyRes.on('end', () => origRes.end())

      } catch (error) {
        abort(error);
      }
    }
  );

  proxyReq.on('error', abort);
});

// start server
server.listen(listen);
