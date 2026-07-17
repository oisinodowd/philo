import Link from "next/link";
import {
  User,
  BookMarked,
  Zap,
  Network,
  Settings,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata = {
  title: "Account",
};

export default function AccountPage() {
  return (
    <div className="container py-6 md:py-10 max-w-4xl animate-fade-in">
      {/* Profile header */}
      <div className="scholar-card mb-8">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-xl bg-primary/10 text-primary">
              <User className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-serif text-xl font-bold">My Account</h1>
            <p className="text-sm text-muted-foreground">
              Manage your reading, energy, and subscription.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="energy" className="space-y-6">
        <TabsList>
          <TabsTrigger value="energy" className="gap-2">
            <Zap className="h-4 w-4" />
            Energy
          </TabsTrigger>
          <TabsTrigger value="graph" className="gap-2">
            <Network className="h-4 w-4" />
            Knowledge Graph
          </TabsTrigger>
          <TabsTrigger value="notes" className="gap-2">
            <BookMarked className="h-4 w-4" />
            Notes
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="energy" className="space-y-4">
          <div className="scholar-card">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-semibold">Energy Charges</h3>
                <p className="text-sm text-muted-foreground">
                  Sign in daily to build your streak and earn more charges.
                </p>
              </div>
              <div className="text-2xl font-bold text-primary">10</div>
            </div>
            <div className="mt-4 flex items-center gap-4 text-sm">
              <span>Streak: 0 days</span>
              <span className="text-muted-foreground">|</span>
              <span>Premium: Inactive</span>
            </div>
          </div>
          <div className="scholar-card">
            <h3 className="font-serif font-semibold">Upgrade to Premium</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Unlimited energy charges, extended AI tutor sessions, exclusive
              early-access corpus content.
            </p>
            <Button className="mt-4" variant="default">
              Manage Subscription
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="graph">
          <div className="scholar-card min-h-[400px] flex items-center justify-center border-dashed">
            <div className="text-center">
              <Network className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground mt-3">
                Your knowledge graph will appear here as you read and annotate.
              </p>
              <Button variant="outline" className="mt-4" asChild>
                <Link href="/philo/sophy">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Browse Philosophers
                </Link>
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notes">
          <div className="scholar-card min-h-[200px] flex items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Your notes and highlights will appear here.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="scholar-card space-y-3">
            <h3 className="font-serif font-semibold">Profile Settings</h3>
            <p className="text-sm text-muted-foreground">
              Display name, avatar, and preferences coming soon.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
