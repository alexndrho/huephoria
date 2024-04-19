import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Group,
  LoadingOverlay,
  Paper,
  PasswordInput,
  Text,
  Title,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { useForm } from '@mantine/form';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { Link } from 'react-router-dom';
import InvalidActionCode from './InvalidActionCode';
import { auth } from '../../config/firebase';

interface ResetPasswordProps {
  actionCode: string;
  continueUrl?: string | null;
}

function ResetPassword({ actionCode, continueUrl }: ResetPasswordProps) {
  const [email, setEmail] = useState('');
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);
  const [invalidActionCode, setInvalidActionCode] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  useEffect(() => {
    verifyPasswordResetCode(auth, actionCode)
      .then((email) => {
        setEmail(email);
      })
      .catch((error) => {
        setInvalidActionCode(true);
        console.log(error);
      });
  }, [actionCode]);

  const form = useForm({
    initialValues: {
      password: '',
    },

    validate: {
      password: (val) =>
        val.length < 8 || !/\d/.test(val)
          ? 'Password must contain at least 8 characters and one number'
          : null,
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setIsResettingPassword(true);
      await confirmPasswordReset(auth, actionCode, values.password);

      setResetPasswordSuccess(true);
      setIsResettingPassword(false);
    } catch (error) {
      setIsResettingPassword(false);
      setInvalidActionCode(true);
      console.error(error);
    }
  };

  if (resetPasswordSuccess)
    return <ResetPasswordSuccess continueUrl={continueUrl} />;
  if (invalidActionCode) return <InvalidActionCode />;

  return (
    <Center w="100vw" h="100vh">
      <Container w={420} m="auto">
        <Title ta="center" fw="bold">
          Reset your password
        </Title>

        <Paper
          pos="relative"
          withBorder
          shadow="md"
          p={30}
          mt={30}
          radius="md"
          style={{ overflow: 'hidden' }}
        >
          <LoadingOverlay visible={!email} zIndex={1000} />

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Text fw="500">Email: {email}</Text>

            <PasswordInput
              mt="md"
              label="Password"
              withAsterisk
              {...form.getInputProps('password')}
            />

            <Button
              type="submit"
              mt="md"
              fullWidth
              loading={isResettingPassword}
            >
              Reset password
            </Button>
          </form>
        </Paper>
      </Container>
    </Center>
  );
}

function ResetPasswordSuccess({
  continueUrl,
}: {
  continueUrl?: string | null;
}) {
  return (
    <Container>
      <Flex direction="column" justify="center" align="center" h="100vh">
        <Box maw={500}>
          <Title ta="center" mb="lg">
            Password Changed
          </Title>

          <Text c="dimmed" mb="lg" size="lg" ta="center">
            You can now log in with your new password
          </Text>

          <Group justify="center">
            <Button
              component={Link}
              to={continueUrl ? continueUrl : '/login'}
              variant="subtle"
              size="md"
            >
              {continueUrl ? 'Continue' : 'Take me to the login page'}
            </Button>
          </Group>
        </Box>
      </Flex>
    </Container>
  );
}

export default ResetPassword;
