#!/usr/bin/env node
const http = require('http');
const https = require('https');

// Avoid non-Node.js modules
// Roll our own barebone command line argument processor
const args = process.argv.slice(2);
const options = {
  protocol: 'https',
};
while (args.length > 0) {
  const option = args.shift();

  switch (option.toLowerCase()) {
    case '--endpoint':
      if (args.length < 1) throw new Error('--endpoint: mandatory argument missing');
      options.endpoint = args.shift();
      break;

    case '--listen':
      if (args.length < 1) throw new Error('--listen: mandatory argument missing');
      options.listen = parseInt(args.shift());
      break;

    case '--protocol':
      if (args.length < 1) throw new Error('--protocol: mandatory argument missing');
      options.protocol = args.shift();
      break;

    default:
      throw new Error(`Unknown option '${option}'`);
  }
}
if (!options.endpoint) throw new Error('Mandatory option --endpoint missing');
if (!options.listen)   throw new Error('Mandatory option --listen missing');

console.log('Proxy Options', options);
const {endpoint, listen, protocol} = options;

// proxy protocol module
const protocolModule = protocol === 'http' ? http : https;

// HTTP server
const server = http.createServer((origReq, origRes) => {
  const {headers, url} = origReq;

  // disable CORS on response
  origRes.setHeader('Access-Control-Allow-Origin', '*');

  // error handling
  const abort = error => {
    console.error(error);
    origRes.statusCode = 500;
    origRes.end();
  };

  // forward request
  const proxyURL = `${protocol}://${endpoint}${url}`;
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
