import styled from 'styled-components';
import { imageDB } from '../utility/imageData';
import { BetweenRow, Row } from '../common/Row';
import { useNavigate } from 'react-router-dom';
import { LIFEMENU } from '../utility/life';
import { useContext, useEffect, useState } from 'react';
import { Readuserbyusersid, Update_watergoalbyusersid } from '../service/UserService';
import { ReadCOURAGETByIndividually, ReadWaterByIndividually } from '../service/WaterService';
import { UserContext } from '../context/User';
import { getFontSize, isIOS } from '../utility/fontsize';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, defs, linearGradient, stop, BarChart, Bar, Cell, AreaChart } from "recharts";
import { getHour } from '../utility/date';
import { Column } from '../common/Column';
import { useSimulateWaterChart } from './MobileWaterSimulater';


const ChartLayerBox = styled.div`
    background: #1058ff;
    padding: 20px 0px 120px;

`

 const WaterCard = styled.div`
  width: 80%;

  margin: 20px auto;
  padding: 24px 20px;
  border-radius: 16px;
  background-color: #1449e6;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;



  const WaterTitle = styled.div`
  font-size: ${() => getFontSize(20)}px;
  font-weight: 700;
  color: #fff;
  font-family: ${() => isIOS() ? `'Pretendard-SemiBold'` : `'Pretendard-Bold'`};
`;

 const WaterValue = styled.div`
  font-size: ${() => getFontSize(30)}px;
  font-weight: 800;
  color: #fff;
`;

 const WaterPercent = styled.span`
  font-size: ${() => getFontSize(18)}px;
  font-weight: 600;
  color: #fff;
  margin-left: 8px;
`;

 const WaterDesc = styled.div`
  font-size: ${() => getFontSize(15)}px;
  color: #fff;
  line-height: 1.4;
  text-align: center;
`;

 const CTAButton = styled.button`
  width: 100%;
  background: #3b82f6;
  color: #fff;
  font-size: ${() => getFontSize(16)}px;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  padding: 14px 0;
  cursor: pointer;

  &:hover {
    background: #2563eb;
  }
`;

 const WaterIntroWrapper = styled.div`
  width: 90%;
  margin: 0px auto 10px auto;
  text-align: center;
`;

 const WaterIntroTitle = styled.div`
  font-family: 'Pretendard-SemiBold';
  font-size: ${() => getFontSize(17)}px;
  color: #2C2C2C;
  line-height: 1.8;
  text-align: center;
  white-space: pre-line;
  letter-spacing: -0.5px;
`;

 const ChartWrapper = styled.div`
  width: 90%;
  margin: 0 auto;
`;

const WaterIcon = styled.img`
  width: 40px;
  height: 40px;
  margin-bottom: 14px;
  animation: drip 1.8s ease-in-out infinite;

  @keyframes drip {
    0% {
      transform: translateY(-10px) scale(0.8);
      opacity: 0.3;
    }
    50% {
      transform: translateY(5px) scale(1.1);
      opacity: 1;
    }
    100% {
      transform: translateY(0px) scale(1);
      opacity: 0.3;
    }
  }
`;


const MobileWaterCard =() =>  {

    const { dispatch, user } = useContext(UserContext);

    const [totalcontent, setTotalcontent] = useState(0);
    const [bottleitems, setBottleitems] = useState(0);
    const [currentcontent, setCurrentcontent] = useState(0);
    const [initpercentage, setInitpercentage] = useState(0);
    const [refresh, setRefresh] = useState(-1);
    const [waterchartdayitems, setWaterchartdayitems] = useState([]);
  const [wateritems, setWateritems] = useState([]);

  
    
    const navigate = useNavigate();
    
    const _handlemenu= (menu)=>{

        navigate("/Mobilecommunitycontent", { state: { name: menu, search: "" } });
    }

    async function FetchData() {
        const USERS_ID = user.USERS_ID;

        const useritems = await Readuserbyusersid({ USERS_ID });

        if (useritems.WATERGOAL != undefined) {

            setTotalcontent(parseInt(useritems.WATERGOAL));

        } else {
            const WATERGOAL = 2000;

            await Update_watergoalbyusersid({ WATERGOAL, USERS_ID });
            setTotalcontent(parseInt(2000));
        }

        const items = await ReadCOURAGETByIndividually({ USERS_ID });

        if (items != -1) {
            setBottleitems(items);
        } 
        const wateritems = await ReadWaterByIndividually({ USERS_ID });

        let currentcontentTmp = 0;
        if (wateritems != -1) {


            let initpercentTmp = 0;
            wateritems.map((data) => {
                currentcontentTmp += data.CONTENT;

            })


            setCurrentcontent(currentcontentTmp);
            let percent = 0;
            if (useritems.WATERGOAL != undefined) {
                percent = currentcontentTmp / parseInt(useritems.WATERGOAL);

            } else {
                percent = 0;
            }



            if (percent > 0.9) {
                initpercentTmp += (percent * 4 + 5);
            }
            else if (percent > 0.6 && percent <= 0.9) {
                initpercentTmp += (percent * 2 + 2);
            } else {
                initpercentTmp += (percent * 1.5 + 1.2);
            }


            console.log("init percent Tmp", initpercentTmp, percent);

            //  setInitpercent(initpercentTmp);
            setInitpercentage(parseInt(percent * 100));


            //  setLoading(false);
            setRefresh((refresh) => refresh + 1);
        }

    }
    const simulatedChart = useSimulateWaterChart(currentcontent);
    async function DailyFetchData() {
  
    

      let waterchartdailydata = [{ time: 0, amount: null },
        { time: 1, amount: null },
        { time: 2, amount: null },
        { time: 3, amount: null },
        { time: 4, amount: null },
        { time: 5, amount: null },
        { time: 6, amount: null },
        { time: 7, amount: null },
        { time: 8, amount: null },
        { time: 9, amount: null },
        { time: 10, amount: null },
        { time: 11, amount: null },
        { time: 12, amount: null },
        { time: 13, amount: null },
        { time: 14, amount: null },
        { time: 15, amount: null },
        { time: 16, amount: null },
        { time: 17, amount: null },
        { time: 18, amount: null },
        { time: 19, amount: null },
        { time: 20, amount: null },
        { time: 21, amount: null },
        { time: 22, amount: null },
        { time: 23, amount: null },
        { time: 24, amount: null }]
  
  
  
      let USERS_ID = "";

        USERS_ID = user.USERS_ID;
     
  
  
  
      const useritems = await Readuserbyusersid({ USERS_ID });
  
      setTotalcontent(parseInt(useritems.WATERGOAL));
     
      const wateritemsTmp = await ReadWaterByIndividually({ USERS_ID });
      if (wateritemsTmp != -1) {
        const wateritemssortTmp = [...wateritemsTmp].sort((a, b) => b.CONTENTDATE - a.CONTENTDATE);
        setWateritems(wateritemssortTmp);
      } else {
        setWateritems([]);
        setWaterchartdayitems([]);
      
      }
      if(wateritemsTmp != -1) {
       
        let currentcontentTmp = 0;
  
        wateritemsTmp.map((data) => {
          currentcontentTmp += data.CONTENT;
        })
  
        wateritemsTmp.map((subdata) => {
          const FindIndex = waterchartdailydata.findIndex(x => x.time == (getHour(subdata.CREATEDT.toDate())));
          if (FindIndex != -1) {
            waterchartdailydata[FindIndex].amount += subdata.CONTENT;
          }
        })
  
        let cumulativeSum = 0;
        const updatedData = waterchartdailydata.map(item => {
          if (item.amount !== null) {
            cumulativeSum += item.amount;
          }
          return { ...item, cumulativeAmount: cumulativeSum };
        });
        const lastIndex = waterchartdailydata.reduceRight((acc, item, index) => (item.amount !== null && acc === -1 ? index : acc), -1);
        for (let i = lastIndex +1; i < 25; i++){
          updatedData[i].cumulativeAmount = null;
        }
    
        setWaterchartdayitems(updatedData);

        setRefresh((refresh) => refresh + 1);
  
      }
     
    }
  
  
  
const WateDayilyIntakeChart = () => {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart
        data={currentcontent === 0 ? simulatedChart : waterchartdayitems}
        margin={{ top: 10, right: 20, bottom: 0, left: -20 }} // 왼쪽 여백 확보
      >
        <defs>
          <linearGradient id="waterArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.6} />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.05} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />

        <XAxis 
          dataKey="time" 
          tick={{ fill: "#3b82f6", fontSize: getFontSize(10) }} 
          tickLine={false} 
          axisLine={false}
        />
        <YAxis 
          domain={[0, totalcontent + 200]} 
          tick={{ fill: "#3b82f6", fontSize: getFontSize(10) }} 
          tickLine={false} 
          axisLine={false}
        />

        <Area
          type="monotone"
          dataKey="cumulativeAmount"
          stroke="none"
          fill="url(#waterArea)"
          isAnimationActive={false}
        />

        <Line
          type="monotone"
          dataKey="cumulativeAmount"
          stroke="#3b82f6"
          strokeWidth={3}
          dot={{ r: 3, fill: "#3b82f6" }}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};



    useEffect(() => {
        DailyFetchData();
        FetchData();  
        
    }, [])
    
    useEffect(() => {
      setWaterchartdayitems(waterchartdayitems);
      setWateritems(wateritems);
    },[refresh])
    

    return (
      <>
        <WaterIntroWrapper>
            <WaterIntroTitle>
                건강한 일상을 위해<br />
                오늘 마신 물을 관리해보세요
            </WaterIntroTitle>
        </WaterIntroWrapper>



        <WaterCard>
          <Column style={{ alignItems: "center", gap: 8 }}>
            <WaterIcon src={imageDB.watercard} />
            <WaterTitle>오늘 마신 물</WaterTitle>
            <WaterValue>
              {currentcontent}ml
              <WaterPercent>/ {initpercentage}%</WaterPercent>
            </WaterValue>
          </Column>

          {
            currentcontent != 0 && <WateDayilyIntakeChart />
          }
         
 

          <WaterDesc> 하루 2000ml, <br />
            한 잔부터 시작해볼까요?</WaterDesc>

          <CTAButton onClick={() => _handlemenu(LIFEMENU.WATER)}>관리하러 가기</CTAButton>
        </WaterCard>
        




        
      
      </>


  );

}

export default MobileWaterCard;