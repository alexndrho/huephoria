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

function InvalidActionCode() {
  return (
    <Container>
      <Flex direction="column" justify="center" align="center" h="100vh">
        <Box maw={500}>
          <Title ta="center" mb="lg">
            Invalid or expired link
          </Title>

          <Text c="dimmed" mb="lg" size="lg" ta="center">
            The link you clicked is invalid or has expired. Please request a new
            link and try again.
          </Text>

          <Group justify="center">
            <Button component={Link} to="/" variant="subtle" size="md">
              Take me back to home the page
            </Button>
          </Group>
        </Box>
      </Flex>
    </Container>
  );
}

export default InvalidActionCode;
