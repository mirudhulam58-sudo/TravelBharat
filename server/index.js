require('dotenv').config();
const express = require('express'), cors = require('cors'), helmet = require('helmet'), mongoose = require('mongoose');
const app = express();
app.use(helmet(), cors(), express.json());
app.use('/api', require('./routes'));
mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(process.env.PORT || 5000, () => console.log('TravelBharat API running')))
  .catch(e => { console.error(e); process.exit(1); });
