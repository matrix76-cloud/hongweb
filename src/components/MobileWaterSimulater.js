
import { useEffect, useState, useRef } from 'react';

export const useSimulateWaterChart = (currentcontent) => {
    const [simulatedChart, setSimulatedChart] = useState(
        Array.from({ length: 25 }, (_, i) => ({ time: i, cumulativeAmount: null }))
    );
    const simIndexRef = useRef(0);
    const currentValueRef = useRef(800); // 시작값 높임

    useEffect(() => {
        if (currentcontent === 0) {
            const interval = setInterval(() => {
                simIndexRef.current += 1;
                const index = simIndexRef.current;

                if (index >= 25) {
                    // 리셋
                    simIndexRef.current = 0;
                    currentValueRef.current = 800;
                    setSimulatedChart(
                        Array.from({ length: 25 }, (_, i) => ({ time: i, cumulativeAmount: null }))
                    );
                    return;
                }

                const randomFluctuation = Math.floor(Math.random() * 200) - 100; // -100~+99
                const nextValue = Math.max(currentValueRef.current + randomFluctuation, 500);

                currentValueRef.current = nextValue;

                setSimulatedChart((prev) => {
                    const updated = [...prev];
                    updated[index] = {
                        ...updated[index],
                        cumulativeAmount: nextValue,
                    };
                    return updated;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [currentcontent]);

    return simulatedChart;
};