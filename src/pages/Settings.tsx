import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Container,
  Flex,
  Group,
  Menu,
  Modal,
  Paper,
  Text,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  onAuthStateChanged,
  updateEmail,
  updateProfile,
} from 'firebase/auth';
import { useForm } from '@mantine/form';
import { FirebaseError } from 'firebase/app';
import { deleteObject, ref } from 'firebase/storage';
import EmailVerificationPaper from '../components/EmailVerificationPaper';
import ChangeAvatarModal from '../components/ChangeAvatarModal';
import ChangePasswordModal from '../components/ChangePasswordModal';
import { createUpdateUsername } from '../helpers/user';
import { auth, storage } from '../config/firebase';
import UserError from '../errors/UserError';
import IUser from '../types/IUser';
import { TbEdit, TbPhoto, TbTrash, TbX } from 'react-icons/tb';

interface SettingsProps {
  userData: IUser | null;
}

function Settings({ userData }: SettingsProps) {
  const navigate = useNavigate();
  // states
  const [openedChangePass, { open: openChangePass, close: closeChangePass }] =
    useDisclosure();
  const [
    openedChangeAvatar,
    { open: openChangeAvatar, close: closeChangeAvatar },
  ] = useDisclosure();
  const [
    openedDeleteAvatar,
    { open: openDeleteAvatar, close: closeDeleteAvatar },
  ] = useDisclosure();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDeleteAvatar, setIsLoadingDeleteAvatar] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const [displayNameDisabled, setDisplayNameDisabled] = useState(true);
  const [usernameDisabled, setUsernameDisabled] = useState(true);
  const [emailDisabled, setEmailDisabled] = useState(true);

  const [formError, setFormError] = useState('');
  const [avatarError, setAvatarError] = useState('');

  const form = useForm({
    initialValues: {
      displayName: '',
      username: '',
      email: '',
    },

    validate: {
      displayName: (val) =>
        val.length > 0 || displayNameDisabled
          ? null
          : 'Display name is required',
      username: (val) =>
        val.length > 0 || usernameDisabled ? null : 'Username is required',
      email: (val) =>
        /^\S+@\S+$/.test(val) || emailDisabled ? null : 'Invalid email',
    },
  });

  // effects
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/login');
        return;
      }

      setUser(user);
    });

    return () => unSubscribe();
  }, [navigate]);

  // functions
  const resetInput = () => {
    form.reset();

    setDisplayNameDisabled(true);
    setUsernameDisabled(true);
    setEmailDisabled(true);
  };

  const deleteAvatar = async () => {
    try {
      if (!user) return;
      setIsLoadingDeleteAvatar(true);

      const avatarsStorageRef = ref(storage, `avatars/${user.uid}`);

      await deleteObject(avatarsStorageRef);

      await updateProfile(user, {
        photoURL: '',
      });

      setIsLoadingDeleteAvatar(false);
      closeDeleteAvatar();
    } catch (error) {
      setIsLoadingDeleteAvatar(false);
      setAvatarError('Something went wrong');
    }
  };

  const handleSaveChanges = async (values: typeof form.values) => {
    try {
      setIsLoading(true);

      if (!user) return;

      if (!usernameDisabled && values.username !== userData?.username) {
        await createUpdateUsername(user.uid, values.username);
      }

      if (!emailDisabled && values.email !== user.email) {
        await updateEmail(user, values.email);
      }

      await updateProfile(user, {
        displayName: displayNameDisabled
          ? user.displayName
          : values.displayName,
      });

      resetInput();
      setFormError('');
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setFormError('');

      if (error instanceof UserError) {
        if (error.code === 'username-already-exists') {
          form.setFieldError('username', error.message);
        } else {
          setFormError('Something went wrong');
        }
      } else if (error instanceof FirebaseError) {
        if (error.code === 'auth/invalid-email') {
          form.setFieldError('email', 'Invalid email');
        } else if (error.code === 'auth/email-already-in-use') {
          form.setFieldError('email', 'Email already in use');
        } else if (error.code === 'auth/requires-recent-login') {
          form.setFieldError(
            'email',
            'You need to reauthenticate to change your email. Please log out and log in again'
          );
        } else if (error.code === 'auth/operation-not-allowed') {
          form.setFieldError(
            'email',
            'Please verify the new email before changing email'
          );
        } else {
          setFormError('Something went wrong');
        }
      } else {
        setFormError('Something went wrong');
      }
    }
  };

  // data
  const textInputData = [
    {
      inputField: 'displayName',
      label: 'Display name',
      value: displayNameDisabled
        ? user?.displayName || ''
        : form.values.displayName,
      placeholder: user?.displayName || '',
      editable: displayNameDisabled,
      setEditable: setDisplayNameDisabled,
    },
    {
      inputField: 'username',
      label: 'Username',
      value: usernameDisabled ? userData?.username || '' : form.values.username,
      placeholder: userData?.username || '',
      editable: usernameDisabled,
      setEditable: setUsernameDisabled,
    },
    {
      inputField: 'email',
      label: 'Email',
      value: emailDisabled ? user?.email || '' : form.values.email,
      placeholder: user?.email || '',
      editable: emailDisabled,
      setEditable: setEmailDisabled,
    },
  ];

  return (
    <Container size="lg" py="lg">
      <ChangePasswordModal
        opened={openedChangePass}
        onClose={closeChangePass}
      />

      <ChangeAvatarModal
        opened={openedChangeAvatar}
        onClose={closeChangeAvatar}
        photoURL={user?.photoURL || ''}
      />

      <Modal
        title="Are you sure you want to remove your avatar?"
        opened={openedDeleteAvatar}
        onClose={closeDeleteAvatar}
        centered
      >
        <Group grow>
          <Button variant="default" onClick={closeDeleteAvatar}>
            Cancel
          </Button>

          <Button
            color="red"
            onClick={deleteAvatar}
            loading={isLoadingDeleteAvatar}
          >
            Remove
          </Button>
        </Group>
      </Modal>

      <Group mb={50} justify="space-between">
        <Title>Settings</Title>

        <Tooltip label="Close">
          <ActionIcon
            component={Link}
            to="/"
            size="xl"
            color="gray"
            variant="subtle"
            aria-label="close"
          >
            <TbX fontSize="1.75rem" />
          </ActionIcon>
        </Tooltip>
      </Group>

      <Flex direction={{ base: 'column', sm: 'row' }}>
        <Flex
          mr="lg"
          w={{ base: '100%', sm: '350' }}
          mb={{ base: 'lg', sm: 0 }}
          direction="column"
          align="center"
        >
          <Title order={2} mb="md" ta="center" lineClamp={1}>
            {user?.displayName}
          </Title>

          <Avatar src={user?.photoURL} alt="user icon" mb="md" size={200} />

          <Menu>
            <Menu.Target>
              <Button variant="default" leftSection={<TbEdit />}>
                Edit
              </Button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item leftSection={<TbPhoto />} onClick={openChangeAvatar}>
                Upload an avatar
              </Menu.Item>

              <Menu.Item
                leftSection={<TbTrash />}
                color="red"
                onClick={openDeleteAvatar}
              >
                Remove avatar
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>

          {avatarError && (
            <Text mt="xs" size="xs" c="red.8">
              {avatarError}
            </Text>
          )}
        </Flex>

        <Box style={{ flexGrow: 1 }}>
          {!user?.emailVerified && <EmailVerificationPaper />}

          <form onSubmit={form.onSubmit((val) => handleSaveChanges(val))}>
            <Paper shadow="xs" p="lg" withBorder>
              <Flex direction="column" gap="md">
                {textInputData.map((data, index) => (
                  <TextInput
                    key={index}
                    rightSection={
                      <ActionIcon
                        variant="default"
                        onClick={() => data.setEditable(!data.editable)}
                      >
                        <TbEdit />
                      </ActionIcon>
                    }
                    style={{ flexGrow: 1 }}
                    label={data.label}
                    placeholder={data.placeholder}
                    disabled={data.editable}
                    {...form.getInputProps(data.inputField)}
                    value={data.value}
                  />
                ))}

                {formError && (
                  <Text size="xs" c="red.8">
                    {formError}
                  </Text>
                )}

                <Group mt="xs">
                  <Button variant="default" onClick={openChangePass}>
                    Change Password
                  </Button>
                </Group>
              </Flex>
            </Paper>

            <Group mt="xl" justify="end">
              <Button type="submit" loading={isLoading}>
                Save Changes
              </Button>
            </Group>
          </form>
        </Box>
      </Flex>
    </Container>
  );
}

export default Settings;
export type { SettingsProps };
