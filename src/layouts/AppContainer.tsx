import {
  Affix,
  AppShell,
  Avatar,
  Button,
  Container,
  Flex,
  Group,
  Image,
  Menu,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { signOut } from 'firebase/auth';
import { Link, useLocation } from 'react-router-dom';
import { auth } from '../config/firebase';
import useAuth from '../hooks/useAuth';
import NavLinkIcon from '../components/NavLinkIcon';
import classes from '../styles/AppContainer.module.css';
import { PiHouse, PiHouseFill } from 'react-icons/pi';
import { TbLogout, TbSettings } from 'react-icons/tb';

interface AppContainerProps {
  children?: React.ReactNode;
}

function AppContainer({ children }: AppContainerProps) {
  const location = useLocation();
  const [opened] = useDisclosure();

  const { user } = useAuth();

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
          <Text
            component={Link}
            to="/"
            reloadDocument
            c="green"
            fw="bold"
            size="xl"
          >
            <Group h="100%" gap="sm">
              <Image src="/icon.png" w={40} />
              Huephoria
            </Group>
          </Text>

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
          {dataLinks.map((link) => (
            <NavLinkIcon
              key={crypto.randomUUID()}
              icon={link.icon}
              activeIcon={link.iconActive}
              label={link.label}
              labelPosition={'right'}
              to={link.to}
              active={location.pathname === link.to}
              reloadDocument={location.pathname === link.to}
            />
          ))}
        </Flex>
      </AppShell.Navbar>

      <AppShell.Main>
        <Container size="lg" py="lg" pb={100}>
          {children}
        </Container>
      </AppShell.Main>

      <Affix
        display={{ sm: 'none' }}
        className={classes.navBottom}
        bg="dark.7"
        w="100%"
        p="sm"
      >
        <Group justify="space-around" grow>
          {dataLinks.map((link) => (
            <Flex key={crypto.randomUUID()} justify="center" align="center">
              <NavLinkIcon
                icon={link.icon}
                activeIcon={link.iconActive}
                label={link.label}
                labelPosition={'top'}
                to={link.to}
                active={location.pathname === link.to}
                visibleLabel
                reloadDocument={location.pathname === link.to}
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
