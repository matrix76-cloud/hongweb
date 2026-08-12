import * as React from "react";
import PropTypes from "prop-types";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useSpring, animated } from "@react-spring/web";
import styled from "styled-components";
import { AiFillCloseCircle } from "react-icons/ai";
import { IoIosCloseCircleOutline } from "react-icons/io";

import "../../screen/css/common.css";

const Fade = React.forwardRef(function Fade(props, ref) {
  const {
    children,
    in: open,
    onClick,
    onEnter,
    onExited,
    ownerState,
    ...other
  } = props;
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter(null, true);
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited(null, true);
      }
    },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {React.cloneElement(children, { onClick })}
    </animated.div>
  );
});

Fade.propTypes = {
  children: PropTypes.element.isRequired,
  in: PropTypes.bool,
  onClick: PropTypes.any,
  onEnter: PropTypes.func,
  onExited: PropTypes.func,
  ownerState: PropTypes.any,
};

const style = {
  position: "absolute",
  top: "53%",
  left: "50%",
  height: "640px",
  transform: "translate(-50%, -50%)",
  width: "500px",
};
const IconCloseView = styled.div`
  display: flex;
  justify-content: flex-end;
  position: "absolute";
  align-items:center;
  top:100%;
  margin-left: 30px;
  margin-right:30px;
`;

const Row = styled.div`
  display: flex;
  padding-left: 10px;
  height: 35px;
  align-items: center;
  background-color: #828282;
  margin: 5px;
`;

export default function PcAdvertisePopup({type, callback, image, top, left, height, width }) {
  const [open, setOpen] = React.useState(true);

  const handleTodayClose1 = () => {
    setOpen(false);
    let date = Date.now();
    window.localStorage.setItem("hongpopup1", date);

    callback();
  };

  const handleTodayClose2 = () => {
    setOpen(false);
    let date = Date.now();
    window.localStorage.setItem("hongpopup2", date);

    callback();
  };

  const handleTodayClose3 = () => {
    setOpen(false);
    let date = Date.now();
    window.localStorage.setItem("hongpopup3", date);

    callback();
  };

  const handleClose = () => {
    setOpen(false);
    callback();
  };

  const [refresh, setRefresh] = React.useState(1);

  React.useEffect(() => {

  }, [refresh]);

  return (
    <div>
      <Modal
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            TransitionComponent: Fade,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={[style, style.top={top},style.left={left}, style.height={height}, style.width={width}] }>
            <img src={image} style={{ width: "100%", height: "90%" }} />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                backgroundColor: "white",
                height:30,
  
              }}
            >
              {
                type ==1 && <IconCloseView onClick={handleTodayClose1}>
                <IoIosCloseCircleOutline size={20} />
                <div style={{paddingLeft:5, fontSize:14}}>오늘 그만보기</div>
              </IconCloseView>
              }
   
              {
                type ==2 && <IconCloseView onClick={handleTodayClose2}>
                <IoIosCloseCircleOutline size={20} />
                <div style={{paddingLeft:5, fontSize:14}}>오늘 그만보기</div>
              </IconCloseView>
              }

              {
                type ==3 && <IconCloseView onClick={handleTodayClose3}>
                <IoIosCloseCircleOutline size={20} />
                <div style={{paddingLeft:5, fontSize:14}}>오늘 그만보기</div>
              </IconCloseView>
              }
              <IconCloseView onClick={handleClose}>
                <IoIosCloseCircleOutline size={20} />
                <div style={{ paddingLeft: 5, fontSize:14 }}>닫기</div>
              </IconCloseView>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
