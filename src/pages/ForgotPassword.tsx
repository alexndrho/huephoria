import {
  Button,
  Center,
  Container,
  Paper,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from '@mantine/form';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebase';
import { FirebaseError } from 'firebase/app';

function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [formFeedback, setFormFeedback] = useState('');

  const form = useForm({
    initialValues: {
      email: '',
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setIsLoading(true);
      setFormFeedback('');

      await sendPasswordResetEmail(auth, values.email);

      setFormFeedback('Password reset email sent!');
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);

      if (error instanceof FirebaseError) {
        if (error.code === 'auth/user-not-found') {
          form.setFieldError('email', 'User not found');
        } else if (error.code === 'auth/invalid-email') {
          form.setFieldError('email', 'Invalid email');
        } else {
          form.setFieldError('email', 'An error occurred');
        }
      } else {
        console.error(error);
        form.setFieldError('email', 'An error occurred');
      }
    }
  };

  return (
    <Center w="100vw" h="100vh">
      <Container w={420} m="auto">
        <Title ta="center" fw="bold">
          Forgot your password?
        </Title>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
              label="Email"
              withAsterisk
              {...form.getInputProps('email')}
            />

            {formFeedback && (
              <Text size="xs" c="green.8">
                {formFeedback}
              </Text>
            )}

            <Button fullWidth mt="xl" type="submit" loading={isLoading}>
              Reset password
            </Button>

            <Button
              component={Link}
              to="/login"
              variant="default"
              fullWidth
              mt="sm"
            >
              Cancel
            </Button>
          </form>
        </Paper>
      </Container>
    </Center>
  );
}

export default ForgotPassword;
