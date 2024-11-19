import { useQuery } from "react-query";
import { useMatch } from "react-router-dom";
import { Link } from "react-router-dom";
import { Outlet, useLocation, useParams } from "react-router-dom";
import styled from "styled-components";
import { fetchCoinInfo, fetchCoinPrice } from "./api";
import { Helmet } from "react-helmet-async";

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.header`
  position: relative;
  padding: 30px 0;
  text-align: center;
  margin-bottom: 40px;
  &:hover button {
    transform: translateX(-5px);
  }
`;

const BackButton = styled(Link)`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  font-size: 24px;
  color: ${(props) => props.theme.accentColor};
  transition: all 0.2s ease-in-out;
  opacity: 0.8;

  &:hover {
    opacity: 1;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.accentColor};
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
`;

const Loading = styled.div`
  font-size: 1.5rem;
  color: ${(props) => props.theme.textColor};
  opacity: 0.8;
`;

const Overview = styled.div`
  background: ${(props) => props.theme.itemColor};
  border-radius: 20px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  transition: all 0.3s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
  }
`;

const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 15px;
  border-radius: 15px;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  .label {
    font-size: 0.9rem;
    font-weight: 600;
    text-transform: uppercase;
    color: ${(props) => props.theme.accentColor};
    margin-bottom: 10px;
  }

  .value {
    font-size: 1.3rem;
    font-weight: 600;
  }
`;

const Description = styled.p`
  line-height: 1.6;
  color: ${(props) => props.theme.textColor};
  font-size: 1rem;
  margin: 30px 0;
  padding: 25px;
  background: ${(props) => props.theme.itemColor};
  border-radius: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
  }
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin: 40px 0;
`;

const Tab = styled.div<{ $isActive: boolean }>`
  background: ${(props) => props.theme.itemColor};
  border-radius: 15px;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }

  a {
    display: block;
    padding: 20px;
    text-align: center;
    color: ${(props) =>
      props.$isActive ? props.theme.accentColor : props.theme.textColor};
    font-weight: ${(props) => (props.$isActive ? "600" : "400")};
    font-size: 1.1rem;
  }
`;

interface ILocation {
  state: {
    name: string;
  };
}

interface IInfoData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  logo: string;
  description: string;
  message: string;
  open_source: boolean;
  started_at: string;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  first_data_at: string;
  last_data_a: string;
}

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

export default function Coin() {
  const { coinId } = useParams();
  const { state } = useLocation() as ILocation;
  const priceMatch = useMatch("/:coinId/price");
  const chartMatch = useMatch("/:coinId/chart");

  const { isLoading: infoLoading, data: infoData } = useQuery<IInfoData>(
    ["info", coinId],
    () => fetchCoinInfo(coinId)
  );
  const { isLoading: priceLoading, data: priceData } = useQuery<IPriceData>(
    ["price", coinId],
    () => fetchCoinPrice(coinId)
  );
  const loading = infoLoading || priceLoading;

  return (
    <Container>
      <Helmet>
        <title>
          {state?.name ? state.name : loading ? "Loading..." : infoData?.name}
        </title>
      </Helmet>

      <Header>
        <BackButton to="/">←</BackButton>
        <Title>
          {state?.name ? state.name : loading ? "Loading..." : infoData?.name}
        </Title>
      </Header>

      {loading ? (
        <LoadingWrapper>
          <Loading>Loading data...</Loading>
        </LoadingWrapper>
      ) : (
        <>
          <Overview>
            <OverviewItem>
              <span className="label">Rank</span>
              <span className="value">#{infoData?.rank}</span>
            </OverviewItem>
            <OverviewItem>
              <span className="label">Symbol</span>
              <span className="value">{infoData?.symbol}</span>
            </OverviewItem>
            <OverviewItem>
              <span className="label">Price</span>
              <span className="value">
                ${priceData?.quotes?.USD?.price.toFixed(2)}
              </span>
            </OverviewItem>
          </Overview>

          <Description>{infoData?.description}</Description>

          <Overview>
            <OverviewItem>
              <span className="label">Total Supply</span>
              <span className="value">
                {priceData?.total_supply?.toLocaleString() ?? "N/A"}
              </span>
            </OverviewItem>
            <OverviewItem>
              <span className="label">Max Supply</span>
              <span className="value">
                {priceData?.max_supply?.toLocaleString() ?? "N/A"}
              </span>
            </OverviewItem>
            <OverviewItem>
              <span className="label">Market Cap</span>
              <span className="value">
                ${priceData?.quotes?.USD?.market_cap?.toLocaleString() ?? "N/A"}
              </span>
            </OverviewItem>
          </Overview>

          <Tabs>
            <Tab $isActive={priceMatch !== null}>
              <Link to="price">Price</Link>
            </Tab>
            <Tab $isActive={chartMatch !== null}>
              <Link to="chart">Chart</Link>
            </Tab>
          </Tabs>
          <Outlet />
        </>
      )}
    </Container>
  );
}
