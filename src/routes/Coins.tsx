import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { fetchCoins } from "./api";
import { Helmet } from "react-helmet-async";
import noCoinImg from "../assets/NoImgcoin.svg";

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.header`
  margin: 50px 0;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.accentColor};
  text-transform: uppercase;
  letter-spacing: 4px;
  margin-bottom: 20px;
`;

const Subtitle = styled.p`
  color: ${(props) => props.theme.textColor};
  opacity: 0.8;
  font-size: 1.1rem;
`;

const CoinGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  padding: 20px;
`;

const CoinCard = styled.div`
  background-color: ${(props) => props.theme.itemColor};
  border-radius: 20px;
  transition: all 0.3s ease-in-out;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
  }
`;

const CoinLink = styled(Link)`
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
`;

const CoinImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  padding: 5px;
`;

const CoinInfo = styled.div`
  flex: 1;
`;

const CoinName = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 5px;
  color: ${(props) => props.theme.textColor};
`;

const CoinSymbol = styled.span`
  font-size: 0.9rem;
  color: ${(props) => props.theme.accentColor};
  opacity: 0.8;
`;

const Loading = styled.div`
  text-align: center;
  padding: 100px;
  font-size: 1.5rem;
  color: ${(props) => props.theme.textColor};
`;

interface ICoin {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
}

export default function Coins() {
  const { isLoading, data } = useQuery<ICoin[]>("allCoin", fetchCoins);

  return (
    <Container>
      <Helmet>
        <title>암호화폐 트래커</title>
      </Helmet>
      <Header>
        <Title>Crypto Tracker</Title>
        <Subtitle>실시간 암호화폐 가격을 확인하세요</Subtitle>
      </Header>
      {isLoading ? (
        <Loading>데이터를 불러오는 중입니다...</Loading>
      ) : (
        <CoinGrid>
          {data?.slice(0, 100).map((coin) => (
            <CoinCard key={coin.id}>
              <CoinLink to={`${coin.id}`} state={{ name: coin.name }}>
                <CoinImg
                  src={`https://cryptoicon-api.pages.dev/api/icon/${coin.symbol.toLowerCase()}`}
                  onError={(e) => {
                    e.currentTarget.src = noCoinImg;
                  }}
                />
                <CoinInfo>
                  <CoinName>{coin.name}</CoinName>
                  <CoinSymbol>{coin.symbol}</CoinSymbol>
                </CoinInfo>
              </CoinLink>
            </CoinCard>
          ))}
        </CoinGrid>
      )}
    </Container>
  );
}
