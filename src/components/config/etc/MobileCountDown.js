import { useState, useEffect } from "react";
import styled from 'styled-components';
import { Row } from "../../../common/Row";

const Container = styled.div`
    color : #fff;

`

const MobileCountDown = ({ targetHour = 0, targetMinute = 0, targetSecond = 0, Furture }) => {

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    function calculateTimeLeft() {
        const now = new Date();

        const diff = Furture - now;

        if (diff <= 0) {
            return { hours: 0, minutes: 0, seconds: 0 };
        }

        return {
            hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((diff / (1000 * 60)) % 60),
            seconds: Math.floor((diff / 1000) % 60),
        };
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (

        <Container>
            <Row>
                <div>남은 시간</div>
                <div style={{ paddingLeft: 5 }}>{`${timeLeft.hours}시간 ${timeLeft.minutes}분 ${timeLeft.seconds}초`}</div>
            </Row>

        </Container>
    );
};

export default MobileCountDown;
