import { Avatar, Button, FileInput, Flex, Group, Modal } from '@mantine/core';
import { useState } from 'react';
import { FirebaseError } from 'firebase/app';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { auth, storage } from '../config/firebase';
import { TbPhoto } from 'react-icons/tb';

interface ChangeAvatarModalProps {
  opened: boolean;
  onClose: () => void;
  photoURL: string;
}

function ChangeAvatarModal({
  opened,
  onClose,
  photoURL,
}: ChangeAvatarModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [avatarInput, setAvatarInput] = useState<File | null>(null);
  const [avatarInputError, setAvatarInputError] = useState('');
  const [avatarInputUrl, setAvatarInputUrl] = useState('');

  const handleClose = () => {
    setAvatarInput(null);
    setAvatarInputError('');
    setAvatarInputUrl('');
    setIsLoading(false);
    onClose();
  };

  const handleAvatarInput = (file: File | null) => {
    if (!file) {
      setAvatarInput(null);
      setAvatarInputError('');
      return;
    } else if (file.size > 2 * 1024 * 1024) {
      setAvatarInputError('File size is too large');
      return;
    } else if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
      setAvatarInputError('File type is not supported');
      return;
    }

    setAvatarInput(file);
    setAvatarInputUrl(URL.createObjectURL(file));
    setAvatarInputError('');
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      const user = auth.currentUser;
      if (!user) return;

      if (!avatarInput) {
        setAvatarInputError('Please select an avatar');
        return;
      }

      // upload avatar
      const avatarsStorageRef = ref(storage, `avatars/${user.uid}`);
      const avatarInputResult = await uploadBytes(
        avatarsStorageRef,
        avatarInput
      );

      await updateProfile(user, {
        photoURL: await getDownloadURL(avatarInputResult.ref),
      });

      handleClose();
    } catch (error) {
      setIsLoading(false);

      if (error instanceof FirebaseError) {
        if (error.code === 'auth/requires-recent-login') {
          setAvatarInputError('Please re-login to update your avatar');
        } else {
          setAvatarInputError('Failed to upload avatar');
        }
      } else {
        setAvatarInputError('Failed to upload avatar');
      }
    }
  };

  return (
    <Modal
      title="Upload an avatar"
      opened={opened}
      onClose={handleClose}
      centered
    >
      <Flex direction="column" align="center">
        <Avatar
          src={avatarInputUrl || photoURL}
          alt="user icon"
          mb="md"
          size={200}
        />

        <FileInput
          w={200}
          variant="filled"
          color="green"
          accept="image/*"
          aria-label="Change avatar"
          placeholder="Change avatar"
          leftSection={<TbPhoto />}
          value={avatarInput}
          error={avatarInputError}
          onChange={handleAvatarInput}
        />
      </Flex>

      <Group mt="xl" justify="end">
        <Button onClick={handleSubmit} loading={isLoading}>
          Upload avatar
        </Button>
      </Group>
    </Modal>
  );
}

export default ChangeAvatarModal;
export type { ChangeAvatarModalProps };
