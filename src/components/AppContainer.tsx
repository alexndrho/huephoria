import {
  AppShell,
  Avatar,
  Burger,
  Button,
  Group,
  Menu,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { signOut } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { auth } from '../config/firebase';
import { TbLogout2, TbSettings } from 'react-icons/tb';

function AppContainer({ children }: { children?: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();

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

          {auth.currentUser ? (
            <Group h="100%">
              <Menu>
                <Menu.Target>
                  <UnstyledButton>
                    <Avatar src={auth.currentUser.photoURL} alt="avatar icon" />
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

      <AppShell.Navbar p="md"></AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}

export default AppContainer;
