/*
mkdir generic-server
cd generic-server
npm init
npm i body-parser
npm i express
npm i cors
# edit package.json and add ', "start": "node app.js"' to scripts section
# move app.js and index.html into the generic-server folder
npm start
# download and install POSTMAN from https://www.postman.com/downloads/

# Endpoints:
http://localhost:3000/processform           (GET/POST)
http://localhost:3000/single                (GET)
http://localhost:3000/array                 (GET)
http://localhost:3000/echo                  (GET/POST)

*/
const express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
const app = express();
app.use(cors({ origin:true, credemtials: true}));
app.use(express.json());
var urlencodedParser = bodyParser.urlencoded({ extended: false })
//===========================================================================================================
// Description: Generic GET/POST handler - processes any HTML GET/POST form action 
//   http://localhost:3000/processform              (GET/POST)
// Exemplary Uses:
//   http://localhost:3000/processform?fname=Tony&lname=Stark
// Outputs: Generates an HTML page having an HTML table containing the name-value pairs submitted via a form GET/POST
//===========================================================================================================
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

let header = '<html><head><title>Generic GET/POST Server</title><style>' +
'table { border-collapse: collapse; font-family: Tahoma, Geneva, sans-serif; }' +
'table th { text-align: left; padding: 15px; }' +
'table td { padding: 15px; }' +
'table thead td { background-color: #54585d; color: #ffffff; font-weight: bold; font-size: 13px; border: 1px solid #54585d; }' +
'table tbody td { color: #636363; border: 1px solid #dddfe1; }' +
'table tbody tr { background-color: #f9fafb; }' +
'table tbody tr:nth-child(odd) { background-color: #ffffff; } ' +  
'</style></head><body><table><tr><th>Key</th><th>Value</th></tr>';
let footer = '</body></html>';

app.get('/processform', (req, res) => {
  console.log('Got GET:', req.query);
  let obj = req.query;
  let responseText = header;
  for (let key in obj) {
    let value = obj[key];
    responseText += `<tr><td>${key}</td><td>${value}</td></tr>`  
  }
  responseText += `</table><h4><a href="${req.headers.referer}">Go Back</a></h4>`;
  responseText += footer;   
  console.log(responseText);
  console.log(req.headers.referer);
  res.send(responseText);

  /* res.sendStatus(200); */
});    

app.post('/processform', urlencodedParser, (req, res) => {
  console.log('Got POST:', req.body);
  let obj = req.body;
  let responseText = header;
  for (let key in obj) {
    let value = obj[key];
    responseText += `<tr><td>${key}</td><td>${value}</td></tr>`  
  }
  responseText += `</table><h4><a href="${req.headers.referer}">Go Back</a></h4>`;
  responseText += footer;  
  console.log(responseText);
  console.log(req.headers.referer);
  res.send(responseText);

  /*res.sendStatus(200);*/
});
//===========================================================================================================
// Description: Returns a JSON object that contains a single JSON objects or an array of JSON objects
// Exemplary Uses:
//   http://localhost:3000/single
//   http://localhost:3000/array
// Outputs: /single generates a JSON { data : { employee } } where employee represents a JSON with the format:
//   {empId: 1, name: 'Tony Stark', salary: 50000}
// Outputs: /array generates a JSON { data : [ {employee1, employee2, ...] } where the value is a JSON array
//   of employee JSONs with the format {empId: 1, name: 'Tony Stark', salary: 50000}
//===========================================================================================================
const employees = [
  {empId: 1, name: 'Tony Stark', salary: 50000},
  {empId: 2, name: 'Bruce Banner', salary: 20000},
  {empId: 3, name: 'Diana Prince', salary: 26000},
  {empId: 4, name: 'Karen Kent', salary: 21000},  
  {empId: 5, name: 'Bruce Stark', salary: 31000},
  {empId: 6, name: 'Bruce Banner', salary: 30000},
  {empId: 7, name: 'Debra Prince', salary: 26000},
  {empId: 8, name: 'Clark Kent', salary: 27000},
  {empId: 9, name: 'Bruce Prince', salary: 21000},
  {empId: 10, name: 'Bruce Kent', salary: 40000},
  {empId: 11, name: 'Debra Smith', salary: 27000},
  {empId: 12, name: 'Clark Kent', salary: 25000},  
  {empId: 13, name: 'Chales Kent', salary: 20000},
  {empId: 14, name: 'Katherine Smith', salary: 47000},
  {empId: 15, name: 'Simon Kent', salary: 45000}
];


var empId;  

// http://api.giphy.com/v1/gifs/random?api_key=${API_KEY};
// http://api.giphy.com/v1/gifs/translate?api_key=${API_KEY}&s=${search};
// http://api.giphy.com/v1/gifs/search?q=${search}&api_key=${API_KEY}&limit=${PAGE_SIZE}&offset=${offset}
// http://localhost:3000/array?q=${search}&api_key=${API_KEY}&limit=${PAGE_SIZE}&offset=${offset}
// http://localhost:3000/single?q=${search}&api_key=${API_KEY}
app.get('/single', (req, res) => {
  console.log('single Got GET:', req.query);
  const q = req.query.q;
  const api_key = req.query.api_key;
  
  const responseText = "q is " + q + "\n" + 
                        "api_key is " + api_key + "\n";
 
  console.log(responseText);
  let jsonObj = {
    data : employees[0]
  }
  
  console.log( JSON.stringify(jsonObj))
  res.send(jsonObj);
});  

app.get('/array', (req, res) => {
  console.log('array Got GET:', req.query);
  const q = req.query.q;
  const api_key = req.query.api_key;
  const limit = getNumber(req.query.limit);
  const offset = getNumber(req.query.offset); 
  
  const responseText = "q is " + q + "\n" + 
                        "api_key is " + api_key + "\n" +
                        "limit is " + limit + "\n" +
                        "9ffset is " + offset;
 
  console.log(responseText);
  let jsonObj = {
    data : [],
    pagination: {
      total_count: employees.length,
      offset: offset
    }
  }
  if ((offset > employees.length) || ((offset + limit) > employees.length)) {
    limit = 5;
    offset = 0;
  }
  for(let i=0; i<limit; i++)
      jsonObj.data[i] = employees[ offset+i]
  console.log( JSON.stringify(jsonObj))
  res.send(jsonObj);
});  

function getNumber( nbrS) {
    let nbr = 0;
    if (nbrS != "" && isNaN(nbrS) == false)
        nbr =  parseInt(nbrS,10); 
    console.log( 'nbr = ' + nbr + ', typeof ' + typeof nbr);
    return nbr;
}
//===========================================================================================================
// Generic JSON echo
// http://localhost:3000/echo
//===========================================================================================================
//===========================================================================================================
// Description: Returns a JSON object that is an echo of the JSON object passed as a GET/POST
//   http://localhost:3000/echo
// Exemplary Uses:
//   http://localhost:3000/echo?json="{'name':'Tony','lname':'Stark'}"
// Outputs: A JSON object that is an echo of the JSON object passed as a GET/POST
//===========================================================================================================
app.get('/echo', (req, res) => {
  console.log('single Got GET:', req.query);
  const jsonObj = req.query.json;
  console.log( JSON.stringify(jsonObj))
  res.send(jsonObj);
});  
app.post('/echo', (req, res) => {
  console.log('Got POST:', req.body);
  let jsonObj = req.body;
  console.log( JSON.stringify(jsonObj))
  res.send(jsonObj);
}); 
//===========================================================================================================
// MAIN
//===========================================================================================================


let port = 3000;  
app.listen(port, () => {
  console.log("Server Listening on PORT:", port);
});