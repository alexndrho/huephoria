import {
  Flex,
  Text,
  Tooltip,
  TooltipProps,
  UnstyledButton,
} from '@mantine/core';
import { Link, LinkProps } from 'react-router-dom';
import { IconType } from 'react-icons';
import classes from '../styles/NavLinkIcon.module.css';

interface NavLinkIconProps extends LinkProps {
  icon: IconType;
  activeIcon: IconType;
  label: string;
  labelPosition?: TooltipProps['position'];
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
  ...props
}: NavLinkIconProps) {
  const ResultIcon = active ? (
    <ActiveIcon fontSize="1.75rem" />
  ) : (
    <Icon fontSize="1.75rem" />
  );

  return visibleLabel ? (
    <UnstyledButton w={50} h={50} component={Link} to={to} {...props}>
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
        {...props}
      >
        {ResultIcon}
      </UnstyledButton>
    </Tooltip>
  );
}

export default NavLinkIcon;
export type { NavLinkIconProps };
