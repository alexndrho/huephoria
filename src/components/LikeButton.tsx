import { Button, ButtonProps } from '@mantine/core';
import { PiHeart, PiHeartFill } from 'react-icons/pi';

type ButtonType = ButtonProps & React.ComponentPropsWithoutRef<'button'>;

interface LikeButtonProps extends ButtonType {
  likes: number;
  userLike: boolean;
}

function LikeButton({ likes, userLike, ...props }: LikeButtonProps) {
  return (
    <Button
      variant="default"
      c={userLike ? 'red.6' : ''}
      leftSection={
        userLike ? <PiHeartFill fontSize={20} /> : <PiHeart fontSize={20} />
      }
      {...props}
    >
      {likes}
    </Button>
  );
}

export default LikeButton;
export type { LikeButtonProps };
