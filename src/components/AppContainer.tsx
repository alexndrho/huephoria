import { AppShell, Burger, Button, Group, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { signOut } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { auth } from '../config/firebase';

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
              <Text c="gray" size="sm">
                {auth.currentUser.displayName}
              </Text>

              <Button color="red" onClick={() => signOut(auth)}>
                Log out
              </Button>
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
