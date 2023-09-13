import React, { useState } from 'react';
import { Routes, Route, Router } from 'react-router-dom';
import { Navigation } from './components/Navigation'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { MainPage } from './pages/MainPage';
import i18next, { changeLanguage } from 'i18next';
import { initReactI18next } from 'react-i18next';
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector';
import I18NextHttpBackend from 'i18next-http-backend';
import { useAppSelector } from './hook/redux';
import { AuthPage } from './pages/AuthPage';
import { BlanksPage } from './pages/BlanksPage';
import { LANG_KEY } from './constants';
import { BlankPage } from './pages/BlankPage';
import { CalculationPage } from './pages/CalculationPage';
import { GroupExpertisesPage } from './pages/GroupExpertisesPage';
import { GroupExpertisePage } from './pages/GroupExpertisePage';
import {InvitationsPage} from "./pages/Invitations";


const drawerWidth = 240;

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}

export function App(props: Props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const { isLoggedIn } = useAppSelector(state => state.auth);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const [lang, setLang] = useState(localStorage.getItem(LANG_KEY)??'');
  const languageHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault();

    changeLanguage(event.target.value);
    setLang(event.target.value);
  }

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: `darkblue`
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
                mr: 2,
                display: { sm: 'none' }
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Decisioner
          </Typography>
          <div className='ml-auto'>
            <select value={lang} onChange={languageHandler} className='text-black'>
            <option value='en'>
              Eng
            </option>
            <option value='ua'>
              Ua
            </option>
          </select>
          </div>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
          }}
        >
          <Navigation/>
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },

          }}
          open
        >
          <Navigation/>
        </Drawer>
      </Box>
      <Box
        className='justify-center'
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        {isLoggedIn &&
          <Routes>
            <Route path='/' element={<MainPage/>}/>
            <Route path='/blanks-list' element={<BlanksPage/>}/>
            <Route path='/blank' element={<BlankPage/>}/>
            <Route path='/calculation' element={<CalculationPage/>}/>
            <Route path='/group-expertise-list' element={<GroupExpertisesPage/>}/>
            <Route path='/group-expertise' element={<GroupExpertisePage/>}/>
            <Route path='/group-expertise/invitations' element={<InvitationsPage/>}/>
          </Routes>
        }
        {!isLoggedIn && <AuthPage/>}
      </Box>
    </Box>
  );
}

export default App;
