import { GitHubUser, GitHubRepo } from "../types/github";

const GITHUB_API_BASE = 'https://api.github.com';

// Function to fetch data from GitHub API
export async function fetchGitHubUser(username: string): Promise<GitHubUser> {
  // Build the complete URL for user endpoint
  const response = await fetch(`${GITHUB_API_BASE}/users/${username}`);

  // Check if response is successful (status 200-299)
  if (!response.ok) {
    // If not successful throw an error with status code
    throw new Error(`Github API error: ${response.status}`)
  }

  // Parse response body as JSON and automatically cast to GitHub user type
  // const userData = await response.json(); JAVASCRIPT
  const userData: GitHubUser = await response.json();

  // Return the typed user data
  return userData;
}

// Function to fetch user's repositories
export async function fetchUserRepos(username: string): Promise<GitHubRepo[]> {
  const response = await fetch(
    `${GITHUB_API_BASE}/users/${username}/repos?sort=updated&per_page=100`
  );

  // Check if response is successful
  if(!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }
  
  // Parse resopnse as an array of GithubRepo objects
  const resposData: GitHubRepo[] = await response.json();

  return resposData;
}

