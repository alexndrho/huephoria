import { useLocation, useNavigate, useParams } from 'react-router-dom';
import AppContainer from '../components/AppContainer';
import PaletteBar from '../components/PaletteBar';
import { useCallback, useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import IPalettePost, { IPalettePostWithUsername } from '../types/IPalettePost';
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
import { getUserName } from '../helpers/user';
import { hexToRgb } from '../helpers/color';
import { TbX } from 'react-icons/tb';

function PalettePost() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [notFound, setNotFound] = useState(false);

  const [palettePost, setPalettePost] =
    useState<IPalettePostWithUsername | null>(null);

  const getPalette = useCallback(async () => {
    if (!id) return;

    try {
      const docRef = doc(db, 'palettes', id);

      const docSnap = await getDoc(docRef);

      const data = docSnap.data() as IPalettePost;
      const username = await getUserName(data.uid);

      setPalettePost({ ...data, username });
    } catch (error) {
      console.error('Error getting document:', error);
      setNotFound(true);
    }
  }, [id]);

  useEffect(() => {
    getPalette();
  }, [getPalette]);

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
              <Text>By {palettePost.username}</Text>

              <Text>
                {formatDistanceToNow(palettePost.createdAt.toDate(), {
                  addSuffix: true,
                })}
              </Text>
            </Group>

            <Flex
              mb="xl"
              direction={{ base: 'column', md: 'row' }}
              justify="space-between"
              align="center"
              gap="xl"
            >
              <PaletteBar w="350" palette={palettePost.colors} />

              <Box w={{ base: '300', md: '500' }}>
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Color</Table.Th>
                      <Table.Th>Hex</Table.Th>
                      <Table.Th>RGB</Table.Th>
                    </Table.Tr>
                  </Table.Thead>

                  <Table.Tbody>
                    {palettePost.colors.map((color) => (
                      <Table.Tr key={crypto.randomUUID()}>
                        <Table.Td>
                          <ColorSwatch color={color} />
                        </Table.Td>

                        <Table.Td>{color}</Table.Td>

                        <Table.Td>{hexToRgb(color)}</Table.Td>
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
