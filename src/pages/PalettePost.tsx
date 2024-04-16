import { useLocation, useNavigate, useParams } from 'react-router-dom';
import AppContainer from '../components/AppContainer';
import PaletteBar from '../components/PaletteBar';
import { useEffect, useState } from 'react';
import IPalettePost from '../types/IPalettePost';
import {
  ActionIcon,
  Badge,
  Box,
  ColorSwatch,
  Container,
  Flex,
  Group,
  Skeleton,
  Table,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { formatDistanceToNow } from 'date-fns';
import NotFoundWithContainer from './NotFoundWithContainer';
import ColorCopyButton from '../components/ColorCopyButton';
import { useDebouncedCallback } from '@mantine/hooks';
import {
  didUserLike,
  getPalettePost,
  likePalettePost,
} from '../services/palettePost';
import { hexToRgb } from '../helpers/color';
import LikeButton from '../components/LikeButton';
import { TbX } from 'react-icons/tb';

function PalettePost() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [notFound, setNotFound] = useState(false);

  const [palettePost, setPalettePost] = useState<IPalettePost | null>(null);

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

  return (
    <AppContainer>
      <Container pt="md" pb="xl">
        {palettePost ? (
          <>
            <Flex justify="space-between">
              <Title>{palettePost.title}</Title>

              <Tooltip label="Close">
                <ActionIcon
                  size="xl"
                  color="gray"
                  variant="subtle"
                  aria-label="close"
                  onClick={() => {
                    if (location.key === 'default') {
                      navigate('/', { replace: true });
                    } else {
                      navigate(-1);
                    }
                  }}
                >
                  <TbX fontSize="1.75rem" />
                </ActionIcon>
              </Tooltip>
            </Flex>

            <Group mb="xl" justify="space-between">
              <Text>By {palettePost.author}</Text>
            </Group>

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

                  <Text size="xs">
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

            <Text>{palettePost.description}</Text>

            <Group mt="lg" justify="center">
              <Group justify="space-between">
                {palettePost.tags.map((tag) => (
                  <Badge size="lg" color="gray" key={crypto.randomUUID()}>
                    {tag}
                  </Badge>
                ))}
              </Group>
            </Group>
          </>
        ) : (
          <>
            <Flex justify="space-between">
              <Skeleton w={500} height={35} />

              <Tooltip label="Close">
                <ActionIcon
                  size="xl"
                  color="gray"
                  variant="subtle"
                  aria-label="close"
                  onClick={() => {
                    if (location.key === 'default') {
                      navigate('/', { replace: true });
                    } else {
                      navigate(-1);
                    }
                  }}
                >
                  <TbX fontSize="1.75rem" />
                </ActionIcon>
              </Tooltip>
            </Flex>

            <Skeleton height={20} />

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
          </>
        )}
      </Container>
    </AppContainer>
  );
}

export default PalettePost;
