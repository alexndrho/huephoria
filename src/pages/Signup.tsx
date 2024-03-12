import {
  Anchor,
  Button,
  Center,
  Container,
  Divider,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { useForm } from '@mantine/form';
import { Link, useNavigate } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithRedirect,
} from 'firebase/auth';
import { GoogleButton } from '../components/GoogleButton';
import { auth, googleAuthProvider } from '../config/firebase';
import { FirebaseError } from 'firebase/app';

function Signup() {
  const navigate = useNavigate();
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/');
        setIsLoading(false);
      }
    });

    return () => unSubscribe();
  }, [navigate]);

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) =>
        val.length < 8 || !/\d/.test(val)
          ? 'Password must contain at least 8 characters and one number'
          : null,
    },
  });

  const handleSignup = async (values: typeof form.values) => {
    try {
      setIsLoading(true);

      await createUserWithEmailAndPassword(auth, values.email, values.password);
    } catch (error) {
      setIsLoading(false);

      if (error instanceof FirebaseError) {
        if (error.code === 'auth/email-already-in-use') {
          setFormError('Email already in use');
        } else if (error.code === 'auth/invalid-email') {
          setFormError('Invalid email');
        } else if (error.code === 'auth/operation-not-allowed') {
          setFormError('Operation not allowed');
        } else {
          setFormError('Something went wrong');
        }
      } else {
        setFormError('Something went wrong');
      }
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setIsLoading(true);

      await signInWithRedirect(auth, googleAuthProvider);
    } catch (error) {
      setIsLoading(false);

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
          Sign up
        </Title>
        <Text c="dimmed" size="sm" ta="center" mt={5}>
          Already have an account?{' '}
          <Anchor size="sm" component={Link} to="/login">
            Login
          </Anchor>
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <form onSubmit={form.onSubmit(handleSignup)}>
            <TextInput
              mt="md"
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

            <Button fullWidth mt="xl" type="submit" loading={isLoading}>
              Sign up
            </Button>

            <Divider label="or continue with" labelPosition="center" my="lg" />

            <Group grow mb="md" mt="md">
              <GoogleButton onClick={handleGoogleSignup}>Google</GoogleButton>
            </Group>
          </form>
        </Paper>
      </Container>
    </Center>
  );
}

export default Signup;
