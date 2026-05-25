import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Lightbulb, Loader2, Target, CheckCircle2 } from "lucide-react";
import { useRecommendPolicies } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel, FormDescription } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

const INTERESTS = [
  { id: "agriculture", label: "Agriculture & Farming" },
  { id: "education", label: "Education & Scholarships" },
  { id: "health", label: "Health & Medical" },
  { id: "business", label: "Business & Entrepreneurship" },
  { id: "housing", label: "Housing & Real Estate" },
  { id: "pension", label: "Pensions & Social Security" },
];

const formSchema = z.object({
  persona: z.string().min(10, "Please provide more details about your situation (min 10 characters)"),
  interests: z.array(z.string()).default([]),
});

export function Recommend() {
  const recommendPolicies = useRecommendPolicies();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      persona: "",
      interests: [],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    recommendPolicies.mutate({ data: values });
  }

  const result = recommendPolicies.data;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="flex flex-col space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-accent/10 rounded-full w-14 h-14 mb-2">
          <Lightbulb className="w-8 h-8 text-accent-foreground" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Policy Recommendations</h1>
        <p className="text-muted-foreground text-lg">
          Tell us about yourself and your current situation, and our AI will recommend the most relevant government schemes for you.
        </p>
      </div>

      <Card className="shadow-md border-accent/30">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="persona"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">Describe your situation</FormLabel>
                    <FormDescription>
                      Include details like your age, occupation, location, income level, and what kind of assistance you're looking for.
                    </FormDescription>
                    <FormControl>
                      <Textarea 
                        placeholder="e.g. I am a 22-year-old female college student in Karnataka looking for higher education scholarships. My family's annual income is under 2 Lakhs." 
                        className="min-h-[150px] text-base p-4 resize-none bg-muted/30 focus-visible:ring-accent"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="interests"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-lg font-semibold">Areas of Interest (Optional)</FormLabel>
                      <FormDescription>Select specific sectors you are interested in.</FormDescription>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {INTERESTS.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="interests"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item.id}
                                className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, item.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== item.id
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer w-full">
                                  {item.label}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                size="lg" 
                className="w-full text-lg py-6 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold" 
                disabled={recommendPolicies.isPending}
              >
                {recommendPolicies.isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Target className="mr-2 h-5 w-5" />}
                Get Tailored Recommendations
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-6 pt-4 animate-in slide-in-from-bottom-8 duration-700">
          <h2 className="text-2xl font-bold border-b pb-2 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-green-500" />
            Top Matches for You
          </h2>
          
          <div className="grid grid-cols-1 gap-6">
            {result.recommendations.map((rec, index) => (
              <Card 
                key={index} 
                className="overflow-hidden border-l-4 border-l-accent shadow-sm hover:shadow-md transition-shadow delay-100"
                style={{ animationFillMode: 'both', animationDelay: `${index * 150}ms` }}
              >
                <CardHeader className="bg-muted/20 pb-4">
                  <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-xl">{rec.name}</CardTitle>
                    <Badge variant="outline" className="shrink-0">{rec.sector}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div>
                    <h4 className="font-semibold text-primary mb-1 flex items-center gap-1">
                      <Target className="w-4 h-4" /> Why this matches you
                    </h4>
                    <p className="text-muted-foreground">{rec.matchReason}</p>
                  </div>
                  
                  <div className="bg-secondary/5 p-4 rounded-lg border border-secondary/10">
                    <p className="text-sm leading-relaxed">{rec.summary}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {rec.eligibilityHighlight && (
                      <div className="border-l-2 border-muted pl-3">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Key Eligibility</span>
                        <p className="text-sm mt-1">{rec.eligibilityHighlight}</p>
                      </div>
                    )}
                    {rec.benefitHighlight && (
                      <div className="border-l-2 border-green-500/50 pl-3">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Core Benefit</span>
                        <p className="text-sm mt-1">{rec.benefitHighlight}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {result.recommendations.length === 0 && (
              <div className="text-center py-12 bg-muted/20 rounded-lg">
                <p className="text-muted-foreground text-lg">No strong recommendations found for this specific profile. Try adjusting your description.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
