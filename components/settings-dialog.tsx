"use client";

import { useState } from "react";
import { Settings, CheckCircle2 } from "lucide-react";
import { useSettingsStore } from "@/store/useSettingsStore";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SettingsDialog() {
    const { apiKey, setApiKey } = useSettingsStore();
    const [open, setOpen] = useState(false);
    const [tempKey, setTempKey] = useState(apiKey);

    const handleSave = () => {
        setApiKey(tempKey);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Settings className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    {apiKey && (
                        <span className="absolute top-1 right-1 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                    <DialogDescription>
                        Enter your YouTube Data API Key. It is stored locally in your browser
                        and never saved to our servers.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="apiKey" className="text-right">
                            API Key
                        </Label>
                        <Input
                            id="apiKey"
                            type="password"
                            placeholder="AIzaSy..."
                            value={tempKey}
                            onChange={(e) => setTempKey(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                </div>

                <div className="px-1 pb-4">
                    <details className="group border rounded-lg bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                        <summary className="flex cursor-pointer items-center justify-between p-3 font-medium text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-t-lg group-open:rounded-b-none transition-colors">
                            <span>Panduan Mencari API Key</span>
                            <span className="text-slate-400 group-open:rotate-180 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                            </span>
                        </summary>
                        <div className="p-3 pt-0 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 group-open:border-t-0">
                            <ol className="list-decimal pl-4 space-y-1.5 mt-2">
                                <li>Buka <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Cloud Console</a> dan buat Project baru.</li>
                                <li>Pergi ke menu <b>"APIs & Services" &gt; "Library"</b>.</li>
                                <li>Cari dan aktifkan <b>"YouTube Data API v3"</b>.</li>
                                <li>Masuk ke <b>"Credentials"</b> lalu klik <b>"Create Credentials" &gt; "API Key"</b>.</li>
                                <li>Salin API Key tersebut dan tempel di kolom di atas.</li>
                            </ol>
                        </div>
                    </details>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleSave}>
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
