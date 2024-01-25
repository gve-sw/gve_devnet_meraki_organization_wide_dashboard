import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Breadcrumbs, Link } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useLocation, Link as RouterLink } from 'react-router-dom';

const Header = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter(x => x);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="static" sx={{
            background: '#f4f4f4', // from --cui-header-background
            borderBottom: '1px solid #ddd', // from --cui-header-border-bottom
            zIndex: 1000, // from --cui-header-zindex
            height: 60 // Adjusted height
        }}>
            <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <IconButton
                    edge="start"
                    aria-label="menu"
                    onClick={handleMenu}
                    sx={{ 
                        fontSize: '20px', // Adjust the size of the icon
                        marginLeft: '10px', // Adjust the spacing as needed
                        color: 'black' // Darken the icon color
                    }}
                >
                    <MenuIcon />
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    open={open}
                    onClose={handleClose}
                >
                    <MenuItem onClick={handleClose} component={RouterLink} to="/">Home</MenuItem>
                    <MenuItem onClick={handleClose} component={RouterLink} to="/app">App</MenuItem>
                    {/* Add more menu items here */}
                </Menu>
                <Typography variant="h6" sx={{
                    flexGrow: 1,
                    textAlign: 'center',
                    fontSize: '20px', // from --cui-header-title-font-size
                    fontWeight: 200, // from --cui-header-title-font-weight
                    color: '#333' // Title color
                }}>
                    Merak Org Wide Logs
                </Typography>
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="inherit" component={RouterLink} to="/">
                        Home
                    </Link>
                    {pathnames.map((value, index) => {
                        const last = index === pathnames.length - 1;
                        const to = `/${pathnames.slice(0, index + 1).join('/')}`;

                        return last ? (
                            <Typography color="textPrimary" key={to}>
                                {value}
                            </Typography>
                        ) : (
                            <Link color="inherit" component={RouterLink} to={to} key={to}>
                                {value}
                            </Link>
                        );
                    })}
                </Breadcrumbs>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
