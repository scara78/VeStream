import React from 'react';
import { THEME } from '@/constants/config';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    height: '100vh', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    background: THEME.bg, color: '#fff', textAlign: 'center', padding: '2rem'
                }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Something went wrong.</h1>
                    <p style={{ color: THEME.textDim, marginBottom: '2rem', maxWidth: '500px' }}>
                        We encountered an unexpected error. Please try refreshing the page.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            padding: '12px 24px', background: THEME.accent, color: '#000',
                            border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer'
                        }}
                    >
                        Refresh Page
                    </button>
                    <pre style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', color: '#ef4444', fontSize: '0.8rem', overflow: 'auto', maxWidth: '100%' }}>
                        {this.state.error && this.state.error.toString()}
                    </pre>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
