import {
  Button,
  Center,
  Container,
  Group,
  Loader,
  Paper,
  Title,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { applyActionCode } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { TbCircleCheckFilled } from 'react-icons/tb';
import InvalidActionCode from './InvalidActionCode';

interface VerifyEmailProps {
  actionCode: string;
  continueUrl?: string | null;
}

function VerifyEmail({ actionCode, continueUrl }: VerifyEmailProps) {
  const [verified, setVerified] = useState(false);
  const [invalidActionCode, setInvalidActionCode] = useState(false);

  useEffect(() => {
    applyActionCode(auth, actionCode)
      .then(() => {
        setVerified(true);
      })
      .catch((error) => {
        setInvalidActionCode(true);
        console.error(error);
      });
  }, [actionCode]);

  if (invalidActionCode) return <InvalidActionCode />;

  return (
    <Center w="100vw" h="100vh">
      <Container w={420} m="auto">
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <Group justify="center" gap="xs">
            {verified ? (
              <TbCircleCheckFilled
                size={30}
                color="var(--mantine-color-green-filled)"
              />
            ) : (
              <Loader size={30} />
            )}

            <Title size="h2">
              {verified ? 'Email verified' : 'Verifying email...'}
            </Title>
          </Group>

          <Group mt="md" justify="center">
            <Button
              component={Link}
              to={continueUrl ? continueUrl : '/'}
              variant="subtle"
              size="md"
            >
              {continueUrl ? 'Continue' : 'Take me back to the home page'}
            </Button>
          </Group>
        </Paper>
      </Container>
    </Center>
  );
}

export default VerifyEmail;
