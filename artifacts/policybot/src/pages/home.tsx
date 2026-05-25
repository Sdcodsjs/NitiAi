import { useState, useRef, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Send, Mic, MicOff, Bookmark, BookmarkCheck, Download,
  RotateCcw, User, Bot, AlertCircle, CheckCircle2,
  Loader2, MessageSquare, Globe,
} from "lucide-react";
import { useQueryPolicy } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { saveBookmark, type SavedQuery } from "@/pages/bookmarks";

/* ── Speech Recognition types ───────────────────────────────────────────── */
interface SpeechRecognitionInstance {
  lang: string;
  interimResults: boolean;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  start(): void;
  stop(): void;
}
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

/* ── Types ───────────────────────────────────────────────────────────────── */
interface HistoryTurn {
  role: "user" | "assistant";
  content: string;
}

interface ConversationTurn {
  id: string;
  query: string;
  language: string;
  persona: string;
  result: PolicyResult | null;
  isLoading: boolean;
}

interface PolicyResult {
  summary: string;
  eligibility?: string;
  benefits?: string;
  applicationProcess?: string;
  sources: Array<{ text: string; scheme: string; source: string; relevanceScore: number }>;
  confidenceScore: number;
  noDataFound: boolean;
}

/* ── Constants ───────────────────────────────────────────────────────────── */
const LANGUAGES: Record<string, { label: string; locale: string; flag: string }> = {
  en: { label: "English",            locale: "en-IN", flag: "🇬🇧" },
  hi: { label: "हिंदी (Hindi)",       locale: "hi-IN", flag: "🇮🇳" },
  kn: { label: "ಕನ್ನಡ (Kannada)",     locale: "kn-IN", flag: "🇮🇳" },
  ta: { label: "தமிழ் (Tamil)",       locale: "ta-IN", flag: "🇮🇳" },
  te: { label: "తెలుగు (Telugu)",     locale: "te-IN", flag: "🇮🇳" },
  mr: { label: "मराठी (Marathi)",     locale: "mr-IN", flag: "🇮🇳" },
};

const EXAMPLE_QUERIES = [
  "What subsidies are available for small farmers?",
  "How to apply for a student education loan?",
  "Schemes for women entrepreneurs",
  "Pension benefits for senior citizens",
  "Housing schemes for low-income families",
];

const formSchema = z.object({
  query:    z.string().min(3, { message: "Enter at least 3 characters" }),
  language: z.string().default("en"),
  persona:  z.string().default("General"),
});

/* ── Sub-components ──────────────────────────────────────────────────────── */
function ConfidenceBar({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const color = score > 0.8 ? "bg-emerald-500" : score >= 0.5 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] text-muted-foreground font-medium">Confidence</span>
      <div className="w-16">
        <Progress value={pct} className="h-1.5" indicatorClassName={color} />
      </div>
      <span className="text-[11px] font-bold tabular-nums">{pct}%</span>
    </div>
  );
}

function LoadingBubble() {
  return (
    <div className="flex gap-3 items-start">
      <div className="w-8 h-8 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0">
        <Bot className="w-4 h-4 text-teal-600" />
      </div>
      <div className="flex items-center gap-2 bg-card border rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
        <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
        <span className="text-sm text-muted-foreground">Searching policy knowledge base…</span>
      </div>
    </div>
  );
}

function AIResponseCard({ turn }: { turn: ConversationTurn }) {
  const [activeTab, setActiveTab] = useState("summary");
  const [saved, setSaved] = useState(false);
  const { toast } = useToast();

  if (turn.isLoading) return <LoadingBubble />;
  if (!turn.result)   return null;

  const r = turn.result;

  if (r.noDataFound) {
    return (
      <div className="flex gap-3 items-start">
        <div className="w-8 h-8 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0">
          <Bot className="w-4 h-4 text-teal-600" />
        </div>
        <div className="bg-card border border-amber-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm max-w-lg">
          <div className="flex items-center gap-1.5 text-amber-600 mb-1.5">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-semibold">No matching policy found</span>
          </div>
          <p className="text-sm text-muted-foreground">{r.summary}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 items-start">
      <div className="w-8 h-8 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0 mt-1">
        <Bot className="w-4 h-4 text-teal-600" />
      </div>

      <div className="flex-1 max-w-2xl bg-card border rounded-2xl rounded-tl-sm shadow-sm overflow-hidden">
        {/* Header — confidence + actions */}
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-muted/40 border-b">
          <ConfidenceBar score={r.confidenceScore} />
          <div className="flex gap-1">
            <Button
              variant="ghost" size="sm"
              className="h-7 px-2.5 text-xs gap-1.5 hover:bg-background"
              disabled={saved}
              onClick={() => {
                const bm: SavedQuery = {
                  id: turn.id,
                  query: turn.query,
                  summary: r.summary,
                  confidenceScore: r.confidenceScore,
                  savedAt: new Date().toISOString(),
                  language: turn.language,
                  persona: turn.persona,
                  sources: r.sources.map((s) => ({ scheme: s.scheme, source: s.source })),
                };
                saveBookmark(bm);
                setSaved(true);
                toast({ title: "Saved to My Policies" });
              }}
            >
              {saved
                ? <><BookmarkCheck className="w-3.5 h-3.5 text-amber-500" />Saved</>
                : <><Bookmark className="w-3.5 h-3.5" />Save</>}
            </Button>
            <Button
              variant="ghost" size="sm"
              className="h-7 px-2.5 text-xs gap-1.5 hover:bg-background"
              onClick={() => {
                const content = [
                  "NitiAI — Policy Consultation Export",
                  `Date: ${new Date().toLocaleString()}`,
                  `Language: ${LANGUAGES[turn.language]?.label ?? turn.language}`,
                  "",
                  "QUERY", turn.query, "",
                  "SUMMARY", r.summary,
                  r.eligibility        ? `\nELIGIBILITY\n${r.eligibility}`       : "",
                  r.benefits           ? `\nBENEFITS\n${r.benefits}`             : "",
                  r.applicationProcess ? `\nHOW TO APPLY\n${r.applicationProcess}` : "",
                  "\nSOURCES",
                  ...r.sources.map((s) => `• ${s.scheme}: ${s.source}`),
                ].filter(Boolean).join("\n");
                const blob = new Blob([content], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `nitiai-${Date.now()}.txt`;
                a.click();
                URL.revokeObjectURL(url);
                toast({ title: "Exported" });
              }}
            >
              <Download className="w-3.5 h-3.5" />Export
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="px-4 pt-3">
            <TabsList className="h-8 gap-0.5 bg-muted/60">
              <TabsTrigger value="summary"     className="text-xs px-3 h-7">Summary</TabsTrigger>
              {r.eligibility        && <TabsTrigger value="eligibility" className="text-xs px-3 h-7">Eligibility</TabsTrigger>}
              {r.benefits           && <TabsTrigger value="benefits"    className="text-xs px-3 h-7">Benefits</TabsTrigger>}
              {r.applicationProcess && <TabsTrigger value="apply"       className="text-xs px-3 h-7">How to Apply</TabsTrigger>}
              <TabsTrigger value="sources" className="text-xs px-3 h-7">
                Sources ({r.sources.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="px-4 pb-4 pt-3">
            <TabsContent value="summary"     className="mt-0"><p className="text-sm leading-relaxed">{r.summary}</p></TabsContent>
            <TabsContent value="eligibility" className="mt-0"><p className="text-sm leading-relaxed whitespace-pre-line">{r.eligibility}</p></TabsContent>
            <TabsContent value="benefits"    className="mt-0"><p className="text-sm leading-relaxed whitespace-pre-line">{r.benefits}</p></TabsContent>
            <TabsContent value="apply"       className="mt-0"><p className="text-sm leading-relaxed whitespace-pre-line">{r.applicationProcess}</p></TabsContent>
            <TabsContent value="sources"     className="mt-0 space-y-2">
              {r.sources.map((s, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-lg bg-muted/40 border text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{s.scheme}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 truncate">{s.source}</div>
                    <p className="text-xs text-muted-foreground mt-1.5 italic border-l-2 border-teal-500/30 pl-2 line-clamp-2">
                      "{s.text}"
                    </p>
                  </div>
                </div>
              ))}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────────────────────── */
export function Home() {
  const [turns, setTurns]           = useState<ConversationTurn[]>([]);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const chatBottomRef  = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLInputElement>(null);
  const { toast }      = useToast();
  const queryPolicy    = useQueryPolicy();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { query: "", language: "en", persona: "General" },
  });

  /* Auto-scroll to latest turn */
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns]);

  /* Build history array from completed turns */
  function buildHistory(currentTurns: ConversationTurn[]): HistoryTurn[] {
    return currentTurns
      .filter((t) => t.result && !t.isLoading)
      .flatMap((t) => [
        { role: "user"      as const, content: t.query },
        { role: "assistant" as const, content: t.result?.summary ?? "" },
      ])
      .filter((h) => h.content.trim().length > 0);
  }

  /* Submit handler — reads ALL form fields including language & persona */
  function onSubmit(values: z.infer<typeof formSchema>) {
    const turnId  = `turn_${Date.now()}`;
    // Read language + persona directly from form state to be safe
    const language = form.getValues("language") || "en";
    const persona  = form.getValues("persona")  || "General";
    const history  = buildHistory(turns);

    setTurns((prev) => [
      ...prev,
      { id: turnId, query: values.query, language, persona, result: null, isLoading: true },
    ]);
    form.setValue("query", "");
    setTimeout(() => inputRef.current?.focus(), 50);

    queryPolicy.mutate(
      {
        data: {
          query: values.query,
          language,
          persona,
          history,
        } as Parameters<typeof queryPolicy.mutate>[0]["data"],
      },
      {
        onSuccess: (data) => {
          setTurns((prev) =>
            prev.map((t) =>
              t.id === turnId ? { ...t, result: data as PolicyResult, isLoading: false } : t
            )
          );
        },
        onError: () => {
          setTurns((prev) =>
            prev.map((t) =>
              t.id === turnId
                ? {
                    ...t,
                    result: {
                      noDataFound: true,
                      summary: "Something went wrong. Please try again.",
                      sources: [],
                      confidenceScore: 0,
                    },
                    isLoading: false,
                  }
                : t
            )
          );
        },
      }
    );
  }

  const handleExampleClick = (query: string) => {
    form.setValue("query", query);
    form.handleSubmit(onSubmit)();
  };

  /* Voice input — uses the correct locale for the selected language */
  const startVoice = useCallback(() => {
    const SpeechAPI = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SpeechAPI) {
      toast({ title: "Voice not supported", description: "Try Chrome or Edge.", variant: "destructive" });
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const selectedLang = form.getValues("language") ?? "en";
    const locale = LANGUAGES[selectedLang]?.locale ?? "en-IN";

    const r = new SpeechAPI();
    recognitionRef.current = r;
    r.lang            = locale;
    r.interimResults  = false;
    r.onstart  = () => setIsListening(true);
    r.onend    = () => setIsListening(false);
    r.onerror  = () => { setIsListening(false); toast({ title: "Voice input error", variant: "destructive" }); };
    r.onresult = (e) => { form.setValue("query", e.results[0][0].transcript); };
    r.start();
  }, [isListening, form, toast]);

  const hasTurns = turns.length > 0;
  const currentLanguage = form.watch("language") ?? "en";

  return (
    /* Single Form provider wrapping the entire page — one source of truth */
    <Form {...form}>
      <div className="flex flex-col h-full max-w-3xl mx-auto" style={{ minHeight: "calc(100vh - 120px)" }}>

        {/* ── Page header ── */}
        <div className="shrink-0 mb-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Policy Consultation</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Ask about any Indian Government scheme. Follow-up questions keep context.
              </p>
            </div>
            {hasTurns && (
              <Button
                variant="outline" size="sm"
                onClick={() => { setTurns([]); form.setValue("query", ""); setTimeout(() => inputRef.current?.focus(), 50); }}
                className="shrink-0 gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                New Chat
              </Button>
            )}
          </div>

          {/* Language + Persona — inside the single Form context */}
          <div className="flex flex-wrap gap-2.5 mt-4">
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-52 h-9 text-sm bg-card border-border/60">
                        <Globe className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                        <SelectValue placeholder="Language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(LANGUAGES).map(([code, { label, flag }]) => (
                        <SelectItem key={code} value={code}>
                          {flag} {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="persona"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-48 h-9 text-sm bg-card border-border/60">
                        <SelectValue placeholder="I am a…" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="General">👤 General Citizen</SelectItem>
                      <SelectItem value="Farmer">🌾 Farmer</SelectItem>
                      <SelectItem value="Student">📚 Student</SelectItem>
                      <SelectItem value="Entrepreneur">💼 Entrepreneur</SelectItem>
                      <SelectItem value="Senior Citizen">🧓 Senior Citizen</SelectItem>
                      <SelectItem value="Woman">👩 Woman</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            {currentLanguage !== "en" && (
              <Badge variant="secondary" className="h-9 px-3 text-xs font-medium bg-teal-500/10 text-teal-700 border-teal-500/20">
                Responding in {LANGUAGES[currentLanguage]?.label ?? currentLanguage}
              </Badge>
            )}
          </div>
        </div>

        {/* ── Chat area ── */}
        <div className="flex-1 space-y-6 pb-4">

          {/* Empty state */}
          {!hasTurns && (
            <div className="flex flex-col items-center text-center py-12 space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                <MessageSquare className="w-7 h-7 text-teal-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Start a conversation</h2>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                  Ask about any government scheme. Follow-ups remember the full conversation.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center max-w-lg pt-1">
                {EXAMPLE_QUERIES.map((q, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleExampleClick(q)}
                    className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-teal-500 hover:text-white border border-border/60 transition-all duration-150 font-medium"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Conversation turns */}
          {turns.map((turn) => (
            <div key={turn.id} className="space-y-3">
              {/* User message */}
              <div className="flex gap-2.5 items-start justify-end">
                <div className="flex flex-col items-end gap-1">
                  <div className="bg-teal-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-md shadow-sm">
                    <p className="text-sm leading-relaxed">{turn.query}</p>
                  </div>
                  {turn.language !== "en" && (
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Globe className="w-2.5 h-2.5" />
                      {LANGUAGES[turn.language]?.label ?? turn.language}
                    </span>
                  )}
                </div>
                <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* AI response */}
              <AIResponseCard turn={turn} />
            </div>
          ))}

          <div ref={chatBottomRef} />
        </div>

        {/* ── Input bar ── */}
        <div className="shrink-0 sticky bottom-0 bg-background pt-3 pb-1 border-t border-border/60">
          {hasTurns && (
            <p className="text-[11px] text-muted-foreground mb-2 flex items-center gap-1.5">
              <MessageSquare className="w-3 h-3 text-teal-500" />
              {turns.length} exchange{turns.length !== 1 ? "s" : ""} — AI remembers the full conversation
            </p>
          )}

          {/* Single <form> element — handleSubmit reads all fields from the shared store */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        ref={(el) => {
                          field.ref(el);
                          (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = el;
                        }}
                        placeholder={hasTurns ? "Ask a follow-up…" : "Describe your situation or ask about a policy…"}
                        className="pr-10 py-5 text-sm rounded-xl bg-card border-border/70 shadow-sm focus-visible:ring-teal-500/50"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            form.handleSubmit(onSubmit)();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={startVoice}
                        title={isListening ? "Stop listening" : `Voice input (${LANGUAGES[currentLanguage]?.label ?? "English"})`}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors ${
                          isListening ? "text-red-500 animate-pulse" : "text-muted-foreground hover:text-teal-600"
                        }`}
                      >
                        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              size="icon"
              disabled={queryPolicy.isPending}
              className="h-10 w-10 rounded-full bg-teal-600 hover:bg-teal-700 text-white shrink-0 shadow-sm"
            >
              {queryPolicy.isPending
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <Send className="w-4 h-4" />}
            </Button>
          </form>
        </div>

      </div>
    </Form>
  );
}
