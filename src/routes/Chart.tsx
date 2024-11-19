import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { fetchCoinHistory } from "./api";
import ApexChart from "react-apexcharts";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "../atome";
import styled from "styled-components";

const ChartContainer = styled.div`
  background-color: ${(props) => props.theme.itemColor};
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: ${(props) => props.theme.textColor};
  font-size: 1.2rem;
`;

interface IHistorical {
  time_open: number;
  time_close: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  market_cap: number;
}

export default function Chart() {
  const { coinId } = useParams();
  const { isLoading, data } = useQuery<IHistorical[]>(["ohlcv", coinId], () =>
    fetchCoinHistory(coinId)
  );
  const isDark = useRecoilValue(isDarkAtom);

  return (
    <ChartContainer>
      {isLoading ? (
        <LoadingMessage>차트를 불러오는 중입니다...</LoadingMessage>
      ) : !data || data.length === 0 ? (
        <LoadingMessage>차트 데이터가 존재하지 않습니다.</LoadingMessage>
      ) : (
        <ApexChart
          type="candlestick"
          series={[
            {
              data: data.map((price) => [
                new Date(price.time_open).getTime(),
                price.open,
                price.high,
                price.low,
                price.close,
              ]),
            } as any,
          ]}
          options={{
            plotOptions: {
              candlestick: {
                colors: {
                  upward: "#00b894",
                  downward: "#d63031",
                },
                wick: {
                  useFillColor: true,
                },
              },
            },
            theme: {
              mode: isDark ? "dark" : "light",
            },
            chart: {
              height: 400,
              toolbar: {
                show: false,
              },
              background: "transparent",
              animations: {
                enabled: true,
                easing: "easeinout",
                speed: 800,
              },
            },
            xaxis: {
              type: "datetime",
              labels: {
                style: {
                  colors: isDark ? "#ffffff" : "#000000",
                },
              },
            },
            yaxis: {
              tooltip: {
                enabled: true,
              },
              labels: {
                style: {
                  colors: isDark ? "#ffffff" : "#000000",
                },
                formatter: (value) => `$${value.toFixed(2)}`,
              },
            },
          }}
        />
      )}
    </ChartContainer>
  );
}
