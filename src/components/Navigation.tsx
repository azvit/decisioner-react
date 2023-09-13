import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import { Link } from "react-router-dom";
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import { Help, Home, Login, Logout, Person, PersonAddAlt1 } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hook/redux';
import React from 'react';
import { logout } from '../store/actions/AuthActions';
import { useTranslation } from 'react-i18next';
import AuthVerify from '../common/auth-verify';

export function Navigation()  {
    
    const { isLoggedIn } = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const logoutHandler = (event: React.MouseEvent) => {
        //event.preventDefault();
        dispatch(logout());
    }

    return(
        <div className='h-full bg-dark-blue text-white'>
          <Toolbar />
          <Divider className='bg-white'/>
          {isLoggedIn && 
            <List>
                <ListItem component={Link} to='/'  disablePadding className='hover:bg-blue-800'>
                    <ListItemButton>
                        <ListItemIcon>
                            <Home style={{ color: 'white' }}/>
                        </ListItemIcon>
                        <ListItemText>
                            {t('navigation_main_page')}
                        </ListItemText>
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding className='hover:bg-blue-800'>
                    <ListItemButton>
                        <ListItemIcon>
                            <Person style={{ color: 'white' }}/>
                        </ListItemIcon>
                        <ListItemText>
                            {t('navigation_account')}
                        </ListItemText>
                    </ListItemButton>
                </ListItem>
                <ListItem component={Link} to='/blanks-list' disablePadding className='hover:bg-blue-800'>
                    <ListItemButton>
                        <ListItemIcon>
                            <Help style={{ color: 'white' }}/>
                        </ListItemIcon>
                        <ListItemText>
                            {t('navigation_expertises')}
                        </ListItemText>
                    </ListItemButton>
                </ListItem>
                <ListItem component={Link} to='/group-expertise-list' disablePadding className='hover:bg-blue-800'>
                    <ListItemButton>
                        <ListItemIcon>
                            <Help style={{ color: 'white' }}/>
                        </ListItemIcon>
                        <ListItemText>
                            {t('navigation_group_expertises')}
                        </ListItemText>
                    </ListItemButton>
                </ListItem>
                <Divider className='bg-white'/>
                <ListItem disablePadding className='hover:bg-blue-800' onClick={logoutHandler}>
                    <ListItemButton>
                        <ListItemIcon>
                            <Logout style={{ color: 'white' }}/>
                        </ListItemIcon>
                        <ListItemText>
                            {t('navigation_signout')}
                        </ListItemText>
                    </ListItemButton>
                </ListItem>
            </List>
          }
          {!isLoggedIn &&
            <List>
            <ListItem disablePadding className='hover:bg-blue-800'>
                    <ListItemButton>
                        <ListItemIcon>
                            <Login style={{ color: 'white' }}/>
                        </ListItemIcon>
                        <ListItemText>
                            {t('navigation_signin')}
                        </ListItemText>
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding className='hover:bg-blue-800'>
                    <ListItemButton>
                        <ListItemIcon>
                            <PersonAddAlt1 style={{ color: 'white' }}/>
                        </ListItemIcon>
                        <ListItemText>
                            {t('navigation_signup')}
                        </ListItemText>
                    </ListItemButton>
                </ListItem>
            </List>
          }
          <AuthVerify logOut={logoutHandler}/>
        </div>
      );
}