import { Button, Group, Modal, PasswordInput, Text } from '@mantine/core';
import { useState } from 'react';
import { useForm } from '@mantine/form';
import { updatePassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { FirebaseError } from 'firebase/app';

interface ChangePasswordModalProps {
  opened: boolean;
  onClose: () => void;
}

function ChangePasswordModal({ opened, onClose }: ChangePasswordModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const form = useForm({
    initialValues: {
      newPassword: '',
      confirmNewPassword: '',
    },

    validate: {
      newPassword: (val) =>
        val.length < 8 || !/\d/.test(val)
          ? 'Password must contain at least 8 characters and one number'
          : null,
      confirmNewPassword: (val) =>
        val.length < 8 || !/\d/.test(val)
          ? 'Password must contain at least 8 characters and one number'
          : null,
    },
  });

  const handleClose = () => {
    form.reset();
    onClose();
    setFormError('');
    setIsLoading(false);
  };

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setIsLoading(true);

      if (!auth.currentUser) {
        setIsLoading(false);
        return;
      }

      if (values.newPassword !== values.confirmNewPassword) {
        form.setFieldError('confirmNewPassword', 'Passwords do not match');
        setIsLoading(false);
        return;
      }

      await updatePassword(auth.currentUser, values.newPassword);

      handleClose();
    } catch (error) {
      setIsLoading(false);

      if (error instanceof FirebaseError) {
        if (error.code === 'auth/requires-recent-login') {
          setFormError(
            'You need to reauthenticate to change your password. Please log out and log in again'
          );
        }
      } else {
        setFormError('An error occurred');
      }
    }
  };

  return (
    <Modal
      title="Change password"
      opened={opened}
      onClose={handleClose}
      centered
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <PasswordInput
          label="New password"
          withAsterisk
          {...form.getInputProps('newPassword')}
        />

        <PasswordInput
          mt="md"
          label="Confirm password"
          withAsterisk
          {...form.getInputProps('confirmNewPassword')}
        />

        {formError && (
          <Text mt="xs" size="xs" c="red.8">
            {formError}
          </Text>
        )}

        <Group justify="end">
          <Button mt="xl" type="submit" loading={isLoading}>
            Change password
          </Button>
        </Group>
      </form>
    </Modal>
  );
}

export default ChangePasswordModal;
export type { ChangePasswordModalProps };
