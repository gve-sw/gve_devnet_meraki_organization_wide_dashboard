import { useState, useEffect } from 'react';
import { Box, Container, Typography, Link as MuiLink } from '@mui/material';
import PropTypes from 'prop-types';
import logoImage from '../../assets/logo_long_blue.png'; // Adjust the path as needed

const Footer = () => {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [location, setLocation] = useState('Fetching location...');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
        const data = await response.json();
        setLocation(data.display_name);
      }, () => {
        setLocation(null);
      });
    } else {
      setLocation(null);
    }
  }, []);

  const timeAndLocation = location ? `${currentTime} - ${location}` : currentTime;

  return (
    <Box component="footer" style={{
      display: 'grid',
      gridTemplateRows: 'auto auto',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      gap: '10px',
      backgroundColor: 'background.paper',
      padding: '24px', // Adjust padding as needed
      boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)', // Add shadow
    }}>
      <div style={{ borderTop: '1px solid #ccc', margin: '-24px -24px 24px -24px', boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)' }}></div> {/* Line at the top with shadow */}
      <Container maxWidth="lg">
        <div className="footer__logo" style={{
          gridRow: 1,
          marginBottom: '0px',
          textAlign: 'center',
        }}>
          <a href="https://gve-devnet.cisco.com/">
            <img src={logoImage} alt="Cisco GVE DevNet" style={{
              width: '50%', // Adjust the image size as needed
              maxWidth: '100%',
            }} />
          </a>
        </div>

        <Typography variant="h6" gutterBottom>
          Cisco GVE DevNet
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" component="p">
          Explore the world of Cisco's Global Virtual Engineering (GVE) DevNet!
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {'Copyright © '}
          <MuiLink color="inherit" href="https://gve-devnet.cisco.com/">
            Cisco GVE DevNet
          </MuiLink>{' '}
          {new Date().getFullYear()}
          {'.'}
        </Typography>

        <Box className="footer__links" style={{
          gridRow: 2,
          // Additional link styles can be added here
        }}>
          <div id="time_location_note">
            {timeAndLocation}
          </div>
          {/* Additional links can be added here */}
        </Box>
      </Container>
    </Box>
  );
};

Footer.propTypes = {
  timeAndLocation: PropTypes.string
};

export default Footer;
