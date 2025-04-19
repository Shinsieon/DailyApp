import { useEffect, useState } from "react";
import { sendToNative } from "../hooks/useNative";
import { Flex } from "antd";

interface HealthData {
  heartRate: {
    value: number | undefined;
    startDate: string;
    endDate: string;
  };
  stepCount: {
    value: number | undefined;
    startDate: string;
    endDate: string;
  };
}

const HealthCard = () => {
  const [healthData, setHealthData] = useState<HealthData>({
    heartRate: {
      value: undefined,
      startDate: "",
      endDate: "",
    },
    stepCount: {
      value: undefined,
      startDate: "",
      endDate: "",
    },
  });
  useEffect(() => {
    const fethcHealthData = async () => {
      sendToNative("getHealthData", {}, (data: any) => {
        //{"heartRate":{"value":0,"startDate":"2025-03-22T15:21:01.280+0900","endDate":"2025-03-22T15:21:01.280+0900"},"stepCount":{"value":0,"startDate":"2025-03-22T15:21:01.280+0900","endDate":"2025-03-22T15:21:01.280+0900"}}
        if (!data) {
          return;
        }
        setHealthData(data);
      });
    };
    fethcHealthData();
  }, []);

  return (
    <Flex>
      <Flex vertical>
        <div>심박수: {healthData.heartRate.value}</div>
        <div>시작시간: {healthData.heartRate.startDate}</div>
        <div>종료시간: {healthData.heartRate.endDate}</div>
      </Flex>
      <Flex vertical>
        <div>걸음수: {healthData.stepCount.value}</div>
        <div>시작시간: {healthData.stepCount.startDate}</div>
        <div>종료시간: {healthData.stepCount.endDate}</div>
      </Flex>
    </Flex>
  );
};
//     {healthData.heartRate.value ? (
//         <div>
//             <div>심박수: {healthData.heartRate.value}</div>
//             <div>시작시간: {healthData.heartRate.startDate}</div>
//             <div>종료시간: {healthData.heartRate.endDate}</div>
//         </div>
//         ) : (
//         <div>심박수 데이터가 없습니다.</div>
//         )
//     }
//     {healthData.stepCount.value ? (
//         <div>
//             <div>걸음수: {healthData.stepCount.value}</div>
//             <div>시작시간: {healthData.stepCount.startDate}</div>
//             <div>종료시간: {healthData.stepCount.endDate}</div>
//         </div>
//         ) : (
//         <div>걸음수 데이터가 없습니다.</div>
//         )
// }
// };
export default HealthCard;
