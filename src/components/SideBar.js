import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import HomeIcon from '@mui/icons-material/Home';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import LocalCarWashIcon from '@mui/icons-material/LocalCarWash';
import PercentIcon from '@mui/icons-material/Percent';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import ContactPageIcon from '@mui/icons-material/ContactPage';

import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

export const SideBar = (props) => {
    const theme = useTheme();
    const [open, setOpen] = React.useState(true);
    const { t } = useTranslation();
    const navigate = useNavigate();

    const options = ['Home', 'Products', 'Services', 'Articles', 'Contacts'];

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const sideBarOnClickUrl = (text) => {
        let urlString = "/home";

        if (text === "Products") urlString = "/products";
        else if (text === "Services") urlString = "/services";
        else if (text === "Articles") urlString = "/blogs";
        else if (text === "Contacts") urlString = "/contacts";

        return urlString;
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{ mr: 2, ...(open && { display: 'none' }) }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <DrawerHeader>
    
                    <IconButton onClick={() => {
                        handleDrawerClose();
                        if (props.close) props.close(false)
                    }}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    {options.map((text, index) => (
                        <ListItem button key={text} onClick={() => {
                            navigate(sideBarOnClickUrl(text), {replace: true});
                            /* 3 of the items use the same component and when we navigate 
                              to their URL it doesn't trigger a rerender even though all props are different.
                              That's why for now a manual refresh of the page was added.
                            */
                            navigate(0);
                        }}>
                            <ListItemIcon>
                                {text === "Home" ? <HomeIcon /> :
                                    text === "Products" ? <ProductionQuantityLimitsIcon /> :
                                        text === "Services" ? <LocalCarWashIcon /> :
                                                text === "Articles" ? <NewspaperIcon /> :
                                                    <ContactPageIcon />
                                }
                            </ListItemIcon>
                            <ListItemText primary={t(text)} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </Box>
    );
}
