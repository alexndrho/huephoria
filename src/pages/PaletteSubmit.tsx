import {
  Button,
  Checkbox,
  Flex,
  Group,
  Paper,
  TagsInput,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import CloseContainer from '../components/CloseContainer';
import PaletteBarEdit from '../components/PaletteBarEdit';
import { submitPalettePost } from '../services/palettePost';
import { auth } from '../config/firebase';
import classes from '../styles/PaletteSubmit.module.css';

interface FormValues {
  title: string;
  description: string;
  isCreator: boolean;
  colors: string[];
  tags: string[];
}

function PaletteSubmit() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/login');
      }
    });

    return () => unSubscribe();
  }, [navigate]);

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
    try {
      setIsLoading(true);
      setError('');

      const doc = await submitPalettePost(values);

      navigate(`/palette/${doc.id}`);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError('Failed to submit palette');
    }
  };

  return (
    <CloseContainer title="Submit a Palette">
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
            colors={form.values['colors']}
            setColors={(setter) => form.setFieldValue('colors', setter)}
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
    </CloseContainer>
  );
}

export default PaletteSubmit;
