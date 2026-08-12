'use client';

import { useState, useEffect } from 'react';
import { getAIInsights } from '@/app/actions/getAIInsights';
import { generateInsightAnswer } from '@/app/actions/generateInsightAnswer';

interface InsightData {
  id: string;
  type: 'warning' | 'info' | 'success' | 'tip';
  title: string;
  message: string;
  action?: string;
  confidence?: number;
}

interface AIAnswer {
  insightId: string;
  answer: string;
  isLoading: boolean;
}

const CACHE_KEY = 'nexpend-insights-cache';
const CACHE_TTL_MS = 10 * 60 * 1000;

function readCache(): { insights: InsightData[]; at: number } | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { insights: InsightData[]; at: number };
    if (!parsed?.insights?.length || !parsed.at) return null;
    if (Date.now() - parsed.at > CACHE_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(insights: InsightData[]) {
  try {
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ insights, at: Date.now() })
    );
  } catch {
    // ignore quota errors
  }
}

const AIInsights = () => {
  const [insights, setInsights] = useState<InsightData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [aiAnswers, setAiAnswers] = useState<AIAnswer[]>([]);

  const loadInsights = async (force = false) => {
    if (!force) {
      const cached = readCache();
      if (cached) {
        setInsights(cached.insights);
        setLastUpdated(new Date(cached.at));
        setIsLoading(false);
        return;
      }
    }

    setIsLoading(true);
    try {
      const newInsights = await getAIInsights();
      setInsights(newInsights);
      setLastUpdated(new Date());
      writeCache(newInsights);
    } catch (error) {
      console.error('AIInsights: Failed to load AI insights:', error);
      setInsights([
        {
          id: 'fallback-1',
          type: 'info',
          title: 'AI Temporarily Unavailable',
          message: "We're restoring AI insights. Check back soon.",
          action: 'Try again later',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = async (insight: InsightData) => {
    if (!insight.action) return;

    const existingAnswer = aiAnswers.find((a) => a.insightId === insight.id);
    if (existingAnswer) {
      setAiAnswers((prev) => prev.filter((a) => a.insightId !== insight.id));
      return;
    }

    setAiAnswers((prev) => [
      ...prev,
      { insightId: insight.id, answer: '', isLoading: true },
    ]);

    try {
      const question = `${insight.title}: ${insight.action}`;
      const answer = await generateInsightAnswer(question);
      setAiAnswers((prev) =>
        prev.map((a) =>
          a.insightId === insight.id ? { ...a, answer, isLoading: false } : a
        )
      );
    } catch {
      setAiAnswers((prev) =>
        prev.map((a) =>
          a.insightId === insight.id
            ? {
                ...a,
                answer: 'Couldn’t generate a detailed answer. Try again.',
                isLoading: false,
              }
            : a
        )
      );
    }
  };

  useEffect(() => {
    loadInsights(false);
  }, []);

  const formatLastUpdated = () => {
    if (!lastUpdated) return '…';
    const diffMins = Math.floor((Date.now() - lastUpdated.getTime()) / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    return lastUpdated.toLocaleDateString();
  };

  const typeStyle = (type: InsightData['type']) => {
    if (type === 'warning') return 'border-amber-500/30 bg-amber-500/5';
    if (type === 'success') return 'border-accent/30 bg-accent/5';
    if (type === 'tip') return 'border-sky-500/30 bg-sky-500/5';
    return 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-black/20';
  };

  return (
    <section className='panel p-5 sm:p-6'>
      <div className='flex items-center justify-between gap-3 mb-5'>
        <div>
          <h2 className='panel-title'>Insights</h2>
          <p className='panel-sub mt-0.5'>Notes on your spending</p>
        </div>
        <div className='flex items-center gap-2'>
          <span className='hidden sm:inline text-[11px] text-zinc-500'>
            {formatLastUpdated()}
          </span>
          <button
            onClick={() => loadInsights(true)}
            className='h-8 w-8 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-accent/40 text-zinc-500 hover:text-accent flex items-center justify-center'
            aria-label='Refresh insights'
            disabled={isLoading}
          >
            ↻
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className='space-y-3'>
          {[1, 2].map((i) => (
            <div
              key={i}
              className='animate-pulse rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4'
            >
              <div className='h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2 mb-2' />
              <div className='h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-full' />
            </div>
          ))}
        </div>
      ) : (
        <div className='space-y-3'>
          {insights.map((insight) => {
            const currentAnswer = aiAnswers.find(
              (a) => a.insightId === insight.id
            );
            return (
              <div
                key={insight.id}
                className={`rounded-2xl border p-4 ${typeStyle(insight.type)}`}
              >
                <h3 className='text-sm font-semibold text-zinc-900 dark:text-white mb-1'>
                  {insight.title}
                </h3>
                <p className='text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-2'>
                  {insight.message}
                </p>
                {insight.action && (
                  <button
                    type='button'
                    onClick={() => handleActionClick(insight)}
                    className='text-xs font-medium text-accent hover:text-green-400'
                  >
                    {insight.action} {currentAnswer ? '↑' : '→'}
                  </button>
                )}
                {currentAnswer && (
                  <div className='mt-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-[var(--card)] p-3'>
                    {currentAnswer.isLoading ? (
                      <div className='space-y-1.5'>
                        <div className='animate-pulse h-2 bg-zinc-200 dark:bg-zinc-800 rounded w-full' />
                        <div className='animate-pulse h-2 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3' />
                      </div>
                    ) : (
                      <p className='text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed'>
                        {currentAnswer.answer}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default AIInsights;
