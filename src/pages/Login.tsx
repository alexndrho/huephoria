import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
  Center,
  Divider,
} from '@mantine/core';
import { useState } from 'react';
import { useForm } from '@mantine/form';
import { GoogleButton } from '../components/GoogleButton';
import {
  browserSessionPersistence,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithRedirect,
} from 'firebase/auth';
import { auth, googleAuthProvider } from '../config/firebase';
import { FirebaseError } from 'firebase/app';

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string>('');

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      remember: false,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
    },
  });

  const handleLogin = async (values: typeof form.values) => {
    try {
      setIsLoading(true);

      if (values.remember.valueOf()!) {
        await setPersistence(auth, browserSessionPersistence);
      }

      await signInWithEmailAndPassword(auth, values.email, values.password);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);

      if (error instanceof FirebaseError) {
        // email error handling
        if (error.code === 'auth/invalid-email') {
          form.setFieldError('email', 'Invalid email');
        } else if (error.code === 'auth/user-not-found') {
          form.setFieldError('email', 'User not found');

          // password error handling
        } else if (error.code === 'auth/missing-password') {
          form.setFieldError('password', 'Missing password');
        } else if (error.code === 'auth/wrong-password') {
          form.setFieldError('password', 'Wrong password');

          // form error handling
        } else if (error.code === 'auth/too-many-requests') {
          setFormError('Too many requests');
        } else if (error.code === 'auth/invalid-credential') {
          setFormError('Invalid credential');
        } else {
          setFormError('Something went wrong');
        }
      } else {
        setFormError('Something went wrong');
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithRedirect(auth, googleAuthProvider);
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/operation-not-allowed') {
          setFormError('Operation not allowed');
        } else {
          setFormError('Something went wrong');
        }
      } else {
        setFormError('Something went wrong');
      }
    }
  };

  return (
    <Center w="100vw" h="100vh">
      <Container w={420} m="auto">
        <Title ta="center" fw="bold">
          Welcome back!
        </Title>

        <Text c="dimmed" size="sm" ta="center" mt={5}>
          Do not have an account yet?{' '}
          <Anchor size="sm" component="button">
            Create account
          </Anchor>
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <form onSubmit={form.onSubmit(handleLogin)}>
            <TextInput
              label="Email"
              withAsterisk
              {...form.getInputProps('email')}
            />

            <PasswordInput
              mt="md"
              label="Password"
              withAsterisk
              {...form.getInputProps('password')}
            />

            {formError && (
              <Text mt="xs" size="xs" c="red.8">
                {formError}
              </Text>
            )}

            <Group justify="space-between" mt="lg">
              <Checkbox
                label="Remember me"
                {...form.getInputProps('remember')}
              />

              <Anchor component="button" size="sm">
                Forgot password?
              </Anchor>
            </Group>

            <Button fullWidth mt="xl" type="submit" loading={isLoading}>
              Log in
            </Button>

            <Divider label="or continue with" labelPosition="center" my="lg" />

            <Group grow mb="md" mt="md">
              <GoogleButton onClick={handleGoogleLogin}>Google</GoogleButton>
            </Group>
          </form>
        </Paper>
      </Container>
    </Center>
  );
}

export default Login;