import React from "react";
import { Button } from "@/components/ui/button";

type Props = { children: React.ReactNode };
type State = { hasError: boolean; message?: string };

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, message: String(error?.message || error) };
  }
  componentDidCatch(error: any, info: any) {
    // Optional: send to monitoring endpoint here
    console.error("[ErrorBoundary]", error, info);
  }
  reset = () => {
    this.setState({ hasError: false, message: undefined });
    // Soft reload to ensure clean state
    try { if (typeof window !== "undefined") window.scrollTo(0, 0); } catch {}
  };
  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-2xl px-4 py-10 text-center">
          <h2 className="text-2xl font-semibold">Something went wrong</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {this.state.message || "An unexpected error occurred."}
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <Button onClick={this.reset}>Try again</Button>
            <Button variant="outline" onClick={() => (window.location.href = window.location.href)}>
              Reload page
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children as any;
  }
}
