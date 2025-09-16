import { defineStore } from "pinia";
import { ref } from "vue";
import supabase from "@lib/api";

export interface PriceCheckRecord {
    id?: number;
    market_hash_name: string;
    lowest_price: number | null;
    median_price: number | null;
    created_at?: string;
}

export const usePriceCheckStore = defineStore("price_check", () => {
    const priceChecks = ref<PriceCheckRecord[]>([]);
    const isLoading = ref(false);

    const fetch = async (): Promise<void> => {
        try {
            isLoading.value = true;
            const { data, error } = await supabase
                .from("price_check")
                .select("*")
                .order("id", { ascending: false });
            if (error) throw error;
            priceChecks.value = (data as unknown as PriceCheckRecord[]) || [];
        } catch (err) {
            console.error("Error fetching price checks:", err);
        } finally {
            isLoading.value = false;
        }
    };

    const add = async (record: PriceCheckRecord): Promise<void> => {
        try {
            const { data, error } = await supabase
                .from("price_check")
                .insert(record)
                .select();
            if (error) throw error;
            if (data && Array.isArray(data) && data[0]) {
                priceChecks.value.unshift(data[0] as unknown as PriceCheckRecord);
            }
        } catch (err) {
            console.error("Error inserting price check:", err);
        }
    };

    return {
        priceChecks,
        isLoading,
        fetch,
        add,
    };
});


