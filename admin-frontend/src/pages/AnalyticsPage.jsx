import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import styled from "styled-components";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import moment from "moment";
import { Typography, Divider } from "@mui/material";

const PageContainer = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const ChartContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
`;

const InsightsContainer = styled.div`
  margin-top: 40px;
`;

const StyledDivider = styled(Divider)`
  margin: 20px 0;
`;

function AnalyticsPage() {
  const [data, setData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [insights, setInsights] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/bus_data.csv");
      const reader = response.body.getReader();
      const result = await reader.read();
      const decoder = new TextDecoder("utf-8");
      const csv = decoder.decode(result.value);
      const parsedData = Papa.parse(csv, { header: true }).data;

      // Aggregate data by day
      const aggregatedData = {};
      parsedData.forEach((entry) => {
        const date = moment(entry.timestamp).format("YYYY-MM-DD");
        const crowdDensity = parseFloat(entry.crowd_density);
        if (!isNaN(crowdDensity)) {
          if (!aggregatedData[date]) {
            aggregatedData[date] = { date, crowd_density: 0, count: 0 };
          }
          aggregatedData[date].crowd_density += crowdDensity;
          aggregatedData[date].count += 1;
        }
      });

      const dailyData = Object.keys(aggregatedData).map((date) => ({
        date,
        crowd_density:
          aggregatedData[date].crowd_density / aggregatedData[date].count,
      }));

      // Ensure we have at least one data point for each day
      const startDate = moment(parsedData[0].timestamp).startOf('day');
      const endDate = moment(parsedData[parsedData.length - 1].timestamp).endOf('day');
      const completeDailyData = [];

      for (let m = startDate; m.isBefore(endDate); m.add(1, 'days')) {
        const dateStr = m.format('YYYY-MM-DD');
        const dayData = dailyData.find(d => d.date === dateStr);
        if (dayData) {
          completeDailyData.push(dayData);
        } else {
          completeDailyData.push({ date: dateStr, crowd_density: 0 });
        }
      }

      setData(parsedData);
      setDailyData(completeDailyData);

      // Generate insights
      const totalDays = completeDailyData.length;
      const totalCrowdDensity = completeDailyData.reduce((acc, day) => acc + day.crowd_density, 0);
      const avgCrowdDensity = (totalCrowdDensity / totalDays).toFixed(4);

      const highestCrowdDensityDay = completeDailyData.reduce((prev, current) => (prev.crowd_density > current.crowd_density) ? prev : current);
      const lowestCrowdDensityDay = completeDailyData.reduce((prev, current) => (prev.crowd_density < current.crowd_density) ? prev : current);

      setInsights({
        avgCrowdDensity,
        highestCrowdDensityDay: {
          ...highestCrowdDensityDay,
          crowd_density: highestCrowdDensityDay.crowd_density.toFixed(4)
        },
        lowestCrowdDensityDay: {
          ...lowestCrowdDensityDay,
          crowd_density: lowestCrowdDensityDay.crowd_density.toFixed(4)
        }
      });
    };

    fetchData();
  }, []);

  return (
    <PageContainer>
      {/* <Typography variant="h4" gutterBottom>Analytics Page</Typography> */}
      <ChartContainer>
        <ResponsiveContainer width="45%" height={400}>
          <LineChart
            data={dailyData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="crowd_density" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="45%" height={400}>
          <BarChart
            data={dailyData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="crowd_density" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
      <StyledDivider />
      <InsightsContainer>
        <Typography variant="h5" gutterBottom>Important Insights</Typography>
        <Typography variant="body1">
          Here are some important insights based on the data:
        </Typography>
        <ul>
          <li>Average crowd density: {insights.avgCrowdDensity}%</li>
          <li>
            Day with highest crowd density:{" "}
            {insights.highestCrowdDensityDay?.date} (
            {insights.highestCrowdDensityDay?.crowd_density}%)
          </li>
          <li>
            Day with lowest crowd density:{" "}
            {insights.lowestCrowdDensityDay?.date} (
            {insights.lowestCrowdDensityDay?.crowd_density}%)
          </li>
        </ul>
      </InsightsContainer>
    </PageContainer>
  );
}

export default AnalyticsPage;