// imports express.js that helps build web servers/apis.
import express from 'express';
// imports Cross Origin Resource Sharing middleware. Allows API to accept requests from different domains.
import cors from 'cors';
// imports dotenv, allows .env files to become process.env
import dotenv from 'dotenv';
// import our service functions
import { fetchGitHubUser, fetchUserRepos } from './services/githubService';

// executes dotenv config. Reads your .env file and makes the variables avaiable throughn process.env.variable name
dotenv.config();

// creates express application. Foundation of your web server to conifgure routes and middleware
const app = express();
// sets the port number for server to listen on in env.PORT. If no port use 5000
const PORT = process.env.PORT || 5000;

// Middleware 

// Enable CORS for all routes
app.use(cors());
// Parse JSON request bodies
app.use(express.json());

//Basic route to test server is working
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!' })
});

// New route: Get user profile by username
app.get('/api/users/:username', async (req, res) => {
  try {
    // const username = req.params.username
    const { username } = req.params;
    console.log(`Fetching GitHub user: ${username}`);
    // Fetch userdata from Github API using our service
    const userData = await fetchGitHubUser(username);
    console.log(`Successfully fetched user: ${userData.login}`);
    
    // Send successful response with user data
    res.json(userData);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error details:', {
        username: req.params.username,
        error: error.message,
        stack: error.stack
      });

      if (error.message.includes('404')) {
        res.status(404).json({
          error: 'User not found on GitHub'
        });
      } else {
        res.status(500).json({
          error: 'Failed to fetch user data from GitHub',
          details: error.message
        });
      }
    } else {
      console.error('Unknown error type:', error);
      res.status(500).json({
        error: 'An unkown error occured'
      });
    }
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
