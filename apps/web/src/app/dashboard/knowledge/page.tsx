import { getCategories, getArticles, createCategory, createArticle } from "@/lib/actions/knowledge-base";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { Textarea } from "@repo/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@repo/ui/dialog";
import { Plus, FolderPlus, FileText, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Badge } from "@repo/ui/badge";

export const dynamic = "force-dynamic";

export default async function KnowledgeBasePage() {
    const { data: categories = [] } = await getCategories();
    const { data: articles = [] } = await getArticles();

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Knowledge Base</h2>
                <div className="flex items-center space-x-2">
                    <Link href="/portal/articles" target="_blank">
                        <Button variant="outline">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Portal
                        </Button>
                    </Link>
                </div>
            </div>

            <Tabs defaultValue="articles" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="articles">Articles</TabsTrigger>
                    <TabsTrigger value="categories">Categories</TabsTrigger>
                </TabsList>

                <TabsContent value="articles" className="space-y-4">
                    <div className="flex justify-end">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    New Article
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[725px]">
                                <DialogHeader>
                                    <DialogTitle>Create Article</DialogTitle>
                                    <DialogDescription>
                                        Add a new help article to the knowledge base.
                                    </DialogDescription>
                                </DialogHeader>
                                <form action={async (formData) => {
                                    "use server";
                                    const title = formData.get("title") as string;
                                    const slug = title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
                                    const categoryId = parseInt(formData.get("categoryId") as string);
                                    const content = formData.get("content") as string;

                                    await createArticle({
                                        title,
                                        slug,
                                        categoryId,
                                        content,
                                        status: "PUBLISHED" // Default for MVP
                                    });
                                }}>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="title" className="text-right">Title</Label>
                                            <Input id="title" name="title" className="col-span-3" required />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="category" className="text-right">Category</Label>
                                            <select id="category" name="categoryId" className="col-span-3 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" required>
                                                {categories?.map((cat: any) => (
                                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="content" className="text-right">Content (Markdown)</Label>
                                            <Textarea id="content" name="content" className="col-span-3 min-h-[200px]" required />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit">Publish Article</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {articles?.map((article: any) => (
                            <Card key={article.id}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        {article.category?.name}
                                    </CardTitle>
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold truncate" title={article.title}>{article.title}</div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge variant={article.status === "PUBLISHED" ? "default" : "secondary"}>
                                            {article.status}
                                        </Badge>
                                        <p className="text-xs text-muted-foreground">
                                            {article.views} views
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="categories" className="space-y-4">
                    <div className="flex justify-end">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="secondary">
                                    <FolderPlus className="mr-2 h-4 w-4" />
                                    New Category
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create Category</DialogTitle>
                                </DialogHeader>
                                <form action={async (formData) => {
                                    "use server";
                                    const name = formData.get("name") as string;
                                    const slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
                                    const description = formData.get("description") as string;
                                    await createCategory({ name, slug, description });
                                }}>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="cat-name" className="text-right">Name</Label>
                                            <Input id="cat-name" name="name" className="col-span-3" required />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="cat-desc" className="text-right">Description</Label>
                                            <Input id="cat-desc" name="description" className="col-span-3" />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit">Create Category</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="rounded-md border">
                        <div className="p-4">
                            <h3 className="font-semibold mb-4">Active Categories</h3>
                            <div className="space-y-2">
                                {categories?.map((cat: any) => (
                                    <div key={cat.id} className="flex items-center justify-between p-2 hover:bg-muted rounded-md bg-card border">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-primary/10 rounded-md flex items-center justify-center">
                                                <FolderPlus className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <div className="font-medium">{cat.name}</div>
                                                <div className="text-sm text-muted-foreground">{cat.description}</div>
                                            </div>
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {cat.articles?.length || 0} articles
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
