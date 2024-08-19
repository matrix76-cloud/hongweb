import styled from 'styled-components';

export const Column = styled.div`
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  width :${({width}) => width};
  padding :${({padding}) => padding};
  margin :${({margin}) => margin};

`
export const BetweenColumn = styled.div`
  display:flex;
  flex-direction:row;
  justify-content:center;
  align-items:space-between;
  width :${({width}) => width};
  padding :${({padding}) => padding};
`

export const FlexstartColumn = styled.div`
  display:flex;
  flex-direction:column;
  align-items:flex-start;
  justify-content:center;
  width :${({width}) => width};
  padding :${({padding}) => padding};

`


export const FlexEndColumn = styled.div`
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:flex-end;
  width :${({width}) => width};
  padding :${({padding}) => padding};
`

