import {
  AspectRatio,
  Box,
  BoxProps,
  CopyButton,
  Text,
  UnstyledButton,
  isLightColor,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import classes from '../styles/PaletteBar.module.css';
import { FaClipboardCheck } from 'react-icons/fa';

interface PaletteBarProps extends BoxProps {
  palette: string[];
}

function PaletteBar({ palette, ...props }: PaletteBarProps) {
  return (
    <AspectRatio ratio={9 / 12} {...props}>
      <Box className={classes.paletteBar}>
        {palette.map((color) => (
          <CopyButton key={crypto.randomUUID()} value={color} timeout={2000}>
            {({ copied, copy }) => (
              <UnstyledButton
                className={classes.paletteBar__bar}
                bg={color}
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
                <Text
                  size="xl"
                  fw="bold"
                  c={isLightColor(color) ? 'dark' : 'gray'}
                >
                  {copied ? 'Copied' : color}
                </Text>
              </UnstyledButton>
            )}
          </CopyButton>
        ))}
      </Box>
    </AspectRatio>
  );
}

export default PaletteBar;
