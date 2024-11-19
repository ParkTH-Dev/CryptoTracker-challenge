import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { fetchCoinPrice } from "./api";
import styled from "styled-components";

interface IPriceData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: {
    USD: {
      ath_date: string;
      ath_price: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_1h: number;
      percent_change_1y: number;
      percent_change_6h: number;
      percent_change_7d: number;
      percent_change_12h: number;
      percent_change_15m: number;
      percent_change_24h: number;
      percent_change_30d: number;
      percent_change_30m: number;
      percent_from_price_ath: number;
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
    };
  };
}

const Container = styled.div`
  padding: 20px;
`;

const PriceCard = styled.div`
  background-color: ${(props) => props.theme.itemColor};
  border-radius: 20px;
  padding: 25px;
  margin-bottom: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
  }
`;

const PriceTitle = styled.h2`
  font-size: 1.2rem;
  color: ${(props) => props.theme.accentColor};
  margin-bottom: 15px;
`;

const PriceValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${(props) => props.theme.textColor};
  margin: 10px 0;
`;

const PriceInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 20px;
  font-size: 1.1rem;
  color: ${(props) => props.theme.textColor};
  text-align: center;

  div {
    padding: 15px;
    background-color: ${(props) => props.theme.bgColor};
    border-radius: 15px;
    transition: all 0.2s ease-in-out;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
  }
`;

export default function Price() {
  const { coinId } = useParams();
  const { isLoading, data } = useQuery<IPriceData>(["price", coinId], () =>
    fetchCoinPrice(coinId)
  );
  return (
    <>
      <div>
        {isLoading ? (
          "Loading Price..."
        ) : (
          <Container>
            <PriceCard>
              <PriceTitle>{data?.name} 현재가</PriceTitle>
              <PriceValue>:${data?.quotes?.USD?.price.toFixed(2)}</PriceValue>
              <PriceInfo>
                <div>
                  역대 최고가: ${data?.quotes?.USD?.ath_price.toFixed(2)}
                </div>
                <div>
                  시가총액: ${data?.quotes?.USD?.market_cap.toLocaleString()}{" "}
                  USD
                </div>
                <div>
                  24시간 거래량: $
                  {data?.quotes?.USD?.volume_24h.toLocaleString()} USD
                </div>
              </PriceInfo>
            </PriceCard>
          </Container>
        )}
      </div>
    </>
  );
}
