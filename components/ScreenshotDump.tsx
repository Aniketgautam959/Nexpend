'use client';

import { useRef, useState, useTransition, type DragEvent } from 'react';
import { useRouter } from 'next/navigation';
import { extractExpenseFromScreenshot } from '@/app/actions/extractExpenseFromScreenshot';
import {
  checkDumpDuplicates,
  saveDumpedExpenses,
  type DumpExpenseInput,
} from '@/app/actions/dumpExpenses';
import type { ExtractedExpense } from '@/lib/ai';
import { defaultIsCommitted } from '@/lib/playMoney';
import { formatMoney } from '@/lib/expenseMeta';

const MAX_DUMP = 10;
const SCAN_CONCURRENCY = 2;

async function fileToCompressedDataUrl(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const maxSide = 768;
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not process image');
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  return canvas.toDataURL('image/jpeg', 0.62);
}

async function runPool<T>(
  items: T[],
  limit: number,
  worker: (item: T, index: number) => Promise<void>
) {
  let next = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const index = next;
      next += 1;
      await worker(items[index], index);
    }
  });
  await Promise.all(runners);
}

type DumpStatus = 'scanning' | 'ready' | 'duplicate' | 'failed';

type DumpRow = {
  id: string;
  fileName: string;
  status: DumpStatus;
  error?: string;
  selected: boolean;
  data?: ExtractedExpense;
};

function toDumpInput(row: DumpRow): DumpExpenseInput | null {
  if (!row.data || row.data.amount == null) return null;
  return {
    description: row.data.description,
    amount: row.data.amount,
    category: row.data.category,
    merchant: row.data.merchant,
    paymentMethod: row.data.paymentMethod,
    note: row.data.note,
    date: row.data.date,
    upiRef: row.data.upiRef,
    isCommitted: defaultIsCommitted(
      row.data.category,
      row.data.description,
      row.data.merchant
    ),
    allowDuplicate: row.status === 'duplicate' && row.selected,
  };
}

export default function ScreenshotDump() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [scanned, setScanned] = useState(0);
  const [total, setTotal] = useState(0);
  const [rows, setRows] = useState<DumpRow[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(
    null
  );
  const dragDepthRef = useRef(0);

  const patchRow = (id: string, patch: Partial<DumpRow>) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  };

  const handleFiles = async (fileList: File[]) => {
    const images = fileList.filter((file) => file.type.startsWith('image/'));
    if (images.length === 0) {
      setMessage('Drop UPI / Paytm / GPay screenshots');
      setMessageType('error');
      return;
    }

    const extra = images.length > MAX_DUMP;
    const picked = images.slice(0, MAX_DUMP);
    const queue: DumpRow[] = picked.map((file, index) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${index}`,
      fileName: file.name,
      status: 'scanning',
      selected: false,
    }));

    setRows(queue);
    setIsScanning(true);
    setScanned(0);
    setTotal(picked.length);
    setMessage(
      extra ? `Only first ${MAX_DUMP} screenshots kept` : null
    );
    setMessageType(extra ? 'success' : null);

    const extracted: Array<DumpExpenseInput | undefined> = new Array(
      picked.length
    );
    const results: DumpRow[] = queue.map((row) => ({ ...row }));

    await runPool(picked, SCAN_CONCURRENCY, async (file, index) => {
      try {
        const dataUrl = await fileToCompressedDataUrl(file);
        const result = await extractExpenseFromScreenshot(dataUrl);
        if (result.error || !result.data || result.data.amount == null) {
          results[index] = {
            ...results[index],
            status: 'failed',
            selected: false,
            error: result.error || 'Could not read screenshot',
          };
        } else {
          extracted[index] = {
            description: result.data.description,
            amount: result.data.amount,
            category: result.data.category,
            merchant: result.data.merchant,
            paymentMethod: result.data.paymentMethod,
            note: result.data.note,
            date: result.data.date,
            upiRef: result.data.upiRef,
          };
          results[index] = {
            ...results[index],
            status: 'ready',
            selected: true,
            data: result.data,
          };
        }
      } catch {
        results[index] = {
          ...results[index],
          status: 'failed',
          selected: false,
          error: 'Could not read this screenshot',
        };
      } finally {
        setScanned((n) => n + 1);
        setRows([...results]);
      }
    });

    const toCheck = extracted.map(
      (item): DumpExpenseInput =>
        item || {
          description: '',
          amount: 0,
          category: 'Other',
          date: new Date().toISOString().slice(0, 10),
        }
    );

    if (extracted.some(Boolean)) {
      const dupes = await checkDumpDuplicates(toCheck);
      if (dupes.hits) {
        for (const hit of dupes.hits) {
          if (!hit.duplicate || results[hit.index]?.status !== 'ready') continue;
          results[hit.index] = {
            ...results[hit.index],
            status: 'duplicate',
            selected: false,
            error: hit.reason || 'Already logged — duplicate UPI skipped',
          };
        }
      }
    }

    setRows([...results]);
    setIsScanning(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragDepthRef.current = 0;
    setIsDragging(false);
    if (isScanning || isSaving) return;
    void handleFiles(Array.from(e.dataTransfer.files));
  };

  const readyCount = rows.filter((row) => row.status === 'ready' && row.selected).length;
  const dupeCount = rows.filter((row) => row.status === 'duplicate').length;
  const failCount = rows.filter((row) => row.status === 'failed').length;
  const forceDupeCount = rows.filter(
    (row) => row.status === 'duplicate' && row.selected
  ).length;
  const saveCount = readyCount + forceDupeCount;

  const handleSave = async () => {
    const payload = rows
      .filter((row) => row.selected && (row.status === 'ready' || row.status === 'duplicate'))
      .map(toDumpInput)
      .filter((item): item is DumpExpenseInput => Boolean(item));

    if (payload.length === 0) return;

    setIsSaving(true);
    setMessage(null);
    const result = await saveDumpedExpenses(payload);
    setIsSaving(false);

    if (result.error) {
      setMessage(result.error);
      setMessageType('error');
      return;
    }

    setMessage(
      result.skipped > 0
        ? `Saved ${result.saved} · skipped ${result.skipped} duplicate UPI`
        : `Saved ${result.saved} expense${result.saved === 1 ? '' : 's'}`
    );
    setMessageType('success');
    setRows([]);
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div
      onDragEnter={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isScanning || isSaving) return;
        dragDepthRef.current += 1;
        if (e.dataTransfer.types.includes('Files')) setIsDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.stopPropagation();
        dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
        if (dragDepthRef.current === 0) setIsDragging(false);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isScanning && !isSaving) e.dataTransfer.dropEffect = 'copy';
      }}
      onDrop={handleDrop}
      className={`mb-5 rounded-xl border border-dashed p-4 transition-colors ${
        isDragging
          ? 'border-accent bg-accent/10 dark:bg-accent/10'
          : 'border-zinc-300 dark:border-zinc-700 bg-zinc-50/70 dark:bg-zinc-900/40'
      }`}
    >
      <div className='flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between'>
        <div>
          <p className='text-sm font-medium text-zinc-900 dark:text-white'>
            {isDragging ? 'Drop screenshots here' : 'Dump payment screenshots'}
          </p>
          <p className='text-xs text-zinc-500 dark:text-zinc-400 mt-0.5'>
            Up to {MAX_DUMP} UPI / GPay / Paytm shots. Duplicate payments skip.
          </p>
          {isScanning && (
            <p className='text-xs text-zinc-500 mt-1'>
              Reading {Math.min(scanned, total)}/{total}…
            </p>
          )}
        </div>
        <div className='flex items-center gap-2'>
          <input
            ref={fileInputRef}
            type='file'
            accept='image/*'
            multiple
            className='hidden'
            onChange={(e) =>
              void handleFiles(Array.from(e.target.files || []))
            }
          />
          <button
            type='button'
            onClick={() => fileInputRef.current?.click()}
            disabled={isScanning || isSaving}
            className='btn-ghost text-sm !px-3.5 !py-2 disabled:opacity-50'
          >
            {isScanning ? 'Scanning…' : 'Dump screenshots'}
          </button>
        </div>
      </div>

      {rows.length > 0 && (
        <ul className='mt-4 space-y-2'>
          {rows.map((row) => (
            <li
              key={row.id}
              className='rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/50 px-3.5 py-3'
            >
              <div className='flex items-start gap-3'>
                {(row.status === 'ready' || row.status === 'duplicate') && (
                  <input
                    type='checkbox'
                    className='mt-1 accent-emerald-600'
                    checked={row.selected}
                    disabled={isScanning || isSaving}
                    onChange={(e) =>
                      patchRow(row.id, { selected: e.target.checked })
                    }
                  />
                )}
                <div className='min-w-0 flex-1'>
                  <p className='text-sm font-medium text-zinc-900 dark:text-white truncate'>
                    {row.data
                      ? `${row.data.merchant || row.data.description} · ${formatMoney(row.data.amount || 0)}`
                      : row.fileName}
                  </p>
                  <p className='text-[11px] text-zinc-500 mt-0.5 truncate'>
                    {row.status === 'scanning' && 'Reading screenshot…'}
                    {row.status === 'ready' &&
                      `${row.data?.date || ''} · ${row.data?.paymentMethod || 'UPI'}${
                        row.data?.upiRef ? ` · ${row.data.upiRef.slice(0, 8)}…` : ''
                      }`}
                    {row.status === 'duplicate' && (row.error || 'Duplicate UPI — skipped')}
                    {row.status === 'failed' && (row.error || 'Could not read')}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md shrink-0 ${
                    row.status === 'ready'
                      ? 'bg-accent/15 text-accent'
                      : row.status === 'duplicate'
                        ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                        : row.status === 'failed'
                          ? 'bg-red-500/10 text-red-500'
                          : 'bg-zinc-200/80 text-zinc-500 dark:bg-zinc-800'
                  }`}
                >
                  {row.status === 'ready'
                    ? 'New'
                    : row.status === 'duplicate'
                      ? 'Skip'
                      : row.status === 'failed'
                        ? 'Failed'
                        : '…'}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {rows.length > 0 && !isScanning && (
        <div className='mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
          <p className='text-[11px] text-zinc-500'>
            {readyCount} new
            {dupeCount ? ` · ${dupeCount} already logged` : ''}
            {failCount ? ` · ${failCount} failed` : ''}
          </p>
          <div className='flex items-center gap-2'>
            <button
              type='button'
              className='btn-ghost text-xs !px-3 !py-1.5'
              disabled={isSaving}
              onClick={() => setRows([])}
            >
              Clear
            </button>
            <button
              type='button'
              className='btn-primary text-sm !px-4 !py-2 disabled:opacity-50'
              disabled={isSaving || saveCount === 0}
              onClick={() => void handleSave()}
            >
              {isSaving
                ? 'Saving…'
                : `Save ${saveCount} expense${saveCount === 1 ? '' : 's'}`}
            </button>
          </div>
        </div>
      )}

      {message && (
        <p
          className={`mt-3 text-xs ${
            messageType === 'error' ? 'text-red-500' : 'text-zinc-600 dark:text-zinc-400'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
