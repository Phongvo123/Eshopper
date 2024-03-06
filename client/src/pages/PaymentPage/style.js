import styled from "styled-components";
import { Radio } from "antd";
export const Lable = styled.span`
  color: rgb(56, 56, 61);
  font-weight: 700;
  font-size: 18px;
  line-height: 24px;
  margin: 0px;
`;

export const WrapperRadio = styled(Radio.Group)`
  margin-top: 6px;
  background: rgb(240, 248, 255);
  border: 1px solid rgb(194, 225, 255);
  width: 500px;
  border-radius: 4px;
  height: 100px;
  padding: 16px;
  font-weight: normal;
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
`;
export const WrapperInfo = styled.div`
  padding: 17px 20px;
  border-bottom: 1px solid #f5f5f5;
  background: #fff;
  border-top-right-radius: 6px;
  border-top-left-radius: 6px;
  width: 100%;
`;
export const WrapperInfoAddress = styled.div`
background: #fff;
padding: 17px 20px;
marginBottom: "16px",
border-bottom-right-radius: 6px;
border-bottom-left-radius: 6px;
`;
export const WrapperTotal = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 17px 20px;
  background: #fff;
  border-bottom-right-radius: 6px;
  border-bottom-left-radius: 6px;
`;
