import {
  ActionIcon,
  Container,
  Group,
  Skeleton,
  Title,
  Tooltip,
} from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';
import AppContainer from './AppContainer';
import { TbX } from 'react-icons/tb';

interface AppCloseContainerProps {
  title?: string;
  children?: React.ReactNode;
}

function AppCloseContainer({ title, children }: AppCloseContainerProps) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <AppContainer>
      <Container px={0} pt="md" pb="xl">
        <Group justify="space-between">
          {title ? <Title>{title}</Title> : <Skeleton w={500} height={35} />}

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
    </AppContainer>
  );
}

export default AppCloseContainer;
export type { AppCloseContainerProps };
