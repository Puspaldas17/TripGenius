import { useTripStore } from "@/store/tripStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CURRENCIES, CurrencyCode } from "@/lib/currency";
import { DollarSign } from "lucide-react";

export function CurrencySelector() {
  const { budgetCurrency, setBudgetCurrency } = useTripStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-lg hover:bg-primary/5"
          title="Change Currency"
        >
          <DollarSign className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
          <DropdownMenuItem
            key={code}
            onClick={() => setBudgetCurrency(code)}
            className={`flex items-center justify-between ${budgetCurrency === code ? "bg-accent" : ""}`}
          >
            <span>{CURRENCIES[code].label}</span>
            <span className="font-semibold text-muted-foreground">{code}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
