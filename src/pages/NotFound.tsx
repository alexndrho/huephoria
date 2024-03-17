import {
  Title,
  Text,
  Button,
  Container,
  Group,
  Flex,
  Box,
} from '@mantine/core';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <Container>
      <Flex direction="column" justify="center" align="center" h="100vh">
        <Box maw={500}>
          <Title component="p" mb="lg" ta="center">
            404
          </Title>

          <Title ta="center" mb="lg">
            You have found a secret place.
          </Title>

          <Text c="dimmed" mb="lg" size="lg" ta="center">
            Unfortunately, this is only a 404 page. You may have mistyped the
            address, or the page has been moved to another URL.
          </Text>

          <Group justify="center">
            <Button component={Link} to="/" variant="subtle" size="md">
              Take me back to home page
            </Button>
          </Group>
        </Box>
      </Flex>
    </Container>
  );
}

export default NotFound;
