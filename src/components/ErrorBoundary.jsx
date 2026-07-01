import { Component } from 'react';
import { RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
          <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
            <RefreshCw size={24} className="text-red-400" />
          </div>
          <h2 className="text-white text-xl font-bold mb-2">Something went wrong</h2>
          <p className="text-gray-500 text-sm mb-6 max-w-xs">
            Don't worry — your progress is saved. Try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary hover:bg-primary/90 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            Refresh Page
          </button>
          {this.state.error && (
            <p className="text-gray-600 text-xs mt-4 font-mono max-w-sm break-all">
              {this.state.error.message}
            </p>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}