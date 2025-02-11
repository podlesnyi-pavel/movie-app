import React, { ReactNode } from 'react';

export default class ErrorBoundary extends React.Component<
  {
    children: ReactNode;
  },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1 style={{ textAlign: 'center' }}>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
