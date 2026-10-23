import express from 'express';
import scanRoutes from './routes/scanRoutes.js';
import pointsRoutes from './routes/pointsRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Photos travel as base64 text, which is bigger than Express's default limit of 100kb.
app.use(express.json({ limit: '5mb' }));

// The pages live in wasted/ and load the logos from ../design-system/, so we serve both folders.
app.use('/wasted', express.static('wasted'));
app.use('/design-system', express.static('design-system'));

app.use('/api', scanRoutes);
app.use('/api', pointsRoutes);

// / opens the landing (a product page for computers); its "Get the app" leads to Set up.
app.get('/', function (req, res) {
  res.redirect('/wasted/landing.html');
});

app.listen(PORT, function () {
  console.log(`Server running at http://localhost:${PORT}/wasted/`);
  if (!process.env.GEMINI_API_KEY) {
    console.log('No GEMINI_API_KEY: scans answer with demo samples.');
  }
});
