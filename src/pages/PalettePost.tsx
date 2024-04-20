import {
  Badge,
  Box,
  ColorSwatch,
  Flex,
  Group,
  Paper,
  Skeleton,
  Table,
  Text,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { useDebouncedCallback, useDisclosure } from '@mantine/hooks';
import { useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import PaletteBar from '../components/PaletteBar';
import LikeButton from '../components/LikeButton';
import NotFoundWithContainer from './NotFoundWithContainer';
import ColorCopyButton from '../components/ColorCopyButton';
import LoginWarningModal from '../components/LoginWarningModal';
import { auth } from '../config/firebase';
import {
  didUserLike,
  getPalettePost,
  likePalettePost,
} from '../services/palettePost';
import { hexToRgb } from '../helpers/color';
import IPalettePost from '../types/IPalettePost';
import AppCloseContainer from '../layouts/AppCloseContainer';

function PalettePost() {
  const { id } = useParams();

  const [palettePost, setPalettePost] = useState<IPalettePost | null>(null);
  const [
    openedLoginWarning,
    { open: openLoginWarning, close: closeLoginWarning },
  ] = useDisclosure();
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchPalettePost = async () => {
      if (!id) return;

      try {
        const post = await getPalettePost(id);

        setPalettePost(post);
      } catch (error) {
        setNotFound(true);
        console.error(error);
      }
    };

    fetchPalettePost();
  }, [id]);

  const serverLike = useDebouncedCallback(async () => {
    if (!palettePost) return;

    const didServerLike = await didUserLike(palettePost.id);
    if (palettePost?.userLike === didServerLike) return;

    await likePalettePost(palettePost.id);
  }, 600);

  const handleLike = () => {
    const user = auth.currentUser;
    if (!user) {
      openLoginWarning();
      return;
    }

    setPalettePost((prev) =>
      prev
        ? {
            ...prev,
            likes: prev.userLike ? prev.likes - 1 : prev.likes + 1,
            userLike: !prev.userLike,
          }
        : null
    );

    serverLike();
  };

  if (notFound) return <NotFoundWithContainer />;
  if (!palettePost) return <PalettePostSkeleton />;

  return (
    <AppCloseContainer title={palettePost.title}>
      <Group mb="xl" justify="space-between">
        <Text>By {palettePost.author}</Text>
      </Group>

      <LoginWarningModal
        opened={openedLoginWarning}
        onClose={closeLoginWarning}
      />

      <Flex
        mb="xl"
        direction={{ base: 'column', md: 'row' }}
        justify="space-between"
        align="center"
        gap="xl"
      >
        <Box w="350">
          <PaletteBar palette={palettePost.colors} />

          <Group mt="xs" justify="space-between">
            <LikeButton
              userLike={palettePost.userLike}
              likes={palettePost.likes}
              size="xs"
              onClick={handleLike}
            />

            <Text size="sm">
              {formatDistanceToNow(palettePost.createdAt.toDate())}
            </Text>
          </Group>
        </Box>

        <Box w={{ base: '300', md: '500' }}>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th ta="center">Color</Table.Th>
                <Table.Th ta="center">Hex</Table.Th>
                <Table.Th ta="center">RGB</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {palettePost.colors.map((color) => (
                <Table.Tr key={crypto.randomUUID()}>
                  <Table.Td>
                    <ColorSwatch mx="auto" color={color} />
                  </Table.Td>

                  <Table.Td ta="center">
                    <ColorCopyButton color={color} />
                  </Table.Td>

                  <Table.Td ta="center">
                    <ColorCopyButton color={hexToRgb(color)} />
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Box>
      </Flex>

      {palettePost.description && (
        <Paper p="lg" shadow="xs" withBorder>
          <Text>{palettePost.description}</Text>
        </Paper>
      )}

      <Group mt="lg" justify="center">
        <Group justify="space-between">
          {palettePost.tags.map((tag) => (
            <Badge size="lg" color="gray" key={crypto.randomUUID()}>
              {tag}
            </Badge>
          ))}
        </Group>
      </Group>
    </AppCloseContainer>
  );
}

function PalettePostSkeleton() {
  return (
    <AppCloseContainer>
      <Skeleton height={20} w={250} />

      <Flex
        mt="xl"
        direction={{ base: 'column', md: 'row' }}
        gap={{ base: 'xs', md: 'md' }}
      >
        <Skeleton height={400} />
        <Skeleton height={400} />
      </Flex>

      <Skeleton mt="xl" height={125} />

      <Flex mt="lg" mx="auto" maw={400} gap="lg">
        <Skeleton height={25} />
        <Skeleton height={25} />
        <Skeleton height={25} />
      </Flex>
    </AppCloseContainer>
  );
}

export default PalettePost;
