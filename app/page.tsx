"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useScraper } from "@/hooks/use-scraper";
import { downloadCSV } from "@/lib/csv-export";
import { SettingsDialog } from "@/components/settings-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Download, Youtube, Loader2, MessageSquare, ThumbsUp, AlertCircle, AlertTriangle, Eye, EyeOff } from "lucide-react";

// ... (existing code)



import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
    const { apiKey } = useSettingsStore();
    const [url, setUrl] = useState("");
    const [limit, setLimit] = useState(100);
    const [progress, setProgress] = useState(0);

    // PIN Verification State
    // PIN Verification State
    const [isPinDialogOpen, setIsPinDialogOpen] = useState(false);
    const [pinInput, setPinInput] = useState("");
    const [showPin, setShowPin] = useState(false); // Toggle visibility
    const [pinError, setPinError] = useState("");
    const [isUnlocked, setIsUnlocked] = useState(false);
    const ACCESS_PIN = "050597"; // Hardcoded PIN, updated as requested

    const { mutate: scrape, isPending, error, data, reset } = useScraper();

    // Reset progress when not pending
    useEffect(() => {
        if (!isPending) {
            setProgress(0);
        }
    }, [isPending]);

    // Simulate progress
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isPending) {
            setProgress(10);
            timer = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 90) return prev;
                    return prev + Math.random() * 10;
                });
            }, 800);
        }
        return () => clearInterval(timer);
    }, [isPending]);

    const handleScrape = () => {
        if (isUnlocked) {
            scrape({ youtubeUrl: url, limit });
        } else {
            setIsPinDialogOpen(true);
        }
    };

    const handlePinSubmit = () => {
        // Simple sanitization: trim whitespace.
        // SQL Injection is NOT possible here because:
        // 1. This is running on the client-side (browser).
        // 2. We are not using a database (SQL).
        // 3. We use strict equality check (===) which prevents injection logic.
        const cleanInput = pinInput.trim();

        if (cleanInput === ACCESS_PIN) {
            setIsUnlocked(true);
            setIsPinDialogOpen(false);
            setPinError("");
            scrape({ youtubeUrl: url, limit });
        } else {
            setPinError("Incorrect PIN Code.");
            setPinInput(""); // Clear input on error
        }
    };

    const handleDownload = () => {
        if (data?.comments) {
            const filename = `${data.meta.title || "comments"}_scraped.csv`.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            downloadCSV(data.comments, filename);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans text-slate-900 dark:text-slate-50">
            {/* Navbar */}
            <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-red-600 p-1 rounded-lg text-white">
                            <Youtube size={20} fill="currentColor" />
                        </div>
                        <span className="font-bold text-xl tracking-tight">Commentary</span>
                    </div>
                    <SettingsDialog />
                </div>
            </header>

            <main className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center gap-8">

                {/* Hero */}
                <div className="text-center space-y-4 max-w-2xl">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                        Turn YouTube Comments <br /> into Data.
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        Extract comments for sentiment analysis in seconds. <br className="hidden sm:inline" />
                        No coding required. Directly to CSV.
                    </p>
                </div>

                {/* Input Card */}
                <Card className="w-full max-w-xl shadow-lg border-0 ring-1 ring-slate-200 dark:ring-slate-800">
                    <CardHeader>
                        <CardTitle>Scrape Configuration</CardTitle>
                        <CardDescription>Enter a video link and choose how many comments to fetch.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">

                        {!apiKey && (
                            <div className="flex items-start gap-3 text-sm text-amber-700 bg-amber-100 dark:bg-amber-900/40 dark:text-amber-200 border border-amber-200 dark:border-amber-800 p-4 rounded-lg animate-pulse">
                                <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <p className="font-semibold">API Key Missing</p>
                                    <p>Please click the Settings icon (top right) and enter your YouTube Data API Key to start scraping.</p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                YouTube Link
                            </label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    className="flex-1"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <label className="text-sm font-medium">Max Comments</label>
                                <span className="text-sm text-slate-500 font-mono">{limit}</span>
                            </div>
                            <Slider
                                defaultValue={[100]}
                                max={2000}
                                min={10}
                                step={10}
                                onValueChange={(vals) => setLimit(vals[0])}
                            />
                            <p className="text-xs text-slate-500 text-right">Max 2000 for stateless mode</p>
                        </div>

                        {isPending && (
                            <div className="space-y-2">
                                <Progress value={progress} className="h-2 w-full" />
                                <p className="text-xs text-center text-slate-500 animate-pulse">
                                    Extracting comments... {Math.round(progress)}%
                                </p>
                            </div>
                        )}

                        <Button
                            onClick={handleScrape}
                            disabled={!apiKey || !url || isPending}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md transition-all"
                            size="lg"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    Start Scraping
                                </>
                            )}
                        </Button>

                        {error && (
                            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 p-3 rounded-md">
                                <AlertCircle className="h-4 w-4" />
                                <span>{error.message}</span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Results Section */}
                <AnimatePresence>
                    {data && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="w-full max-w-4xl space-y-6"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Summary Card */}
                                <Card className="col-span-1 border-0 shadow-md">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">Video Summary</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {data.meta.thumbnail && (
                                            <div className="relative aspect-video rounded-md overflow-hidden bg-slate-100">
                                                <Image
                                                    src={data.meta.thumbnail}
                                                    alt="Thumbnail"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="font-semibold text-sm line-clamp-2" title={data.meta.title}>{data.meta.title}</h3>
                                            <p className="text-xs text-slate-500">{data.meta.channel}</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Stats */}
                                <Card className="col-span-1 md:col-span-2 border-0 shadow-md">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-muted-foreground">Extraction Stats</CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-2xl font-bold">
                                                <MessageSquare className="text-blue-500 h-6 w-6" />
                                                {data.comments.length}
                                            </div>
                                            <p className="text-xs text-muted-foreground">Comments Retrieved</p>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-2xl font-bold">
                                                <ThumbsUp className="text-green-500 h-6 w-6" />
                                                {data.comments.reduce((acc: number, curr: any) => acc + (Number(curr.like_count) || 0), 0)}
                                            </div>
                                            <p className="text-xs text-muted-foreground">Total Likes (Sample)</p>
                                        </div>
                                        <div className="col-span-2 pt-4">
                                            <Button onClick={handleDownload} className="w-full" variant="secondary">
                                                <Download className="mr-2 h-4 w-4" />
                                                Download .CSV
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Preview Table */}
                            <Card className="border-0 shadow-md overflow-hidden">
                                <CardHeader>
                                    <CardTitle>Preview Data</CardTitle>
                                    <CardDescription>Showing first 5 rows of {data.comments.length}</CardDescription>
                                </CardHeader>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[150px]">Author</TableHead>
                                                <TableHead>Comment</TableHead>
                                                <TableHead className="w-[100px]">Likes</TableHead>
                                                <TableHead className="w-[150px]">Date</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {data.comments.slice(0, 5).map((comment: any, idx: number) => (
                                                <TableRow key={idx}>
                                                    <TableCell className="font-medium truncate max-w-[150px]">{comment.author_name}</TableCell>
                                                    <TableCell className="max-w-[300px] truncate" title={comment.text_display}>{comment.text_display}</TableCell>
                                                    <TableCell>{comment.like_count}</TableCell>
                                                    <TableCell className="text-xs text-muted-foreground">{new Date(comment.published_at).toLocaleDateString()}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </Card>

                        </motion.div>
                    )}
                </AnimatePresence>

                {/* PIN Verification Dialog */}
                <Dialog open={isPinDialogOpen} onOpenChange={setIsPinDialogOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Access Verification</DialogTitle>
                            <DialogDescription>
                                To prevent abuse, this tool is protected. Please enter the Access PIN.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="pin">Access PIN</Label>
                                <div className="relative">
                                    <Input
                                        id="pin"
                                        type={showPin ? "text" : "password"}
                                        placeholder="Enter PIN code"
                                        value={pinInput}
                                        onChange={(e) => setPinInput(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handlePinSubmit()}
                                        className="pr-10" // Make room for the eye icon
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowPin(!showPin)}
                                    >
                                        {showPin ? (
                                            <EyeOff className="h-4 w-4 text-slate-500" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-slate-500" />
                                        )}
                                    </Button>
                                </div>
                                {pinError && <p className="text-red-500 text-xs">{pinError}</p>}
                            </div>
                        </div>
                        <DialogFooter className="flex-col sm:justify-between items-start sm:items-center gap-2 sm:gap-0">
                            <a
                                href="http://lynk.id/habib.creations/6k6o88jn5j48"
                                className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-md transition-colors w-full text-center sm:w-auto"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Hubungi admin untuk mendapatkan Akses Website
                            </a>
                            <Button type="submit" onClick={handlePinSubmit}>
                                Verify & Start
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </main>
        </div>
    );
}
