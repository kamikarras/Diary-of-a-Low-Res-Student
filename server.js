
const app = require('./lib/app');

const PORT = process.env.PORT || 5173;

app.listen(PORT, () => {
  console.log(`Started on ${PORT}`);
});