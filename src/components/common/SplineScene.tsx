import React, { Suspense, lazy, Component } from 'react';
import type { ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

// Lazy load the Spline runtime to optimize bundle size and startup performance
const Spline = lazy(() => import('@splinetool/react-spline'));

interface SplineSceneProps {
  /** URL to the Spline scene (.splinecode file) */
  scene: string;
  /** CSS class to apply to the container or canvas */
  className?: string;
  /** Callback fired when the scene finishes loading */
  onLoad?: (app: any) => void;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackUrl?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class SplineErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('Spline 3D Scene notice:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-[#f7f7f4] text-[#5a6065] text-xs text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-[#fef8eb] border border-[#f8dfaa] flex items-center justify-center text-[#9e5d03]">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-[#191c1e] text-sm">
              3D Scene Fallback Active
            </div>
            <p className="text-[11px] text-[#5a6065] max-w-sm mt-1">
              Could not initialize local WebGL canvas for this scene. You can view the scene via the iframe embed or switch to the Lineage Topology view.
            </p>
          </div>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[#191c1e] text-white text-xs font-medium hover:bg-[#2d3134]"
          >
            <RefreshCw className="w-3 h-3" />
            Retry 3D Render
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export const SplineScene: React.FC<SplineSceneProps> = ({ scene, className = 'w-full h-full', onLoad }) => {
  const handleSceneLoad = (splineApp: any) => {
    try {
      // 1. Hide all text, logo, and watermark objects in the 3D scene
      const allObjects = splineApp.getAllObjects ? splineApp.getAllObjects() : [];
      if (Array.isArray(allObjects)) {
        allObjects.forEach((obj: any) => {
          if (!obj) return;
          const name = String(obj.name || '').toLowerCase();
          // Target: 'Text', 'Text 2'...'Text 7', 'logo', 're Building', 'Cool Experiences', 'SplineWatermark', etc.
          if (
            name.includes('text') ||
            name.includes('logo') ||
            name.includes('build') ||
            name.includes('experience') ||
            name.includes('watermark') ||
            name.includes('spline')
          ) {
            obj.visible = false;
            if (obj.scale && typeof obj.scale.set === 'function') {
              obj.scale.set(0, 0, 0);
            }
            if (obj.position && typeof obj.position.set === 'function') {
              obj.position.set(0, -99999, 0);
            }
          }
        });
      }

      // Explicit named lookups as fallback
      const explicitNames = [
        'Text', 'Text 2', 'Text 3', 'Text 4', 'Text 5', 'Text 6', 'Text 7',
        're Building', 'Cool Experiences', 'logo', 'SplineWatermark', 'Build with Spline'
      ];
      explicitNames.forEach((n) => {
        try {
          const target = splineApp.findObjectByName ? splineApp.findObjectByName(n) : null;
          if (target) {
            target.visible = false;
            if (target.scale && typeof target.scale.set === 'function') {
              target.scale.set(0, 0, 0);
            }
            if (target.position && typeof target.position.set === 'function') {
              target.position.set(0, -99999, 0);
            }
          }
        } catch {
          // ignore lookup miss
        }
      });
    } catch (e) {
      console.warn('Spline element suppressor:', e);
    }

    if (onLoad) {
      onLoad(splineApp);
    }
  };

  return (
    <SplineErrorBoundary fallbackUrl={scene}>
      <Suspense
        fallback={
          <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center bg-[#f7f7f4] text-[#5a6065] text-xs space-y-3">
            <div className="relative">
              <div className="w-8 h-8 border-2 border-[#3d5042] border-t-transparent rounded-full animate-spin" />
            </div>
            <div className="text-center">
              <div className="font-mono text-xs font-medium text-[#191c1e]">Loading Spline 3D Scene...</div>
              <div className="text-[10px] text-[#848a90] mt-0.5">Streaming 3D geometry & shaders</div>
            </div>
          </div>
        }
      >
        <Spline scene={scene} className={className} onLoad={handleSceneLoad} />
      </Suspense>
    </SplineErrorBoundary>
  );
};
