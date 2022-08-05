// Application
// ----------------------------------------------------------------------------
import server from './server';
const PORT = process.env.PORT || 4040;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});