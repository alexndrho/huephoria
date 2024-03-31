import {
  AspectRatio,
  AspectRatioProps,
  Box,
  CopyButton,
  Text,
  UnstyledButton,
  isLightColor,
} from '@mantine/core';
import classes from '../styles/PaletteBar.module.css';

interface PaletteBarProps {
  w?: AspectRatioProps['w'];
  h?: AspectRatioProps['h'];
  palette: string[];
}

function PaletteBar({ w, h, palette }: PaletteBarProps) {
  return (
    <AspectRatio w={w} h={h} ratio={9 / 12}>
      <Box className={classes.paletteBar}>
        {palette.map((color, index) => (
          <CopyButton key={index} value={color} timeout={2000}>
            {({ copied, copy }) => (
              <UnstyledButton
                className={classes.paletteBar__bar}
                bg={color}
                onClick={copy}
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
