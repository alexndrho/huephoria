import {
  Anchor,
  Button,
  Grid,
  Group,
  Skeleton,
  Text,
  Title,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCountFromServer } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';
import AppContainer from '../layouts/AppContainer';
import PaletteBar from '../components/PaletteBar';
import LikeButton from '../components/LikeButton';
import { auth, palettesCollectionRef } from '../config/firebase';
import {
  POST_PER_ROW,
  didUserLike,
  getInitialPalettePosts,
  getMorePalettePosts,
  likePalettePost,
} from '../services/palettePost';
import IPalettePost from '../types/IPalettePost';
import { useDebouncedCallback, useDisclosure } from '@mantine/hooks';
import LoginWarningModal from '../components/LoginWarningModal';

function Home() {
  const [palettePosts, setPalettePosts] = useState<IPalettePost[]>([]);
  const [totalPalettePosts, setTotalPalettePosts] = useState(0);
  const [
    openedLoginWarning,
    { open: openLoginWarning, close: closeLoginWarning },
  ] = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    getInitialPalettePosts()
      .then(async (posts) => {
        setPalettePosts(posts);

        const snapshot = await getCountFromServer(palettesCollectionRef);
        setTotalPalettePosts(snapshot.data().count);

        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error(error);
      });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        !isLoading &&
        palettePosts.length &&
        totalPalettePosts > palettePosts.length &&
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 100
      ) {
        setIsLoading(true);

        getMorePalettePosts(palettePosts[palettePosts.length - 1])
          .then((posts) => {
            setPalettePosts((prev) => [...prev, ...posts]);
            setIsLoading(false);
          })
          .catch((error) => {
            setIsLoading(false);
            console.error(error);
          });
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isLoading, palettePosts, totalPalettePosts]);

  const serverLike = useDebouncedCallback(async (id: string) => {
    const userLike = palettePosts.find((post) => post.id === id)?.userLike;
    if (userLike === undefined) return;

    const didServerLike = await didUserLike(id);
    if (userLike === didServerLike) return;

    await likePalettePost(id);
  }, 600);

  const handleLike = (id: string) => {
    const user = auth.currentUser;
    if (!user) {
      openLoginWarning();
      return;
    }

    setPalettePosts((prev) =>
      prev.map((post) => {
        if (post.id === id) {
          return {
            ...post,
            likes: post.likes + (post.userLike ? -1 : 1),
            userLike: !post.userLike,
          };
        }

        return post;
      })
    );

    serverLike(id);
  };

  return (
    <AppContainer>
      <LoginWarningModal
        opened={openedLoginWarning}
        onClose={closeLoginWarning}
      />

      <Group mb="xl" justify="space-between">
        <Title>Home</Title>

        <Button component={Link} to="/palette/submit">
          Submit
        </Button>
      </Group>

      <Grid gutter="xl">
        {palettePosts.map((post) => (
          <Grid.Col key={post.id} span={{ base: 12, xs: 6, md: 4, lg: 3 }}>
            <Anchor component={Link} to={`/palette/${post.id}`} c="gray">
              <Title order={2} size="h3" lh={1.25} lineClamp={1}>
                {post.title}
              </Title>
              <Text lh={1.25} lineClamp={1}>
                By {post.author}
              </Text>
            </Anchor>

            <PaletteBar mt="md" palette={post.colors} />

            <Group mt="xs" justify="space-between">
              <LikeButton
                userLike={post.userLike}
                likes={post.likes}
                size="xs"
                onClick={() => handleLike(post.id)}
              />

              <Text size="sm">
                {formatDistanceToNow(post.createdAt.toDate())}
              </Text>
            </Group>
          </Grid.Col>
        ))}
      </Grid>

      {isLoading && <Loading />}
    </AppContainer>
  );
}

function Loading() {
  return (
    <Grid mt="xl" gutter="xl">
      {Array.from({ length: POST_PER_ROW }).map((_, index) => (
        <Grid.Col key={index} span={{ base: 12, xs: 6, md: 4, lg: 3 }}>
          <Skeleton h="lg" />
          <Skeleton mt="xs" h="md" w="40%" />

          <Skeleton mt="md" radius="lg" style={{ aspectRatio: '9/12' }} />

          <Group mt="xs" justify="space-between">
            <Skeleton h="lg" w="30%" />
            <Skeleton h="lg" w="30%" />
          </Group>
        </Grid.Col>
      ))}
    </Grid>
  );
}

export default Home;
