import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Placeholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center md:px-6">
      <h1 className="text-3xl font-extrabold">{title}</h1>
      <p className="mt-2 text-muted-foreground">{description}</p>
      <div className="mt-6">
        <Button asChild>
          <Link to="/planner">Open Planner</Link>
        </Button>
      </div>
    </div>
  );
}
