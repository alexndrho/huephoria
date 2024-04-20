import {
  Box,
  Button,
  Container,
  Flex,
  Group,
  Text,
  Title,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import AppContainer from '../layouts/AppContainer';

function NotFoundWithContainer() {
  return (
    <AppContainer>
      <Container>
        <Flex direction="column" justify="center" align="center" h="600">
          <Box maw={600}>
            <Title component="p" mb="lg" ta="center">
              404
            </Title>

            <Title ta="center" mb="lg">
              This page isn't available right now
            </Title>

            <Text c="dimmed" mb="lg" size="lg" ta="center">
              This may be because of a broken link, the page has been removed,
              or the address is misspelled.
            </Text>

            <Group justify="center">
              <Button component={Link} to="/" variant="subtle" size="md">
                Take me back to the home page
              </Button>
            </Group>
          </Box>
        </Flex>
      </Container>
    </AppContainer>
  );
}

export default NotFoundWithContainer;
