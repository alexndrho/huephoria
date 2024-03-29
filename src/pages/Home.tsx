import { Button, Group, Title } from '@mantine/core';
import { Link } from 'react-router-dom';
import AppContainer from '../components/AppContainer';

function Home() {
  return (
    <AppContainer>
      <Group justify="space-between">
        <Title>Home</Title>

        <Button component={Link} to="/palette/submit">
          Submit
        </Button>
      </Group>
    </AppContainer>
  );
}

export default Home;
