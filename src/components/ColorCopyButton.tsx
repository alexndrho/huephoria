import {
  Button,
  ButtonProps,
  CopyButton,
  Text,
  Tooltip,
  isLightColor,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { FaClipboardCheck } from 'react-icons/fa';

interface ColorCopyButtonProps extends ButtonProps {
  color: string;
}

function ColorCopyButton({ color, ...props }: ColorCopyButtonProps) {
  return (
    <CopyButton value={color}>
      {({ copied, copy }) => (
        <Tooltip label={copied ? 'Copied!' : 'Copy color'}>
          <Button
            variant="subtle"
            color="gray"
            size="compact-md"
            {...props}
            onClick={() => {
              copy();
              notifications.show({
                icon: (
                  <Text c={isLightColor(color) ? 'dark' : 'gray'}>
                    <FaClipboardCheck />
                  </Text>
                ),
                title: 'Color copied',
                message: color,
                color: color,
              });
            }}
          >
            {color}
          </Button>
        </Tooltip>
      )}
    </CopyButton>
  );
}

export default ColorCopyButton;
export type { ColorCopyButtonProps };
