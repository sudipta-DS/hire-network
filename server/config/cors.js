let whitelist = [
  "hire-network-client.vercel.app",
  "hire-network-client-q5lzrhz6d-sudipta-samantas-projects.vercel.app",
];
let corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  if (whitelist.indexOf(req.header("Origin")) !== -1) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};

export default corsOptionsDelegate;
