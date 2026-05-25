import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ShieldCheck, Loader2, CheckCircle2, XCircle, AlertTriangle, ExternalLink } from "lucide-react";
import { useVerifyClaim } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel, FormDescription } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const formSchema = z.object({
  statement: z.string().min(10, "Please enter a statement of at least 10 characters to verify"),
});

const EXAMPLE_CLAIMS = [
  "PM-KISAN provides Rs. 6,000 per year to all farmers in three installments.",
  "Ayushman Bharat covers up to Rs. 10 lakh per family annually for hospitalization.",
  "MUDRA Yojana loans are available for any type of business activity including farming.",
  "The fake Universal Lunar Farm Subsidy gives Rs. 50,000 to all rural households.",
];

type VerdictType = "SUPPORTED" | "NOT_FOUND" | "PARTIALLY_TRUE" | "FALSE";

function VerdictBadge({ verdict }: { verdict: VerdictType }) {
  if (verdict === "SUPPORTED") return (
    <div className="flex items-center gap-2 text-green-600">
      <CheckCircle2 className="w-6 h-6" />
      <span className="font-bold text-lg">Supported</span>
    </div>
  );
  if (verdict === "FALSE") return (
    <div className="flex items-center gap-2 text-red-600">
      <XCircle className="w-6 h-6" />
      <span className="font-bold text-lg">Not Supported / False</span>
    </div>
  );
  if (verdict === "PARTIALLY_TRUE") return (
    <div className="flex items-center gap-2 text-amber-600">
      <AlertTriangle className="w-6 h-6" />
      <span className="font-bold text-lg">Partially True</span>
    </div>
  );
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <AlertTriangle className="w-6 h-6" />
      <span className="font-bold text-lg">Not Found in Database</span>
    </div>
  );
}

function verdictBorderClass(verdict: VerdictType) {
  if (verdict === "SUPPORTED") return "border-t-green-500";
  if (verdict === "FALSE") return "border-t-red-500";
  if (verdict === "PARTIALLY_TRUE") return "border-t-amber-500";
  return "border-t-muted-foreground";
}

export function Verify() {
  const verifyClaim = useVerifyClaim();
  const [activeExample, setActiveExample] = useState<number | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { statement: "" },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    verifyClaim.mutate({ data: values });
  }

  function loadExample(i: number) {
    setActiveExample(i);
    form.setValue("statement", EXAMPLE_CLAIMS[i]);
    form.handleSubmit(onSubmit)();
  }

  const result = verifyClaim.data;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="flex flex-col space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-green-500/10 rounded-full w-14 h-14 mb-2">
          <ShieldCheck className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Claim Verification</h1>
        <p className="text-muted-foreground text-lg">
          Paste any statement about a government policy. PolicyBot will verify it against its grounded knowledge base and return a verdict with evidence.
        </p>
      </div>

      <Card className="shadow-md border-green-500/20">
        <CardHeader>
          <CardTitle>Paste a Statement to Verify</CardTitle>
          <CardDescription>
            The system checks the claim against retrieved policy documents only — no hallucination.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="statement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Statement</FormLabel>
                    <FormDescription>Enter the claim you want to fact-check against government policy data.</FormDescription>
                    <FormControl>
                      <Textarea
                        placeholder='e.g. "PM-KISAN provides Rs. 6,000 per year to all farmers..."'
                        className="min-h-[130px] text-base p-4 resize-none bg-muted/30 focus-visible:ring-green-500"
                        data-testid="input-statement"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                size="lg"
                className="w-full text-lg bg-green-600 hover:bg-green-700 text-white"
                disabled={verifyClaim.isPending}
                data-testid="button-verify"
              >
                {verifyClaim.isPending
                  ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Verifying...</>
                  : <><ShieldCheck className="mr-2 h-5 w-5" /> Verify Claim</>}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Try These Examples</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {EXAMPLE_CLAIMS.map((claim, i) => (
            <button
              key={i}
              onClick={() => loadExample(i)}
              data-testid={`button-example-${i}`}
              className={`text-left text-sm p-3 rounded-lg border transition-colors hover:border-primary/50 hover:bg-muted/40 ${activeExample === i ? "border-primary bg-primary/5" : "bg-muted/20"}`}
            >
              "{claim.slice(0, 80)}..."
            </button>
          ))}
        </div>
      </div>

      {result && (
        <Card className={`animate-in slide-in-from-bottom-4 duration-500 overflow-hidden border-t-4 shadow-lg ${verdictBorderClass(result.verdict as VerdictType)}`}>
          <CardHeader className="bg-muted/30 pb-4 border-b">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <VerdictBadge verdict={result.verdict as VerdictType} />
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground">Confidence:</span>
                <div className="w-28">
                  <Progress
                    value={Math.round(result.confidenceScore * 100)}
                    className="h-2"
                    indicatorClassName={result.confidenceScore > 0.8 ? "bg-green-500" : result.confidenceScore >= 0.5 ? "bg-amber-500" : "bg-red-500"}
                  />
                </div>
                <span className="text-sm font-bold">{Math.round(result.confidenceScore * 100)}%</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Analysis</h3>
              <p className="text-lg leading-relaxed">{result.explanation}</p>
            </div>

            {result.corrections && (
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-1">Corrections / Clarifications</h3>
                <p className="text-sm text-amber-900 dark:text-amber-200">{result.corrections}</p>
              </div>
            )}

            {result.sources.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Evidence Sources</h3>
                <div className="space-y-3">
                  {result.sources.map((source, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-lg bg-muted/30 border text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold flex items-center gap-2">
                          {source.scheme}
                          <a href={source.source} target="_blank" rel="noreferrer" className="text-primary hover:underline inline-flex items-center gap-0.5">
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <p className="text-muted-foreground italic mt-1 border-l-2 border-primary/30 pl-2">"{source.text}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-2">
              <Badge variant="outline">Grounded: Retrieved context only</Badge>
              <Badge variant="outline">No hallucination guarantee</Badge>
              {result.sources.length > 0 && <Badge variant="outline">{result.sources.length} source(s) checked</Badge>}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
