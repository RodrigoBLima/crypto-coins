import React from "react";

import Legend from "../Legend";

import { createChart, CrosshairMode, ISeriesApi } from "lightweight-charts";

import "./index.css";
import api from "../../services";

interface ChartProps {
  coin: string;
}

const Chart: React.FC<ChartProps> = (props) => {
  const { coin } = props;

  const containerRef = React.useRef() as React.MutableRefObject<HTMLDivElement>;
  const candleSeriesRef = React.useRef() as React.MutableRefObject<
    ISeriesApi<"Candlestick">
  >;

  const [prices, setPrices] = React.useState<any[]>([]);
  const [chartLoaded, setChartLoaded] = React.useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      api
        .get(`histominute?fsys=${coin}&tsym=BRL&limit=300`)
        .then((response) => {
          setPrices((prevState) => {
            const price = response.data.Data[1];
            const newPrice = {
              time: price.title,
              low: price.low,
              high: price.high,
              open: price.open,
              close: price.close,
              volume: price.volumefrom,
            };
            candleSeriesRef.current.update(newPrice);

            return [...prevState, newPrice];
          });
        });
    }, 60000);

    return () => clearInterval(interval);
  }, [coin]);

  React.useEffect(() => {
    api.get(`histoday?fsys=${coin}&tsym=BRL&limit=300`).then((response) => {
      const prices = response.data.Data.map((row: any) => ({
        time: row.title,
        low: row.low,
        high: row.high,
        open: row.open,
        close: row.close,
        volume: row.volumefrom,
      }));
      setPrices(prices);
    });
  }, [coin]);

  React.useEffect(() => {
    if (candleSeriesRef.current) {
      candleSeriesRef.current.setData(prices);
    }
  }, [prices]);

  React.useEffect(() => {
    setPrices([]);
  }, [coin]);

  React.useEffect(() => {
    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      layout: {
        backgroundColor: "#253248",
        textColor: "rgba(255, 255, 255, 0.9)",
      },
      grid: {
        vertLines: {
          color: "#334158",
        },
        horzLines: {
          color: "#334158",
        },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      //@ts-ignore
      priceScale: {
        borderColor: "#485c7b",
      },
      timeScale: {
        borderColor: "#485c7b",
      },
    });

    candleSeriesRef.current = chart.addCandlestickSeries({
      upColor: "#4bffb5",
      downColor: "#ff4976",
      borderDownColor: "#ff4976",
      borderUpColor: "#4bffb5",
      wickDownColor: "#838ca1",
      wickUpColor: "#838ca1",
    });
    setChartLoaded(true);
  }, []);

  return (
    <div className="Chart" ref={containerRef}>
      <Legend legend={coin} />
    </div>
  );
};

export default Chart;
