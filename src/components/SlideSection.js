// SlideSectionWithTyping.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';
import Typewriter from 'typewriter-effect';
import { getFontSize } from '../utility/fontsize';

const Wrapper = styled(motion.div)`
  margin:100px auto;
  padding: 24px;
  background: #ffffff;
  border-radius: 12px;
  font-family : Pretendard-Regular;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  height : 600px;
  width :90%;

`;

const Title = styled.h2`
  font-size: ${() => getFontSize(22)}px;
  margin-bottom: 12px;
  color: #222;
`;

const TypingBox = styled.div`
  font-size: ${() => getFontSize(16)}px;
  line-height: 1.6;
  color: #444;
  min-height: 80px;
`;

const SlideSectionWithTyping = ({ title, text }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <Wrapper
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {title && <Title>{title}</Title>}
      <TypingBox>
        {inView && (
          <Typewriter
            options={{
              delay: 35,
              cursor: '_',
              skipAddStyles: true,
            }}
            onInit={(typewriter) => {
              typewriter.typeString(text).start();
            }}
          />
        )}
      </TypingBox>
    </Wrapper>
  );
};

export default SlideSectionWithTyping;
