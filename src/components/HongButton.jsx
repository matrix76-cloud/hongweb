import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { getFontSize, isIOS } from '../utility/fontsize';
import { COLORS } from '../utility/colors';

// ✅ 버튼 색상 정의
const BUTTON_COLORS = {
  primary: {
    background: COLORS.primary,
    text: '#FFF',
    hover: COLORS.primary,
  },
  secondary: {
    background: '#F0F2F5',
    text: '#333',
    hover: '#E0E0E0',
  },
  outline: {
    background: '#FFFFFF',
    text: COLORS.primary,
    border: COLORS.primary,
    hover: '#FFF0E5',
  },
  disabled: {
    background: '#EDEDED',
    text: '#000',
  },
};

// ✅ 버튼 사이즈 사전
const BUTTON_SIZES = {
  small: {
    height: isIOS() ? '48px' : '43px',
    fontSize: isIOS() ? 15 : 15,
  },
  medium: {
    height: isIOS() ? '56px' : '53px',
    fontSize: isIOS() ? 17 : 17,
  },
  large: {
    height: isIOS() ? '64px' : '61px',
    fontSize: isIOS() ? 19 : 19,
  },
};

const StyledButton = styled.button`
  width: ${({$fullWidth}) => ($fullWidth ? '100%' : 'auto')};
  height: ${({ size }) => BUTTON_SIZES[size]?.height || BUTTON_SIZES.medium.height};
  padding: 0 20px;
  font-size: ${({ size }) => `${getFontSize(BUTTON_SIZES[size]?.fontSize || 16)}px !important`};
  font-family: 'Pretendard-Bold';
  background-color: ${({$variant}) => BUTTON_COLORS[variant]?.background || BUTTON_COLORS.primary.background};
  color: ${({$variant}) => BUTTON_COLORS[variant]?.text || BUTTON_COLORS.primary.text};
  border: ${({$variant}) => $variant === 'outline' ? `1.5px solid ${BUTTON_COLORS.outline.border}` : 'none'};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: ${({$variant}) => $variant === 'outline' ? BUTTON_COLORS.outline.hover : BUTTON_COLORS[variant]?.hover || BUTTON_COLORS.primary.hover};
  }

  &:disabled {
    background-color: ${BUTTON_COLORS.disabled.background};
    color: ${BUTTON_COLORS.disabled.text};
    cursor: not-allowed;
    opacity: 0.6;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const HongButton = ({
  children,
  onClick,
  variant = 'primary',
  size,
  fullWidth = false,
  disabled = false,
  ...rest
}) => {
  return (
    <StyledButton
      onClick={onClick}
      $variant={variant}
      size={size}
      $fullWidth={fullWidth}
      disabled={disabled}
      {...rest}
    >
      {children}
    </StyledButton>
  );
};

HongButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'disabled']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default HongButton;
