// Application
// ----------------------------------------------------------------------------
import dotenv from 'dotenv';
import { Logger } from 'tslog';
import server from './server';
dotenv.config();

const log = new Logger();

const PORT = process.env.PORT || 4040;

server.listen(PORT, () => {
  setTimeout(() => {
    log.info(`API is running at http://localhost:${PORT}/api/`);
  }, 100);
});
