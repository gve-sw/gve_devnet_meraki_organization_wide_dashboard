import { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper, LinearProgress, Alert } from '@mui/material';
import axios from 'axios';

// Mapping of languages to their colors and icons
const languageColors = {
  JavaScript: { color: '#f1e05a', icon: 'path/to/js-icon.png' },
  CSS: { color: '#563d7c', icon: 'path/to/css-icon.png' },
  HTML: { color: '#e34c26', icon: 'path/to/html-icon.png' },
  // Add more mappings as needed
};

// Hardcoded templates
const defaultLanguagesUsed = [{ name: 'Loading...', percent: 100, color: '#ddd', icon: '' }];
const defaultPackagesNeeded = ['Loading...'];
const defaultFileStructure = 'Loading...';
const defaultReadmeContent = 'Loading...';

const HomePage = () => {
  const [languagesUsed, setLanguagesUsed] = useState(defaultLanguagesUsed);
  const [packagesNeeded, setPackagesNeeded] = useState(defaultPackagesNeeded);
  const [fileStructure, setFileStructure] = useState(defaultFileStructure);
  const [readmeContent, setReadmeContent] = useState(defaultReadmeContent);
  const [error, setError] = useState('');

  const repoUrl = 'https://api.github.com/repos/username/repo-name'; // Replace with your repo URL

  useEffect(() => {
    axios.get(`${repoUrl}/languages`).then(response => {
      const languageData = response.data;
      const total = Object.values(languageData).reduce((acc, value) => acc + value, 0);
      const languages = Object.keys(languageData).map(key => ({
        name: key,
        percent: (languageData[key] / total) * 100,
        color: languageColors[key]?.color || '#000000',
        icon: languageColors[key]?.icon || ''
      }));
      setLanguagesUsed(languages);
    }).catch(err => {
      console.error('Error fetching languages:', err);
      setError(prev => prev + '\nFailed to fetch languages used');
      setLanguagesUsed([]); // Clear the default loading template
    });

    axios.get(`${repoUrl}/contents`).then(response => {
      const files = response.data;
      const structure = files.map(file => `├── ${file.path}`).join('\n');
      setFileStructure(structure);

      const readmeFile = files.find(file => file.name.toLowerCase() === 'readme.md');
      if (readmeFile) {
        axios.get(readmeFile.download_url).then(readmeResponse => {
          setReadmeContent(readmeResponse.data);
        }).catch(err => {
          console.error('Error fetching README:', err);
          setError(prev => prev + '\nFailed to fetch README');
          setReadmeContent(''); // Clear the default loading template
        });
      }
    }).catch(err => {
      console.error('Error fetching file structure:', err);
      setError(prev => prev + '\nFailed to fetch file structure');
      setFileStructure(''); // Clear the default loading template
    });

    axios.get(`${repoUrl}/contents/package.json`).then(response => {
      axios.get(response.data.download_url).then(packageResponse => {
        const packageJson = JSON.parse(packageResponse.data);
        setPackagesNeeded(Object.keys(packageJson.dependencies || {}));
      }).catch(err => {
        console.error('Error fetching packages needed:', err);
        setError(prev => prev + '\nFailed to fetch packages needed');
        setPackagesNeeded([]); // Clear the default loading template
      });
    }).catch(err => {
      console.error('Error fetching project details:', err);
      setError(prev => prev + '\nFailed to fetch project details');
      setPackagesNeeded([]); // Clear the default loading template
    });
  }, []);

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" gutterBottom>
          Merak Org Wide Logs
        </Typography>

        {error && <Alert severity="error" style={{ whiteSpace: 'pre-line' }}>{error}</Alert>}

        {/* Languages Used Card */}
        <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
          <Typography variant="h6" gutterBottom>
            Languages Used
          </Typography>
          {languagesUsed.length > 0 ? languagesUsed.map((language, index) => (
            <Box key={index} display="flex" alignItems="center" mb={1}>
              {language.icon && <img src={language.icon} alt={language.name} style={{ width: '20px', marginRight: '10px' }} />}
              <Typography variant="subtitle1" style={{ flexGrow: 0, marginRight: '10px' }}>{language.name}</Typography>
              <LinearProgress variant="determinate" value={language.percent} style={{ flexGrow: 1, backgroundColor: '#ddd', height: '10px' }} />
            </Box>
          )) : <Typography>No languages data available.</Typography>}
        </Paper>

        {/* Packages Needed Card */}
        <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
          <Typography variant="h6" gutterBottom>
            Packages Needed
          </Typography>
          {packagesNeeded.length > 0 ? (
            <ul>
              {packagesNeeded.map((packageItem, index) => (
                <li key={index}>{packageItem}</li>
              ))}
            </ul>
          ) : <Typography>No packages data available.</Typography>}
        </Paper>

        {/* File Structure Card */}
        <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
          <Typography variant="h6" gutterBottom>
            File Structure
          </Typography>
          {fileStructure ? <pre>{fileStructure}</pre> : <Typography>No file structure data available.</Typography>}
        </Paper>

        {/* README Card */}
        <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
          <Typography variant="h6" gutterBottom>
            README
          </Typography>
          {readmeContent ? <pre>{readmeContent}</pre> : <Typography>No README data available.</Typography>}
        </Paper>
      </Box>
    </Container>
  );
};

export default HomePage;
