"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Apple, Coffee, Sun, Moon, Droplets, Flame } from "lucide-react";

interface Profile {
  diet_type: string | null;
  fitness_goal: string | null;
  water_goal: number | null;
}

const vegetarianMeals = {
  breakfast: [
    { name: "Oatmeal with Fruits", calories: 350, protein: "12g", carbs: "55g", fat: "8g" },
    { name: "Paneer Paratha with Curd", calories: 450, protein: "18g", carbs: "45g", fat: "22g" },
    { name: "Sprouts Salad with Toast", calories: 280, protein: "15g", carbs: "35g", fat: "6g" },
  ],
  lunch: [
    { name: "Dal Rice with Vegetables", calories: 520, protein: "20g", carbs: "75g", fat: "12g" },
    { name: "Paneer Tikka with Roti", calories: 480, protein: "25g", carbs: "40g", fat: "18g" },
    { name: "Rajma Chawal", calories: 500, protein: "22g", carbs: "70g", fat: "10g" },
  ],
  dinner: [
    { name: "Vegetable Soup with Multigrain Bread", calories: 320, protein: "12g", carbs: "45g", fat: "8g" },
    { name: "Palak Paneer with Roti", calories: 420, protein: "22g", carbs: "35g", fat: "20g" },
    { name: "Mixed Dal Khichdi", calories: 380, protein: "18g", carbs: "55g", fat: "8g" },
  ],
  snacks: [
    { name: "Protein Smoothie", calories: 200, protein: "20g", carbs: "25g", fat: "4g" },
    { name: "Roasted Chana", calories: 150, protein: "10g", carbs: "20g", fat: "3g" },
    { name: "Mixed Nuts", calories: 180, protein: "6g", carbs: "8g", fat: "15g" },
  ],
};

const nonVegetarianMeals = {
  breakfast: [
    { name: "Egg White Omelette with Toast", calories: 320, protein: "25g", carbs: "30g", fat: "10g" },
    { name: "Boiled Eggs with Whole Wheat Bread", calories: 380, protein: "22g", carbs: "35g", fat: "15g" },
    { name: "Greek Yogurt with Granola", calories: 350, protein: "18g", carbs: "45g", fat: "12g" },
  ],
  lunch: [
    { name: "Grilled Chicken Breast with Rice", calories: 520, protein: "45g", carbs: "50g", fat: "12g" },
    { name: "Fish Curry with Brown Rice", calories: 480, protein: "38g", carbs: "45g", fat: "15g" },
    { name: "Chicken Salad Bowl", calories: 420, protein: "40g", carbs: "25g", fat: "18g" },
  ],
  dinner: [
    { name: "Grilled Fish with Vegetables", calories: 380, protein: "35g", carbs: "20g", fat: "15g" },
    { name: "Chicken Soup with Bread", calories: 320, protein: "28g", carbs: "30g", fat: "10g" },
    { name: "Egg Bhurji with Roti", calories: 400, protein: "25g", carbs: "35g", fat: "18g" },
  ],
  snacks: [
    { name: "Protein Shake", calories: 220, protein: "30g", carbs: "15g", fat: "5g" },
    { name: "Boiled Egg Whites", calories: 100, protein: "18g", carbs: "2g", fat: "1g" },
    { name: "Chicken Breast Strips", calories: 180, protein: "28g", carbs: "2g", fat: "6g" },
  ],
};

export default function DietPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("diet_type, fitness_goal, water_goal")
        .eq("id", user.id)
        .single();

      setProfile(data);
      setIsLoading(false);
    }

    loadProfile();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const meals = profile?.diet_type === "Non-Vegetarian" ? nonVegetarianMeals : vegetarianMeals;

  const mealSections = [
    { key: "breakfast", title: "Breakfast", icon: Coffee, time: "7:00 AM - 9:00 AM" },
    { key: "lunch", title: "Lunch", icon: Sun, time: "12:00 PM - 2:00 PM" },
    { key: "dinner", title: "Dinner", icon: Moon, time: "7:00 PM - 9:00 PM" },
    { key: "snacks", title: "Snacks", icon: Apple, time: "Between meals" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Diet Plan</h1>
        <p className="text-muted-foreground mt-1">
          Your personalized {profile?.diet_type || "Vegetarian"} meal recommendations
        </p>
      </div>

      {/* Diet Info Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Apple className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Diet Type</p>
              <p className="font-semibold text-foreground">{profile?.diet_type || "Vegetarian"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Droplets className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Water Goal</p>
              <p className="font-semibold text-foreground">{profile?.water_goal || 8} glasses/day</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Flame className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Daily Target</p>
              <p className="font-semibold text-foreground">~2000 kcal</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Meal Plans */}
      <div className="grid md:grid-cols-2 gap-6">
        {mealSections.map((section) => (
          <Card key={section.key}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <section.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                    <CardDescription>{section.time}</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {meals[section.key as keyof typeof meals].map((meal, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg bg-secondary/50 border border-border space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground">{meal.name}</h4>
                    <Badge variant="secondary">{meal.calories} kcal</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span>Protein: {meal.protein}</span>
                    <span>|</span>
                    <span>Carbs: {meal.carbs}</span>
                    <span>|</span>
                    <span>Fat: {meal.fat}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tips Card */}
      <Card>
        <CardHeader>
          <CardTitle>Diet Tips</CardTitle>
          <CardDescription>Follow these guidelines for best results</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">1.</span>
              <span>Drink water 30 minutes before meals for better digestion</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">2.</span>
              <span>Eat slowly and chew your food properly</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">3.</span>
              <span>Avoid processed foods and sugary drinks</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">4.</span>
              <span>Have your last meal at least 2-3 hours before sleeping</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">5.</span>
              <span>Include protein in every meal for muscle recovery</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
