// Setup Json Server
// ------------------------------------------------------------
import { Application } from 'express';
import JsonServer from 'json-server';
import bodyParser from 'body-parser';
import { JsonDatabase } from './jsonDatabase';
import path from 'path';

const jsonDatabase = new JsonDatabase();
const server: Application = JsonServer.create();

const file = path.join(__dirname, 'data', 'db.json');
jsonDatabase.createDatabaseFile(file).then(filepath => {
  const router = JsonServer.router(filepath);
  server.use(JsonServer.defaults());
  server.use(bodyParser.urlencoded({ extended: true }));
  
  // Middleware
  //
  
  server.use('/api', router);
}).catch((err: any) => {
  console.log(err);
});

export default server;
