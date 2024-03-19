import {
  Flex,
  Text,
  Tooltip,
  TooltipProps,
  UnstyledButton,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import { IconType } from 'react-icons';
import classes from '../styles/NavLinkIcon.module.css';

interface NavLinkIconProps {
  icon: IconType;
  activeIcon: IconType;
  label: string;
  labelPosition?: TooltipProps['position'];
  to: string;
  active?: boolean;
  visibleLabel?: boolean;
}

function NavLinkIcon({
  icon: Icon,
  activeIcon: ActiveIcon,
  label,
  labelPosition,
  to,
  active,
  visibleLabel,
}: NavLinkIconProps) {
  const ResultIcon = active ? (
    <ActiveIcon fontSize="1.75rem" />
  ) : (
    <Icon fontSize="1.75rem" />
  );

  return visibleLabel ? (
    <UnstyledButton w={50} h={50} component={Link} to={to}>
      <Flex c={active ? 'green' : ''} direction="column" align="center">
        {ResultIcon}
        <Text size="xs" lineClamp={1}>
          {label}
        </Text>
      </Flex>
    </UnstyledButton>
  ) : (
    <Tooltip label={label} position={labelPosition}>
      <UnstyledButton
        className={classes.navLinkIcon}
        component={Link}
        to={to}
        data-active={active || undefined}
      >
        {ResultIcon}
      </UnstyledButton>
    </Tooltip>
  );
}

export default NavLinkIcon;
export type { NavLinkIconProps };
