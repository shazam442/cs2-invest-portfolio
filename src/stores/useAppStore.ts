import { defineStore } from "pinia";
import { ref } from "vue";
import { type Tables } from "@lib/types/supabase.types";
import supabase from "@lib/api";
import { useAuth } from "@lib/authentication";

export const useAppStore = defineStore("app", () => {
  const isLoading = ref(true);
  const selectedUserId = ref();
  const transactions = ref<Tables<"cs_transaction">[]>([]);

  const fetchTransactions = async (userId: string) => {
    const { data, error } = await supabase.from("cs_transaction").select("*").eq("user_id", userId);
    if (error) console.error("Error fetching transactions:", error);
    transactions.value = data || [];
  }

  return {
    selectedUserId,
    transactions,
    fetchTransactions,
    isLoading,
  }
}) 