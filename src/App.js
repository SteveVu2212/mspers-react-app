import React, {useState} from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [fundingPolicy, setFundingPolicy] = useState('StatusQuo');
  const [roaScenario, setRoaScenario] = useState('Assumption');
  const [discountRate, setDiscountRate] = useState("0.0755");
  const [chartData, setChartData] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const url = `https://reasonapi.world/predict_funding?funding_policy_=${fundingPolicy}&roa_scenario_=${roaScenario}`;
              // https://reasonapi.world/predict_funding?discount_rate_=0.08&funding_policy_=ADC&roa_scenario_=Recurring%20Recession
              // http://127.0.0.1/predict_funding?funding_policy_=ADC&roa_scenario_=Recurring%20Recession
              // https://reasonapi.world/predict_funding?disc_rate=0.0755&funding_policy_=ADC&roa_scenario_=Assumption

    try {
      const response = await fetch(url);
      const data = await response.json();

      // console.log(data)

      setChartData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fundedRatioData = {
    labels: chartData.map((item) => item.Year),
    datasets: [
      {
        label: 'Funded Ratio MVA',
        data: chartData.map((item) => item.funded_ratio_mva),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
    ],
  };

  // console.log(fundedRatioData)

  const totalHireERContrData ={
    labels: chartData.map((item) => item.Year),
    datasets: [
      {
        label: 'Total Hire ER Contribution',
        data: chartData.map((item) => item.total_hire_ER_contr),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
      },
    ],
  };

  const totalHireUALMVA = {
    labels: chartData.map((item) => item.Year),
    datasets: [
      {
        label: 'Total Hire UAL MVA',
        data: chartData.map((item) => item.total_hire_ual_mva),
        borderColor: 'rgba(255, 206, 86, 1)',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
      },
    ],
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <label>
          Funding Policy:
          <select value={fundingPolicy} onChange={(event) => setFundingPolicy(event.target.value)}>
            <option value="ADC">ADC</option>
            <option value="StatusQuo">Status Quo</option>
          </select>
        </label>
        <br />
        <label>
          ROA Scenario:
          <select value={roaScenario} onChange={(event) => setRoaScenario(event.target.value)}>
            <option value="Assumption">Assumption</option>
            <option value="RecurringRecession">Recurring Recession</option>
          </select>
        </label>
        <br />
        <label>
          Discount:
          <input
            type="range"
            min="0.05"
            max="0.08"
            step="0.005"
            value={discountRate}
            onChange={(event) => setDiscountRate(event.target.value)}
          />
          {discountRate}
        </label>
        <br />

        <button type="submit">Submit</button>
      </form>
      {chartData.length > 0 && (
        <div className="chart-container" style={{ width: '80%', height: '400px' }}>
          <h2>Funded Ratio MVA</h2>
          <Line data={fundedRatioData} />
          <h2>Total Hire ER Contribution</h2>
          <Line data={totalHireERContrData} />
          <h2>Total Hire UAL-MVA</h2>
          <Line data={totalHireUALMVA} />
        </div>
      )}
    </div>
  );
}

export default App;