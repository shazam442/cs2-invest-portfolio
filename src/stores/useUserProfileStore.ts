import { defineStore } from "pinia";
import { ref } from "vue";
import { type Tables } from "@lib/types/supabase.types";
import supabase from "@lib/api";

export const useUserProfileStore = defineStore("user_profiles", () => {
    const userProfiles = ref<Tables<"user_profile">[]>([]);
    
    const fetch = async () => {
        try {
            const { data, error } = await supabase.from("user_profile").select("*");
            if (error) console.error("Error fetching user profiles:", error);

            userProfiles.value = data.sort((a, b) => b.display_name.localeCompare(a.display_name)) || [];
        } catch (error) {
            console.error("Error fetching user profiles:", error);
        }
    }
    
    return {
        userProfiles,
        fetch,
    }
}) 