import { Button, ButtonProps, CopyButton, Tooltip } from '@mantine/core';

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
            onClick={copy}
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
