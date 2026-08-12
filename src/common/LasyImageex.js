import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { LazyLoadImage } from "react-lazy-load-image-component";
import { imageDB } from '../utility/imageData';

const Container = styled.div`
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;


`

const LazyImageex = ({ src, containerStyle,width="100" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef();



  return (
    <Container width={width}>
      <div style={containerStyle}>
        <LazyLoadImage
          src={src}
          effect="black-and-white"
          placeholderSrc={imageDB.person}
          width="100%"
          height="100%"
          style={{borderRadius: 10}}
        />
      </div>


    </Container>

  );
};




const LazyTourImageex = ({ src, containerStyle, width = "100" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef();



  return (
    <Container width={width}>
      <div style={containerStyle}>
        <LazyLoadImage
          src={src}
          effect="blur"
          width="100%"
          height="100%"
          style={{ borderRadius: 10 }}
        />
      </div>


    </Container>

  );
};




const LazyFoodImageex = ({ src, containerStyle, width = "100" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef();



  return (
    <Container width={width}>
      <div style={containerStyle}>
        <LazyLoadImage
          src={src}
          effect="blur"
          width="100%"
          height="100%"
          style={{ borderRadius: 10 }}
        />
      </div>


    </Container>

  );
};

export { LazyImageex, LazyTourImageex, LazyFoodImageex };
