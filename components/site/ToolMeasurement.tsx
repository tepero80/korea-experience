'use client';
import { createContext, useCallback, useContext, useRef, type ReactNode } from 'react';
import { track } from '@/lib/analytics';

const Completion = createContext<() => void>(() => {});
export const useToolCompletion = () => useContext(Completion);

/** One start/completion per mounted tool; explicit later calculations stay separate. */
export default function ToolMeasurement({
  tool,
  className,
  children,
}: {
  tool: string;
  className?: string;
  children: ReactNode;
}) {
  const started = useRef(false);
  const completed = useRef(false);
  const start = useCallback(() => {
    if (!started.current) started.current = track('tool_start', { tool });
  }, [tool]);
  const complete = useCallback(() => {
    start();
    if (!started.current) return;
    if (!completed.current) completed.current = track('tool_complete', { tool });
    else track('tool_recalculate', { tool });
  }, [start, tool]);
  return (
    <Completion.Provider value={complete}>
      <div className={className} onFocusCapture={start}>
        {children}
      </div>
    </Completion.Provider>
  );
}
