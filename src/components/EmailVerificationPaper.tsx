import { Box, Button, Group, Paper, Text } from '@mantine/core';
import { useState } from 'react';
import { FirebaseError } from 'firebase/app';
import { sendEmailVerification } from 'firebase/auth';
import { auth } from '../config/firebase';
import { FaTriangleExclamation } from 'react-icons/fa6';
import { TbCheck } from 'react-icons/tb';

function EmailVerificationPaper() {
  const [isLoadingEmailVerification, setIsLoadingEmailVerification] =
    useState(false);
  const [formError, setFormError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleSendEmailVerification = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      setIsLoadingEmailVerification(true);

      await sendEmailVerification(user);

      setEmailSent(true);
      setIsLoadingEmailVerification(false);
    } catch (error) {
      setIsLoadingEmailVerification(false);

      if (error instanceof FirebaseError) {
        if (error.code === 'auth/too-many-requests') {
          setFormError('Too many requests');
        } else {
          setFormError('Something went wrong');
        }
      } else {
        setFormError('Something went wrong');
      }
    }
  };

  return (
    <Paper mb="lg" shadow="xs" p="lg" withBorder>
      <Group style={{ flexWrap: 'nowrap' }}>
        <Text mx={5} c="yellow">
          <FaTriangleExclamation fontSize="2rem" />
        </Text>

        <Box>
          <Text fw="bolder">UNVERIFIED EMAIL</Text>

          <Text>
            If you have not sent a verification email or if it has expired, you
            can send a new email and follow the instructions to verify your
            email.
          </Text>

          {formError && <Text c="red.8">{formError}</Text>}

          <Button
            mt="md"
            variant="default"
            leftSection={emailSent && <TbCheck />}
            loading={isLoadingEmailVerification}
            onClick={handleSendEmailVerification}
            disabled={emailSent}
          >
            {isLoadingEmailVerification
              ? 'Sending verification email...'
              : emailSent
              ? 'Email sent'
              : 'Send verification email'}
          </Button>
        </Box>
      </Group>
    </Paper>
  );
}

export default EmailVerificationPaper;
