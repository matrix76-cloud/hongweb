import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { LazyLoadImage } from "react-lazy-load-image-component";

const Container = styled.div`
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;


`

const MainImageex = ({ src, containerStyle,width, height }) => {
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  return (
    <Container width={width}>
      <div style={containerStyle}>
        <LazyLoadImage
          src={src}
          effect="opacity"
          width={width}
          height={height}
          style={{borderRadius: 10}}
        />
      </div>


    </Container>

  );
};



export default MainImageex;
