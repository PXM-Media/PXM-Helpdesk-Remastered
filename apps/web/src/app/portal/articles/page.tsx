import { getCategories, getArticles } from "@/lib/actions/knowledge-base";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import { Search, Book, FileText, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@repo/ui/badge";

export const dynamic = "force-dynamic";

export default async function PortalKnowledgeBasePage() {
    const { data: categories = [] } = await getCategories();
    // In a real app, we'd probably want to highlight "Popular" or "Recent" articles here.
    const { data: recentArticles = [] } = await getArticles(); // Gets all for now, filter in UI or API later

    const publishedArticles = recentArticles.filter((a: any) => a.status === "PUBLISHED");

    return (
        <div className="space-y-8">
            <div className="space-y-4 text-center py-8">
                <h1 className="text-3xl font-bold tracking-tight">How can we help you?</h1>
                <div className="max-w-xl mx-auto relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search for articles..." className="pl-10 h-10" />
                </div>
            </div>

            <div className="space-y-6">
                <h2 className="text-xl font-semibold">Browse by Category</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {categories?.map((cat: any) => (
                        <Card key={cat.id} className="hover:border-primary/50 transition-colors cursor-pointer group">
                            <Link href={`/portal/articles?category=${cat.id}`} className="block h-full">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                            <Book className="h-5 w-5 text-primary" />
                                        </div>
                                        {/* <Badge variant="secondary">{cat.articles.length} articles</Badge> */}
                                    </div>
                                    <CardTitle className="mt-4">{cat.name}</CardTitle>
                                    <CardDescription>{cat.description || "Browse articles"}</CardDescription>
                                </CardHeader>
                            </Link>
                        </Card>
                    ))}
                </div>
            </div>

            <div className="space-y-6">
                <h2 className="text-xl font-semibold">Recent Articles</h2>
                <div className="grid gap-4">
                    {publishedArticles.slice(0, 5).map((article: any) => (
                        <Link key={article.id} href={`/portal/articles/${article.slug}`}>
                            <div className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="h-8 w-8 bg-muted rounded-full flex items-center justify-center">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <div className="font-medium">{article.title}</div>
                                        <div className="text-sm text-muted-foreground">
                                            In {article.category?.name}
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
