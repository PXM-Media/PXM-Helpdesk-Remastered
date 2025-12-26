import { getArticleBySlug } from "@/lib/actions/knowledge-base";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar";
import { Badge } from "@repo/ui/badge";
import { MoveLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@repo/ui/button";

export const dynamic = "force-dynamic";

export default async function ArticlePage({ params }: { params: { slug: string } }) {
    const { data: article } = await getArticleBySlug(params.slug);

    if (!article || article.status !== "PUBLISHED") {
        return notFound();
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <Link href="/portal/articles">
                <Button variant="ghost" className="pl-0 hover:pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground">
                    <MoveLeft className="mr-2 h-4 w-4" />
                    Back to Knowledge Base
                </Button>
            </Link>

            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                    <Badge variant="secondary" className="text-xs">
                        {article.category?.name}
                    </Badge>
                </div>

                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                    {article.title}
                </h1>

                <div className="flex items-center gap-4 py-4 border-b">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={article.author?.image || ""} />
                            <AvatarFallback>{article.author?.name?.[0] || "?"}</AvatarFallback>
                        </Avatar>
                        <div className="text-sm">
                            <p className="font-medium leading-none">{article.author?.name}</p>
                            <p className="text-muted-foreground mt-0.5">
                                Updated {formatDistanceToNow(new Date(article.updatedAt), { addSuffix: true })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <article className="prose prose-zinc dark:prose-invert max-w-none">
                {/* 
                    In a real app, we would use a library like 'markdown-to-jsx' or 'react-markdown' here.
                    For now, we will just render the raw markdown in a pre-wrap div or similar 
                    if we don't have the library installed. 
                    
                    Assuming we might not have 'react-markdown', we'll rely on simple rendering 
                    or just inject HTML if we trust it (dangerous). 
                    
                    Let's just display it as whitespace-pre-wrap for safety if no parser is present,
                    or try to simple line break it.
                 */}
                <div className="whitespace-pre-wrap font-serif text-lg leading-relaxed">
                    {article.content}
                </div>
            </article>

            <div className="pt-8 border-t mt-12">
                <div className="bg-muted/50 rounded-lg p-6 text-center">
                    <h3 className="text-lg font-semibold mb-2">Still need help?</h3>
                    <p className="text-muted-foreground mb-4">
                        Can't find what you're looking for? Our support team is here to help.
                    </p>
                    <Link href="/portal/tickets/new">
                        <Button>Contact Support</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
