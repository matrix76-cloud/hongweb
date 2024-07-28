import styled from 'styled-components';

export const Row = styled.div`
  display:flex;
  flex-direction:row;
  justify-content:center;
  align-items:center;
  width :${({width}) => width};
  padding :${({padding}) => padding};

`
export const BetweenRow = styled.div`
  display:flex;
  flex-direction:row;
  justify-content:space-between;
  align-items:center;
  width :${({width}) => width};
  padding :${({padding}) => padding};
`

export const FlexstartRow = styled.div`
  display:flex;
  flex-direction:row;
  justify-content:flex-start;
  align-items:center;
  width :${({width}) => width};
  padding :${({padding}) => padding};
`

export const FlexEndRow = styled.div`
  display:flex;
  flex-direction:row;
  justify-content:flex-end;
  align-items:center;
  width :${({width}) => width};
  padding :${({padding}) => padding};
`

