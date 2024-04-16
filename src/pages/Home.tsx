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
import AppContainer from '../components/AppContainer';
import PaletteBar from '../components/PaletteBar';
import { palettesCollectionRef } from '../config/firebase';
import {
  POST_PER_ROW,
  getInitialPalettePosts,
  getMorePalettePosts,
} from '../services/palettePost';
// import { PiHeart } from 'react-icons/pi';
import IPalettePost from '../types/IPalettePost';

function Home() {
  const [palettePosts, setPalettePosts] = useState<IPalettePost[]>([]);
  const [totalPalettePosts, setTotalPalettePosts] = useState(0);
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

  return (
    <AppContainer>
      <Group mb="xl" justify="space-between">
        <Title>Home</Title>

        <Button component={Link} to="/palette/submit">
          Submit
        </Button>
      </Group>

      <Grid gutter="xl">
        {palettePosts.map((post) => (
          <Grid.Col
            key={crypto.randomUUID()}
            span={{ base: 12, xs: 6, md: 4, lg: 3 }}
          >
            <Anchor component={Link} to={`/palette/${post.id}`} c="gray">
              <Title order={2} size="h3" lh={1.25} lineClamp={1}>
                {post.title}
              </Title>
              <Text lh={1.25} lineClamp={1}>
                By {post.author}
              </Text>
            </Anchor>

            <PaletteBar mt="md" palette={post.colors} />

            <Group mt="md" justify="space-between">
              {/* <Button
                variant="default"
                leftSection={<PiHeart fontSize={20} />}
              ></Button> */}

              <Text size="sm">
                {formatDistanceToNow(post.createdAt.toDate(), {
                  addSuffix: true,
                })}
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
      {Array.from({ length: POST_PER_ROW }).map(() => (
        <Grid.Col
          key={crypto.randomUUID()}
          span={{ base: 12, xs: 6, md: 4, lg: 3 }}
        >
          <Skeleton h="lg" />
          <Skeleton mt="xs" h="md" w="40%" />

          <Skeleton mt="md" radius="lg" style={{ aspectRatio: '9/12' }} />

          <Group justify="space-between">
            <Skeleton mt="md" h="lg" w="30%" />
            <Skeleton mt="md" h="lg" w="30%" />
          </Group>
        </Grid.Col>
      ))}
    </Grid>
  );
}

export default Home;
