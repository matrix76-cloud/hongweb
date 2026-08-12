// 📄 ShareButton.jsx (text + url 분리형 리팩)
import React from 'react';

const ShareButton = ({
  label = "공유하기",
  text = "",
  url = "",
  onClick,
  children,
  className = "",
  style = {},
}) => {
  const handleClick = () => {
    if (onClick) onClick();

    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          command: 'share',
          text,
          url,
        })
      );
    }
  };

  return (
    <div className={className} style={style} onClick={handleClick}>
      {children || label}
    </div>
  );
};

export default ShareButton;