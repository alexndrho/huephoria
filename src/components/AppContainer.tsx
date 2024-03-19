import {
  Affix,
  AppShell,
  Avatar,
  Button,
  Flex,
  Group,
  Menu,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { Link, useLocation } from 'react-router-dom';
import { auth } from '../config/firebase';
import { TbLogout, TbSettings } from 'react-icons/tb';
import NavLinkIcon from './NavLinkIcon';
import classes from '../styles/AppContainer.module.css';
import { PiHouse, PiHouseFill } from 'react-icons/pi';

interface AppContainerProps {
  children?: React.ReactNode;
}

function AppContainer({ children }: AppContainerProps) {
  const location = useLocation();
  const [opened] = useDisclosure();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unSubscribe();
  }, []);

  const dataLinks = [
    {
      icon: PiHouse,
      iconActive: PiHouseFill,
      label: 'Home',
      to: '/',
    },
  ];

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: '75',
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
      transitionDuration={0}
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group h="100%">
            <Text c="green" fw="bold" size="xl">
              Huephoria
            </Text>
          </Group>

          {user ? (
            <Group h="100%">
              <Menu>
                <Menu.Target>
                  <UnstyledButton>
                    <Avatar src={user.photoURL} alt="avatar icon" />
                  </UnstyledButton>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Item
                    component={Link}
                    to="/settings"
                    leftSection={<TbSettings />}
                  >
                    Settings
                  </Menu.Item>

                  <Menu.Item
                    color="red"
                    leftSection={<TbLogout />}
                    onClick={() => signOut(auth)}
                  >
                    Log out
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          ) : (
            <Group h="100%">
              <Button component={Link} to="login">
                Log in
              </Button>
            </Group>
          )}
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="sm">
        <Flex h="100%" direction="column" justify="center">
          {dataLinks.map((link, index) => (
            <NavLinkIcon
              key={index}
              icon={link.icon}
              activeIcon={link.iconActive}
              label={link.label}
              labelPosition={'right'}
              to={link.to}
              active={location.pathname === link.to}
            />
          ))}
        </Flex>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>

      <Affix
        display={{ sm: 'none' }}
        className={classes.navBottom}
        w="100%"
        p="sm"
      >
        <Group justify="space-around" grow>
          {dataLinks.map((link, index) => (
            <Flex justify="center" align="center">
              <NavLinkIcon
                key={index}
                icon={link.icon}
                activeIcon={link.iconActive}
                label={link.label}
                labelPosition={'top'}
                to={link.to}
                active={location.pathname === link.to}
                visibleLabel
              />
            </Flex>
          ))}
        </Group>
      </Affix>
    </AppShell>
  );
}

export default AppContainer;
export type { AppContainerProps };
