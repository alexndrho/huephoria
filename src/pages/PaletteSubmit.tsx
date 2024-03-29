import {
  ActionIcon,
  Button,
  Checkbox,
  Container,
  Flex,
  Group,
  Paper,
  TagsInput,
  Text,
  TextInput,
  Textarea,
  Title,
  Tooltip,
} from '@mantine/core';
import { useState } from 'react';
import { useForm } from '@mantine/form';
import { Link } from 'react-router-dom';
import { addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, palettesCollectionRef } from '../config/firebase';
import PaletteBarEdit from '../components/PaletteBarEdit';
import IPalettePost from '../types/IPalettePost';
import classes from '../styles/PaletteSubmit.module.css';
import { TbX } from 'react-icons/tb';

interface FormValues {
  title: string;
  description: string;
  isCreator: boolean;
  colors: string[];
  tags: string[];
}

function PaletteSubmit() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const form = useForm<FormValues>({
    initialValues: {
      title: '',
      description: '',
      isCreator: false,
      colors: [],
      tags: [],
    },

    validate: {
      title: (value) => (value.trim().length > 0 ? null : 'Title is required'),
      tags: (value) =>
        value.length > 0 ? null : 'At least one tag is required',
      colors: (value) =>
        value.length >= 3 ? null : 'At least 3 colors are required',
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    if (!auth.currentUser) return;

    try {
      setIsLoading(true);

      await addDoc(palettesCollectionRef, {
        ...values,
        uid: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      } satisfies Omit<IPalettePost, 'id'>);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);

      setError('Failed to submit palette');
    }
  };

  return (
    <Container size="lg" py="lg">
      <Group mb="xl" justify="space-between">
        <Title>Submit a palette</Title>

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

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Flex direction={{ base: 'column', sm: 'row' }} align="center" gap="lg">
          <Paper
            className={classes.form__formFieldsContainer}
            shadow="xs"
            p="lg"
            withBorder
          >
            <TextInput
              label="Title"
              withAsterisk
              {...form.getInputProps('title')}
            />

            <Textarea
              mt="md"
              label="Description"
              rows={4}
              {...form.getInputProps('description')}
            />

            <Checkbox
              mt="md"
              label="I am the creator of this palette"
              {...form.getInputProps('isCreator', { type: 'checkbox' })}
            />

            <TagsInput
              mt="md"
              label="Tags"
              withAsterisk
              {...form.getInputProps('tags')}
            />
          </Paper>

          <PaletteBarEdit
            w={300}
            palette={form.values['colors']}
            setPalette={(setter) => form.setFieldValue('colors', setter)}
            error={form.errors['colors']}
          />
        </Flex>

        {error && (
          <Text mt="md" c="red">
            {error}
          </Text>
        )}
        <Group mt="xl" justify="end">
          <Button type="submit" loading={isLoading}>
            Submit
          </Button>
        </Group>
      </form>
    </Container>
  );
}

export default PaletteSubmit;