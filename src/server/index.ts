// Setup Json Server
// ------------------------------------------------------------
import { Application } from 'express';
import JsonServer from 'json-server';
import bodyParser from 'body-parser';
import path from 'path';
import * as util from './utility';
import JsonDatabase from './jsonDatabase';

const jsonDatabase = new JsonDatabase();
const server: Application = JsonServer.create();

const file = path.join(__dirname, 'data', 'db.json');
jsonDatabase.createDatabaseFile(file).then((filepath) => {
  const router = JsonServer.router(filepath);
  server.use(JsonServer.defaults());
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: true }));

  // Middleware
  //
  server.post('/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!jsonDatabase.isAuthenticated({ email, password })) {
      res.status(401).json({ status: 401, message: 'Unauthorized' });
      return;
    }
    const accessToken = jsonDatabase.createToken({ email, password });
    res.status(200).json({ accessToken });
  });

  server.use(/^(?!\/auth).*$/, (req, res, next) => {
    if (req.headers.authorization == null || req.headers.authorization.split(' ')[0] !== 'Bearer') {
      res.status(401).json({ status: 401, message: 'Bad authorization header' });
      return;
    }
    try {
      jsonDatabase.verifyToken(req.headers.authorization.split(' ')[1]);
      next();
    } catch (err: any) {
      res.status(401).json({ status: 401, message: 'Error: access_token not valid.' });
    }
  });

  server.use('/api', router);
}).catch((err: any) => {
  util.log.error(err);
});

export default server;
