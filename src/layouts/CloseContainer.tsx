import { ActionIcon, Container, Group, Title, Tooltip } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';
import { TbX } from 'react-icons/tb';

interface CloseContainerProps {
  title: string;
  children: React.ReactNode;
}

function CloseContainer({ title, children }: CloseContainerProps) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Container size="lg" py="lg">
      <Group mb={50} justify="space-between">
        <Title>{title}</Title>

        <Tooltip label="Close" position="bottom">
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
      </Group>

      {children}
    </Container>
  );
}

export default CloseContainer;
