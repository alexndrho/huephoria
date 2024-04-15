import {
  Paper,
  Title,
  TextInput,
  Button,
  Container,
  Center,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { useForm } from '@mantine/form';
import { createUpdateUsername, uidExistsWithUsername } from '../services/user';
import { auth } from '../config/firebase';
import UserError from '../errors/UserError';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function CreateUsername() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user || (await uidExistsWithUsername(user?.uid))) {
        navigate('/');
      }
    });

    return () => unSubscribe();
  }, [navigate]);

  const form = useForm({
    initialValues: {
      username: '',
    },
    validate: {
      username: (val) =>
        2 <= val.length && val.length <= 32
          ? null
          : 'Must must be between 2 and 32 in length',
    },
  });

  const handleCreateUsername = async (values: typeof form.values) => {
    if (!auth.currentUser) return;

    try {
      setIsLoading(true);

      await createUpdateUsername(auth.currentUser.uid, values.username);
      navigate('/');

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);

      console.log('error');
      if (error instanceof UserError) {
        console.log('UserError');

        if (error.code === 'username-already-exists') {
          form.setFieldError('username', 'Username already exists');
        } else {
          form.setFieldError('username', 'An error occurred');
        }
      } else {
        form.setFieldError('username', 'An error occurred');
      }
    }
  };

  return (
    <Center w="100vw" h="100vh">
      <Container w={420} m="auto">
        <Title ta="center" fw="bold">
          Create your username
        </Title>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <form onSubmit={form.onSubmit(handleCreateUsername)}>
            <TextInput
              label="Username"
              withAsterisk
              {...form.getInputProps('username')}
            />

            <Button fullWidth mt="xl" type="submit" loading={isLoading}>
              Create username
            </Button>
          </form>
        </Paper>
      </Container>
    </Center>
  );
}

export default CreateUsername;
