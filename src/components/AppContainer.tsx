import {
  AppShell,
  Avatar,
  Burger,
  Button,
  Group,
  Menu,
  NavLink,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { Link, useLocation } from 'react-router-dom';
import { auth } from '../config/firebase';
import { TbHome, TbLogout2, TbSettings } from 'react-icons/tb';

function AppContainer({ children }: { children?: React.ReactNode }) {
  const location = useLocation();
  const [opened, { toggle }] = useDisclosure();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unSubscribe();
  }, []);

  const dataLinks = [
    {
      icon: TbHome,
      label: 'Home',
      to: '/',
    },
  ];

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group h="100%">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />

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
                    leftSection={<TbLogout2 />}
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

      <AppShell.Navbar p="md">
        {dataLinks.map((link, index) => (
          <NavLink
            key={index}
            component={Link}
            to={link.to}
            active={location.pathname === link.to}
            leftSection={<link.icon />}
            label={link.label}
          />
        ))}
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}

export default AppContainer;
