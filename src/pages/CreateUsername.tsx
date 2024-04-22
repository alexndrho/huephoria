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
import useAuth from '../hooks/useAuth';
import { createUpdateUsername } from '../services/user';
import UserError from '../errors/UserError';
import { useNavigate } from 'react-router-dom';

function CreateUsername() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [navigate, user]);

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
    try {
      setIsLoading(true);

      await createUpdateUsername(values.username);
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

            <Button fullWidth mt="md" type="submit" loading={isLoading}>
              Create username
            </Button>
          </form>
        </Paper>
      </Container>
    </Center>
  );
}

export default CreateUsername;
