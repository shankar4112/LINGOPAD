import express from 'express';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to LingoPad API');
});

app.get('/get-started', (req, res) => {
  res.json({
    status: 'success',
    message: 'Welcome to LingoPad! Get started with our onboarding process.',
    data: {
      steps: [
        {
          step: 1,
          title: 'Choose Your Language',
          description: 'Select the language you want to learn.',
          action: 'Select Language'
        },
        {
          step: 2,
          title: 'Set Your Goals',
          description: 'Define your learning goals and time commitment.',
          action: 'Set Goals'
        },
        {
          step: 3,
          title: 'Start Learning',
          description: 'Begin your language learning journey with personalized content.',
          action: 'Start Learning'
        }
      ]
    }
  });
});

// POST route for form submission
app.post('/get-started', (req, res) => {
  try {
    const { name, email, targetLanguage, currentLevel, learningGoals } = req.body;

    // Validate required fields
    if (!name || !email || !targetLanguage || !currentLevel || !learningGoals) {
      return res.status(400).json({
        status: 'error',
        message: 'All fields are required'
      });
    }

    // In a real app, you'd save this to a database
    console.log('New user registration:', {
      name,
      email,
      targetLanguage,
      currentLevel,
      learningGoals,
      registeredAt: new Date().toISOString()
    });

    // Send success response
    res.status(200).json({
      status: 'success',
      message: 'Registration successful! Welcome to LingoPad!',
      data: {
        userId: 'user_' + Date.now(),
        name,
        targetLanguage,
        currentLevel,
        nextStep: 'dashboard'
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Registration failed. Please try again.'
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});