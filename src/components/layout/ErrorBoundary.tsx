import { Component, type ErrorInfo, type ReactNode } from 'react';
import { RefreshCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Catches render errors anywhere below it in the tree. Without this, one bad
 * product record or a thrown error inside any single page takes the entire
 * app down to a blank white screen with no fallback UI.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('Unhandled render error:', error, info.componentStack);
  }

  handleReload = () => {
    this.setState({ error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center bg-slate-50 dark:bg-slate-950">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Something went wrong</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
            This page hit an unexpected error. You can go back to the homepage and try again.
          </p>
          <button
            onClick={this.handleReload}
            className="inline-flex items-center gap-2 font-medium bg-brand-600 text-white hover:bg-brand-700 shadow-sm text-sm px-4 py-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
          >
            <RefreshCcw size={16} />
            Back to home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
