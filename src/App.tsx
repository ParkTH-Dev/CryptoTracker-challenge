import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Coins from "./routes/Coins";
import Coin from "./routes/Coin";
import { GlobalStyle } from "./GlobalStyle";
import Price from "./routes/Price";
import Chart from "./routes/Chart";
import { ReactQueryDevtools } from "react-query/devtools";
import styled, { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./theme";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { isDarkAtom } from "./atome";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "",
          element: <Coins />,
        },
        {
          path: ":coinId",
          element: <Coin />,
          children: [
            {
              path: "price",
              element: <Price />,
            },
            {
              path: "chart",
              element: <Chart />,
            },
          ],
        },
      ],
    },
  ],
  {
    basename: "/CryptoTracker-challenge",
  }
);

const ModeBtn = styled.svg`
  cursor: pointer;
  position: fixed;
  bottom: 30px;
  padding: 5px;
  left: 30px;
  width: 50px;
  border: none;
  background-color: ${(props) => props.theme.accentColor};
  color: ${(props) => props.theme.bgColor};
  border-radius: 50%;
`;

function App() {
  const isDark = useRecoilValue(isDarkAtom);
  const setDarkAtom = useSetRecoilState(isDarkAtom);
  const toggleDarkAtom = () => setDarkAtom((prev) => !prev);
  return (
    <>
      <ThemeProvider theme={isDark ? lightTheme : darkTheme}>
        <ModeBtn
          onClick={toggleDarkAtom}
          data-slot="icon"
          fill="none"
          strokeWidth="1.5"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
          ></path>
        </ModeBtn>
        <GlobalStyle />
        <RouterProvider router={router} />
        <ReactQueryDevtools />
      </ThemeProvider>
    </>
  );
}

export default App;
