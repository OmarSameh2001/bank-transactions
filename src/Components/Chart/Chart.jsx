// Imports
import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register chat components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const TransactionsChart = ({ transactions = [], selectedCustomer }) => {

  // Filter transactions to include only transactions for the selected customer
  // use useMemo to prevent unnecessary re-renders
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const customer =
        selectedCustomer.id === transaction.customer_id && selectedCustomer;
      return customer;
    });
  }, [selectedCustomer, transactions]);

  // declare array to store transaction total per day
  const transactionsPerDay = [];

  // Loop through filtered transactions
  filteredTransactions.forEach((transaction) => {
    // get date
    const date = transaction.date;
    
    // if transactionsPerDay array doesn't have the date, assign it with a value of 0
    if (!transactionsPerDay[date]) {
      transactionsPerDay[date] = 0;
    }

    // add transaction amount to corresponding date
    transactionsPerDay[date] += transaction.amount;
  });

  // Log for debugging the feature
  console.log(transactionsPerDay);

  // implement chart
  const data = {
    labels: Object.keys(transactionsPerDay),
    datasets: [
      {
        label: "Total Transaction Amount",
        data: Object.values(transactionsPerDay),
        borderColor: "#004181",
      },
    ],
  };

  // Render chart
  return (
    <div>
      <h3>Transaction Amount Per Day for {selectedCustomer.name}</h3>
      <Line data={data} style={{ minWidth: "40vw" }} />
    </div>
  );
};

export default TransactionsChart;
