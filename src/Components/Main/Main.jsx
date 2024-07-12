// Imports
import React, { useCallback, useMemo, useState } from "react";
import { useQuery } from "react-query";
import TransactionsChart from "../Chart/Chart";
import localUrl from "../../Local Dataset/db.json";
import "./Main.css";

export default function Main() {
  // State management
  const [nameFilter, setNameFilter] = useState("");
  const [amountFilter, setAmountFilter] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [comparison, setComparison] = useState(true);

  // github gist for database hosting
  const url =
    "https://gist.githubusercontent.com/OmarSameh2001/e759b20ddb80b4e4afe4de7b003ec486/raw/de668ec92392e7c6167d1ffdd00ababde4f84196/db.json";

  // Fetching Customers
  async function fetchCustomers() {
    try {
      let response;
      response = await fetch(url);
      // Handle free hosting server possible errors
      if (!response.ok) {
        response = await fetch(localUrl);
      }
      const data = await response.json();
      return data.customers;
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  }

  // Fetching Transactions
  async function fetchTransactions() {
    try {
      let response;
      response = await fetch(url);
      // Handle free hosting server possible errors
      if (!response.ok) {
        response = await fetch(localUrl);
      }
      const data = await response.json();
      return data.transactions;
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }

  // React Query for pre mount fetching and caching
  const { isLoading: isLoadingCustomers, data: customers = [] } = useQuery(
    "customers",
    fetchCustomers
  );
  const { isLoading: isLoadingTransactions, data: transactions = [] } = useQuery(
    "transactions",
    fetchTransactions);

  // Click handlers with useCallback to prevent unnecessary re-renders
  const handleCustomerClick = useCallback((customer) => {
    setSelectedCustomer(customer);
  }, []);

  const handleComparison = useCallback(() => {
    setComparison((prev) => !prev);
  }, []);

  // Transaction filtering function with useMemo to prevent unnecessary re-renders
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const customer = customers.find(
        (customer) => customer.id === transaction.customer_id
      );
      const matchName = !nameFilter
        ? true
        : customer?.name.toLowerCase().includes(nameFilter.toLowerCase());
      const matchAmount = !amountFilter
        ? true
        : comparison
        ? transaction.amount >= parseInt(amountFilter)
        : transaction.amount <= parseInt(amountFilter);
      return matchAmount && matchName;
    });
  }, [transactions, customers, nameFilter, amountFilter, comparison]);

  // Log for debugging the feature
  console.log(filteredTransactions);

  // Conditional rendering
  if (isLoadingCustomers || isLoadingTransactions) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1 className="heading">Customer Transactions</h1>
      {selectedCustomer && transactions && (
        <>
          <TransactionsChart
            transactions={transactions}
            selectedCustomer={selectedCustomer}
          />
          <button
            onClick={() => setSelectedCustomer(null)}
            className="chart-button"
          >
            Remove Chart
          </button>
        </>
      )}
      <div className="filter-container">
        <label className="filter-label">Filter by customer name: </label>
        <input
          type="text"
          id="nameFilter"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          className="filter-input"
        />
        {nameFilter && (
          <button onClick={() => setNameFilter("")} className="clear-button">
            X
          </button>
        )}
      </div>
      <div className="filter-container">
        <label className="filter-label">Filter by transaction amount: </label>
        <input
          type="number"
          id="amountFilter"
          value={amountFilter}
          onChange={(e) => setAmountFilter(e.target.value)}
          className="filter-input"
        />
        {amountFilter && (
          <>
            <button
              onClick={() => setAmountFilter("")}
              className="clear-button"
            >
              X
            </button>
            <button onClick={handleComparison} className="toggle-button">
              {comparison ? "More than or equal" : "Less than or equal"}
            </button>
          </>
        )}
      </div>
      <table>
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Transaction Date</th>
            <th>Transaction Amount</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.length ? (
            filteredTransactions.map((transaction) => {
              const customer = customers.find(
                (customer) => customer.id === transaction.customer_id
              );
              return (
                <tr
                  key={transaction.id}
                  onClick={() => handleCustomerClick(customer)}
                >
                  <td>{customer ? customer.name : "Unknown Customer"}</td>
                  <td>{transaction.date}</td>
                  <td>{transaction.amount}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td>User Not Found</td>
              <td>User Not Found</td>
              <td>User Not Found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
