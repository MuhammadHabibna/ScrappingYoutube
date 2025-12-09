import { useMutation } from "@tanstack/react-query";
import { useSettingsStore } from "@/store/useSettingsStore";

interface ScrapeParams {
    youtubeUrl: string;
    limit: number;
}

export function useScraper() {
    const { apiKey } = useSettingsStore();

    return useMutation({
        mutationFn: async ({ youtubeUrl, limit }: ScrapeParams) => {
            if (!apiKey) {
                throw new Error("API Key is missing given");
            }

            const response = await fetch("/api/scrape", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    youtubeUrl,
                    limit,
                    apiKey, // Pass securely via body (HTTPS)
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to scrape comments");
            }

            return data;
        },
    });
}
