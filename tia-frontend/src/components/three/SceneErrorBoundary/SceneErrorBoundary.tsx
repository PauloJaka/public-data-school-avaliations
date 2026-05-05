'use client';

import { Component, type ReactNode } from 'react';

interface Props { children: ReactNode; fallback?: ReactNode }
interface State { error: boolean }

export class SceneErrorBoundary extends Component<Props, State> {
  state: State = { error: false };
  static getDerivedStateFromError(): State { return { error: true }; }
  render() {
    if (this.state.error) {
      return (
        this.props.fallback ?? (
          <div className="flex h-full w-full items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
            <p className="font-mono text-xs text-muted-dark">3D scene unavailable</p>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
