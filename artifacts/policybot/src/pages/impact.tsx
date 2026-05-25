import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BarChart2, Loader2, IndianRupee, CheckCircle2 } from "lucide-react";
import { useSimulatePolicyImpact } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel, FormDescription } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const formSchema = z.object({
  annualIncome: z.string().min(1, "Annual income is required"),
  landHolding: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  state: z.string().optional(),
  occupation: z.string().min(1, "Occupation is required"),
  age: z.string().optional(),
});

export function Impact() {
  const simulateImpact = useSimulatePolicyImpact();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      annualIncome: "",
      landHolding: "",
      category: "",
      state: "",
      occupation: "",
      age: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    simulateImpact.mutate({ data: values });
  }

  const result = simulateImpact.data;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="flex flex-col space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 rounded-full w-14 h-14 mb-2">
          <BarChart2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Policy Impact Simulator</h1>
        <p className="text-muted-foreground text-lg">
          Enter your profile — income, land, category, occupation — and get a personalised list of government schemes you qualify for, along with estimated total benefits.
        </p>
      </div>

      <Card className="shadow-md border-indigo-500/20">
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>All fields help narrow down the most relevant schemes. Only category and occupation are required.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="annualIncome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Annual Family Income (INR)</FormLabel>
                      <FormDescription>Your household's total annual income</FormDescription>
                      <FormControl>
                        <Input
                          placeholder="e.g. 120000"
                          data-testid="input-annual-income"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="landHolding"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Land Holding (Acres)</FormLabel>
                      <FormDescription>Total cultivable land you own (if applicable)</FormDescription>
                      <FormControl>
                        <Input
                          placeholder="e.g. 2.5 (0 if none)"
                          data-testid="input-land-holding"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Social Category</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger data-testid="select-category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="General">General</SelectItem>
                            <SelectItem value="OBC">OBC</SelectItem>
                            <SelectItem value="SC">Scheduled Caste (SC)</SelectItem>
                            <SelectItem value="ST">Scheduled Tribe (ST)</SelectItem>
                            <SelectItem value="EWS">Economically Weaker Section (EWS)</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="occupation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Occupation</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger data-testid="select-occupation">
                            <SelectValue placeholder="Select occupation" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Farmer">Farmer / Agriculturist</SelectItem>
                            <SelectItem value="Student">Student</SelectItem>
                            <SelectItem value="Small Business">Small Business Owner</SelectItem>
                            <SelectItem value="Daily Wage">Daily Wage Laborer</SelectItem>
                            <SelectItem value="Self Employed">Self Employed</SelectItem>
                            <SelectItem value="Unemployed">Unemployed / Job Seeker</SelectItem>
                            <SelectItem value="Retired">Retired / Senior Citizen</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Karnataka" data-testid="input-state" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 28" data-testid="input-age" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full text-lg bg-indigo-600 hover:bg-indigo-700 text-white"
                disabled={simulateImpact.isPending}
                data-testid="button-simulate"
              >
                {simulateImpact.isPending
                  ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Calculating...</>
                  : <><BarChart2 className="mr-2 h-5 w-5" /> Simulate My Benefits</>}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          {result.totalEstimatedBenefit && (
            <Card className="bg-indigo-600 text-white border-indigo-700">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-indigo-200 font-medium uppercase tracking-wider text-sm">Estimated Annual Benefit</p>
                  <p className="text-4xl font-extrabold mt-1">{result.totalEstimatedBenefit}</p>
                </div>
                <IndianRupee className="w-16 h-16 text-indigo-300 opacity-50" />
              </CardContent>
            </Card>
          )}

          <h2 className="text-2xl font-bold">
            {result.eligibleSchemes.length} Scheme{result.eligibleSchemes.length !== 1 ? "s" : ""} You May Qualify For
          </h2>

          <div className="space-y-4">
            {result.eligibleSchemes.map((scheme, i) => (
              <Card
                key={i}
                className="overflow-hidden border-l-4 border-l-indigo-500 shadow-sm hover:shadow-md transition-shadow"
                data-testid={`card-scheme-${i}`}
              >
                <CardHeader className="pb-3 bg-muted/20">
                  <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-lg">{scheme.name}</CardTitle>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="outline" className="shrink-0">{scheme.sector}</Badge>
                      {scheme.estimatedBenefit && (
                        <span className="text-sm font-bold text-green-600">{scheme.estimatedBenefit}</span>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  <p className="text-muted-foreground text-sm">{scheme.reason}</p>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-muted-foreground font-medium">Eligibility match:</span>
                    <Progress
                      value={scheme.matchScore * 100}
                      className="w-28 h-1.5"
                      indicatorClassName="bg-indigo-500"
                    />
                    <span className="font-bold">{Math.round(scheme.matchScore * 100)}%</span>
                  </div>
                  {scheme.actionRequired && (
                    <div className="flex items-start gap-2 pt-1 text-sm text-primary">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                      <span>{scheme.actionRequired}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {result.eligibleSchemes.length === 0 && (
              <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
                <p className="text-muted-foreground">No specific schemes found matching this exact profile. Try adjusting the income or category.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
