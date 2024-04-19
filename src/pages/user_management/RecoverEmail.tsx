import {
  Button,
  Center,
  Container,
  Group,
  Loader,
  LoadingOverlay,
  Paper,
  Title,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import {
  applyActionCode,
  checkActionCode,
  sendPasswordResetEmail,
} from 'firebase/auth';
import InvalidActionCode from './InvalidActionCode';
import { auth } from '../../config/firebase';
import { TbCircleCheckFilled } from 'react-icons/tb';
import { notifications } from '@mantine/notifications';
import { Link } from 'react-router-dom';

interface RecoverEmailProps {
  actionCode: string;
}

function RecoverEmail({ actionCode }: RecoverEmailProps) {
  const [restoredEmail, setRestoredEmail] = useState('');
  const [invalidActionCode, setInvalidActionCode] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [resetPasswordSent, setResetPasswordSent] = useState(false);

  useEffect(() => {
    checkActionCode(auth, actionCode)
      .then((info) => {
        if (!info.data.email) return;

        setRestoredEmail(info.data.email);
        return applyActionCode(auth, actionCode);
      })
      .catch((error) => {
        setInvalidActionCode(true);
        console.log(error);
      });
  }, [actionCode]);

  const handleResetPassword = async () => {
    try {
      setIsResettingPassword(true);

      await sendPasswordResetEmail(auth, restoredEmail);

      setResetPasswordSent(true);
      notifications.show({
        title: 'Password reset email sent',
        message: 'Check your email for the password reset link',
      });

      setIsResettingPassword(false);
    } catch (error) {
      setIsResettingPassword(false);
      console.error(error);
    }
  };

  if (invalidActionCode) return <InvalidActionCode />;

  return (
    <Center w="100vw" h="100vh">
      <Container w={420} m="auto">
        <Group justify="center" gap="xs">
          {restoredEmail ? (
            <TbCircleCheckFilled
              size={30}
              color="var(--mantine-color-green-filled)"
            />
          ) : (
            <Loader size={30} />
          )}

          <Title size="h2">
            {restoredEmail
              ? `Email restored to ${restoredEmail}`
              : 'Restoring email...'}
          </Title>
        </Group>

        <Paper
          pos="relative"
          withBorder
          shadow="md"
          p={30}
          mt={30}
          radius="md"
          style={{ overflow: 'hidden' }}
        >
          <LoadingOverlay visible={!restoredEmail} zIndex={1000} />

          <Title order={2} size="h4">
            Do you want to reset your password?
          </Title>

          <Button
            mt="md"
            fullWidth
            onClick={handleResetPassword}
            loading={isResettingPassword}
            disabled={resetPasswordSent}
          >
            Reset password
          </Button>

          <Button
            component={Link}
            to="/login"
            variant="default"
            mt="sm"
            fullWidth
          >
            Take me to the login page
          </Button>
        </Paper>
      </Container>
    </Center>
  );
}

export default RecoverEmail;
