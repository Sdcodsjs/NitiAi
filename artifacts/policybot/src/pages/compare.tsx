import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Scale, Loader2, Plus, X } from "lucide-react";
import { useComparePolicies } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";

const formSchema = z.object({
  schemes: z.array(z.string().min(2, "Scheme name must be valid")).min(2, "At least two schemes are required"),
  query: z.string().optional(),
});

export function Compare() {
  const comparePolicies = useComparePolicies();
  const [schemeInputs, setSchemeInputs] = useState<string[]>(["", ""]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      schemes: ["", ""],
      query: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Filter out empty strings
    const validSchemes = values.schemes.filter(s => s.trim().length > 0);
    if (validSchemes.length >= 2) {
      comparePolicies.mutate({ data: { schemes: validSchemes, query: values.query } });
    }
  }

  const addSchemeInput = () => {
    if (schemeInputs.length < 4) {
      setSchemeInputs([...schemeInputs, ""]);
      const currentSchemes = form.getValues("schemes");
      form.setValue("schemes", [...currentSchemes, ""]);
    }
  };

  const removeSchemeInput = (index: number) => {
    if (schemeInputs.length > 2) {
      const newInputs = [...schemeInputs];
      newInputs.splice(index, 1);
      setSchemeInputs(newInputs);
      
      const currentSchemes = form.getValues("schemes");
      const newSchemes = [...currentSchemes];
      newSchemes.splice(index, 1);
      form.setValue("schemes", newSchemes);
    }
  };

  const result = comparePolicies.data;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="flex flex-col space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-secondary/10 rounded-full w-14 h-14 mb-2">
          <Scale className="w-8 h-8 text-secondary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Compare Policies</h1>
        <p className="text-muted-foreground text-lg">
          Evaluate multiple government schemes side-by-side to understand which one best suits your needs.
        </p>
      </div>

      <Card className="shadow-md border-secondary/20">
        <CardHeader>
          <CardTitle>Select Schemes to Compare</CardTitle>
          <CardDescription>Enter 2 to 4 scheme names</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {schemeInputs.map((_, index) => (
                  <FormField
                    key={index}
                    control={form.control}
                    name={`schemes.${index}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Scheme {index + 1}</FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input placeholder="e.g. PM Kisan Samman Nidhi" {...field} />
                          </FormControl>
                          {index >= 2 && (
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="icon"
                              onClick={() => removeSchemeInput(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              {schemeInputs.length < 4 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  className="border-dashed w-full py-6 text-muted-foreground hover:text-foreground"
                  onClick={addSchemeInput}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add another scheme
                </Button>
              )}

              <FormField
                control={form.control}
                name="query"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specific aspect to compare (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Eligibility criteria or maximum subsidy amount" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" size="lg" className="w-full text-lg" disabled={comparePolicies.isPending}>
                {comparePolicies.isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Scale className="mr-2 h-5 w-5" />}
                Compare Now
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result && (
        <Card className="animate-in slide-in-from-bottom-4 shadow-lg overflow-hidden border-t-4 border-t-secondary">
          <CardHeader className="bg-muted/30">
            <CardTitle>Comparison Results</CardTitle>
            <p className="text-muted-foreground mt-2">{result.summary}</p>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary text-secondary-foreground">
                <TableRow className="hover:bg-secondary">
                  <TableHead className="w-[200px] text-secondary-foreground font-bold">Aspect</TableHead>
                  {result.schemes.map((scheme, i) => (
                    <TableHead key={i} className="text-secondary-foreground font-bold text-lg min-w-[250px]">{scheme}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.comparisonRows.map((row, i) => (
                  <TableRow key={i} className={i % 2 === 0 ? "bg-muted/10" : ""}>
                    <TableCell className="font-semibold align-top">{row.aspect}</TableCell>
                    {result.schemes.map((scheme, j) => (
                      <TableCell key={j} className="align-top whitespace-pre-line leading-relaxed">
                        {row.values[scheme] || "N/A"}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
