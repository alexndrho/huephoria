import {
  ActionIcon,
  AspectRatio,
  Box,
  Button,
  ColorPicker,
  ColorSwatch,
  Flex,
  Group,
  Popover,
  Text,
  TextInput,
  UnstyledButton,
} from '@mantine/core';
import { ReactNode, useState } from 'react';
import { TbHash, TbPlus, TbTrash } from 'react-icons/tb';
import { isHexColor } from '../helpers/color';
import classes from '../styles/PaletteBarEdit.module.css';

interface PaletteBarEditProps {
  w?: string | number;
  h?: string | number;
  palette: string[];
  setPalette: (setter: (prevValue: string[]) => string[]) => void;
  error: ReactNode;
}

function PaletteBarEdit({
  w,
  h,
  palette,
  setPalette,
  error,
}: PaletteBarEditProps) {
  const [openedColor, setOpenedColor] = useState(false);
  const [color, setColor] = useState('#000000');
  const [colorError, setColorError] = useState('');

  const addColor = (color: string) => {
    if (!isHexColor(color)) {
      setColorError('Invalid color');
      return;
    }

    setOpenedColor(false);
    setColor('#000000');
    setColorError('');
    setPalette((prevValue) => [...prevValue, color]);
  };

  const deleteColor = (index: number) => {
    setPalette((prevValue) => prevValue.filter((_, i) => i !== index));
  };

  const setColorInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setColor('#' + event.currentTarget.value);
    setColorError('');
  };

  const removeHash = (color: string) => color.replace(/^#/, '');

  return (
    <Box>
      <AspectRatio w={w} h={h} ratio={9 / 16}>
        <Box
          className={`${classes.paletteBar} ${
            error ? classes['paletteBar--error'] : ''
          }`}
        >
          {palette.map((color, index) => (
            <Flex
              key={crypto.randomUUID()}
              className={classes.paletteBar__bar}
              bg={color}
              c="red.8"
              justify="end"
            >
              <ActionIcon color="red.7" mt="xs" mr="xs">
                <TbTrash onClick={() => deleteColor(index)} />
              </ActionIcon>
            </Flex>
          ))}

          {palette.length < 6 && (
            <Popover
              opened={openedColor}
              onChange={setOpenedColor}
              position="right"
            >
              <Popover.Target>
                <UnstyledButton
                  w="100%"
                  h="100%"
                  bg="dark.6"
                  className={`${classes.paletteBar__bar} ${classes['paletteBar__bar--add']}`}
                  onClick={() => setOpenedColor((o) => !o)}
                >
                  <TbPlus fontSize="1.75rem" />
                </UnstyledButton>
              </Popover.Target>

              <Popover.Dropdown>
                <ColorPicker format="hex" value={color} onChange={setColor} />

                <Group mt="xs" grow>
                  <Box>
                    <TextInput
                      maxLength={6}
                      leftSection={<TbHash />}
                      placeholder="Enter color in hex format"
                      value={removeHash(color)}
                      onChange={setColorInput}
                      error={colorError}
                    />
                  </Box>

                  <ColorSwatch color={color} />
                </Group>

                <Group mt="sm" justify="end">
                  <Button onClick={() => addColor(color)}>Add</Button>
                </Group>
              </Popover.Dropdown>
            </Popover>
          )}
        </Box>
      </AspectRatio>

      <Group justify="center">{error && <Text c="red.7">{error}</Text>}</Group>
    </Box>
  );
}

export default PaletteBarEdit;
export type { PaletteBarEditProps };
