import { useState, useEffect, useRef } from "react";


const LazyImage = ({ src, alt, width, height,radius }) => {
    const [isVisible, setIsVisible] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.disconnect(); // 한 번 로드되면 감지 중지
            }
        });

        if (imgRef.current) observer.observe(imgRef.current);

        return () => observer.disconnect();
    }, []);

    return <>
        <picture>

            <source srcSet={isVisible ? src : ""} style={{ width: `${width}px`, height: `${height}px`, borderRadius: `${radius}px` }}  type="image/webp" />

            <img ref={imgRef} src={isVisible ? src : ""} style={{ width: `${width}px`, height: `${height}px`, borderRadius: `${radius}px` }} />

        </picture>

    
    </>
    

};

export default LazyImage;