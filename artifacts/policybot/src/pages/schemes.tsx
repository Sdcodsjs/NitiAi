import { useListSchemes } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, ListFilter, Building2 } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export function Schemes() {
  const [sector, setSector] = useState<string>("all");
  const [ministry, setMinistry] = useState<string>("all");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useListSchemes({
    sector: sector !== "all" ? sector : undefined,
    ministry: ministry !== "all" ? ministry : undefined,
  });

  const filteredSchemes = data?.schemes?.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Browse Schemes</h1>
        <p className="text-muted-foreground max-w-3xl text-lg">
          Explore the comprehensive database of government policies, subsidies, and initiatives available to citizens.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-muted/30 p-4 rounded-lg border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search schemes by name or keywords..." 
            className="pl-9 bg-background"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64">
          <Select value={sector} onValueChange={setSector}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="All Sectors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sectors</SelectItem>
              <SelectItem value="Agriculture">Agriculture</SelectItem>
              <SelectItem value="Health">Health</SelectItem>
              <SelectItem value="Education">Education</SelectItem>
              <SelectItem value="Housing">Housing</SelectItem>
              <SelectItem value="Social Security">Social Security</SelectItem>
              <SelectItem value="Entrepreneurship">Entrepreneurship</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="flex flex-col h-[250px]">
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="flex-1">
                <Skeleton className="h-20 w-full mb-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredSchemes && filteredSchemes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes.map((scheme) => (
            <Card key={scheme.id} className="flex flex-col hover:border-primary/50 transition-colors shadow-sm hover:shadow-md cursor-pointer group">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 hover:bg-primary/10">
                    <ListFilter className="w-3 h-3 mr-1" />
                    {scheme.sector}
                  </Badge>
                </div>
                <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors line-clamp-2">
                  {scheme.name}
                </CardTitle>
                <CardDescription className="flex items-center text-xs mt-2">
                  <Building2 className="w-3 h-3 mr-1" />
                  {scheme.ministry}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between pt-0">
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {scheme.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {scheme.tags.slice(0, 3).map((tag, i) => (
                    <Badge key={i} variant="secondary" className="text-[10px] px-1.5 py-0">
                      {tag}
                    </Badge>
                  ))}
                  {scheme.tags.length > 3 && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      +{scheme.tags.length - 3} more
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/20 rounded-lg border border-dashed">
          <ListFilter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No schemes found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters to find what you're looking for.</p>
        </div>
      )}
    </div>
  );
}
