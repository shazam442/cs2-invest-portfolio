// API client for communicating with backend
import { type Transaction, type NewTransaction } from "./types"

const API_BASE_URL = '/api';

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async getAllTransactions(): Promise<Transaction[]> {
    const transactions = await this.request<Transaction[]>('/transactions');
    
    return transactions.map(t => parseTransaction(t));
  }

  async createTransaction(transaction: NewTransaction): Promise<Transaction> {
    console.log('creating transaction');
    const response = await this.request<Transaction>('/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
    return parseTransaction(response);
  }

  async updateTransaction(id: string, transaction: Partial<Transaction>): Promise<{ success: boolean }> {
    return await this.request<{ success: boolean }>(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transaction),
    })
  }

  async deleteTransaction(id: string): Promise<{ success: boolean }> {
    return await this.request<{ success: boolean }>(`/transactions/${id}`, {
      method: 'DELETE',
    })
  }

  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('/health');
  }
}

const parseTransaction = (transaction: Transaction): Transaction => {
  return {
    ...transaction,
    amount: parseInt(transaction.amount.toString()),
    price: parseFloat(transaction.price.toString()),
  };
};

export default new ApiClient();