import styled from "styled-components";
import { getFontSize } from '../utility/fontsize';

export const LoadingText = styled.div`
  font-size: ${() => `${getFontSize(14)}px !important`};
  color: #666;
  text-align: center;
`;