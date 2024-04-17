import { Button, Group, Modal, Text } from '@mantine/core';
import { Link } from 'react-router-dom';

interface LoginWarningModalProps {
  opened: boolean;
  onClose: () => void;
}

function LoginWarningModal({ opened, onClose }: LoginWarningModalProps) {
  return (
    <Modal title="Login Required" opened={opened} onClose={onClose}>
      <Text>
        You must login first to access this feature. Please login or create an
        account.
      </Text>

      <Group justify="flex-end">
        <Button variant="default" onClick={onClose}>
          Cancel
        </Button>

        <Button component={Link} to="/login" onClick={onClose}>
          Login
        </Button>
      </Group>
    </Modal>
  );
}

export default LoginWarningModal;
