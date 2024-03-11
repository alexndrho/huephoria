import { AppShell, Burger, Button, Group, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { auth } from '../config/firebase';

function AppContainer({ children }: { children?: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unSubscribe();
  }, []);

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
              <Text c="gray" size="sm">
                {user.displayName}
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
