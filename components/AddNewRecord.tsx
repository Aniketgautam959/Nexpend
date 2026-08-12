'use client';
import { useRef, useState, useTransition, type DragEvent } from 'react';
import { useRouter } from 'next/navigation';
import addExpenseRecord from '@/app/actions/addExpenseRecord';
import { suggestCategory } from '@/app/actions/suggestCategory';
import { extractExpenseFromScreenshot } from '@/app/actions/extractExpenseFromScreenshot';
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from '@/lib/expenseMeta';

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

const AddRecord = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [amount, setAmount] = useState(199);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [description, setDescription] = useState('');
  const [merchant, setMerchant] = useState('');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');
  const [isCategorizingAI, setIsCategorizingAI] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [screenshotName, setScreenshotName] = useState<string | null>(null);
  const dragDepthRef = useRef(0);

  const clientAction = async (formData: FormData) => {
    setIsLoading(true);
    setAlertMessage(null);

    formData.set('amount', amount.toString());
    formData.set('category', category);
    formData.set('paymentMethod', paymentMethod);
    formData.set('text', description);
    formData.set('merchant', merchant);
    formData.set('date', date);
    formData.set('note', note);

    const { error } = await addExpenseRecord(formData);

    if (error) {
      setAlertMessage(`Error: ${error}`);
      setAlertType('error');
      setIsLoading(false);
      return;
    }

    setAlertMessage('Saved');
    setAlertType('success');
    formRef.current?.reset();
    setAmount(199);
    setCategory('');
    setPaymentMethod('');
    setDescription('');
    setMerchant('');
    setDate('');
    setNote('');
    setScreenshotName(null);
    setIsLoading(false);
    startTransition(() => {
      router.refresh();
    });
  };

  const handleAISuggestCategory = async () => {
    if (!description.trim()) {
      setAlertMessage('Enter a description first');
      setAlertType('error');
      return;
    }

    setIsCategorizingAI(true);
    setAlertMessage(null);

    try {
      const result = await suggestCategory(description);
      if (result.error && !result.category) {
        setAlertMessage(result.error);
        setAlertType('error');
      } else {
        setCategory(result.category);
        setAlertMessage(
          result.error ? result.error : `Category: ${result.category}`
        );
        setAlertType(result.error ? 'error' : 'success');
      }
    } catch {
      setAlertMessage('Suggestion failed');
      setAlertType('error');
    } finally {
      setIsCategorizingAI(false);
    }
  };

  const handleScreenshot = async (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAlertMessage('Please upload an image screenshot');
      setAlertType('error');
      return;
    }

    setIsScanning(true);
    setAlertMessage(null);
    setScreenshotName(file.name);

    try {
      const dataUrl = await fileToCompressedDataUrl(file);
      const result = await extractExpenseFromScreenshot(dataUrl);

      if (result.error || !result.data) {
        setAlertMessage(result.error || 'Could not read screenshot');
        setAlertType('error');
        return;
      }

      const data = result.data;
      setDescription(data.description);
      if (data.amount !== null) setAmount(data.amount);
      setCategory(data.category);
      setMerchant(data.merchant);
      setPaymentMethod(data.paymentMethod);
      setDate(data.date);
      setNote(data.note);
      setAlertMessage('Details filled from screenshot — review and save');
      setAlertType('success');
    } catch {
      setAlertMessage('Could not read this screenshot');
      setAlertType('error');
    } finally {
      setIsScanning(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const resetDragState = () => {
    dragDepthRef.current = 0;
    setIsDragging(false);
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isScanning) return;
    dragDepthRef.current += 1;
    if (e.dataTransfer.types.includes('Files')) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
    if (dragDepthRef.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isScanning) {
      e.dataTransfer.dropEffect = 'copy';
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    resetDragState();
    if (isScanning) return;

    const file =
      Array.from(e.dataTransfer.files).find((item) =>
        item.type.startsWith('image/')
      ) ?? null;

    if (!file) {
      setAlertMessage('Drop an image screenshot');
      setAlertType('error');
      return;
    }

    void handleScreenshot(file);
  };

  return (
    <section className='panel p-5 sm:p-6'>
      <h2 className='panel-title mb-1'>Add expense</h2>
      <p className='panel-sub mb-5'>
        Log subscriptions, shopping, bills, and everyday spends
      </p>

      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
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
              {isDragging ? 'Drop screenshot here' : 'Scan payment screenshot'}
            </p>
            <p className='text-xs text-zinc-500 dark:text-zinc-400 mt-0.5'>
              Drag & drop or upload a UPI / Paytm / GPay receipt to auto-fill
            </p>
            {screenshotName && (
              <p className='text-xs text-zinc-500 mt-1 truncate max-w-[240px]'>
                {isScanning ? 'Reading…' : screenshotName}
              </p>
            )}
          </div>
          <div className='flex items-center gap-2'>
            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              className='hidden'
              onChange={(e) => handleScreenshot(e.target.files?.[0] ?? null)}
            />
            <button
              type='button'
              onClick={() => fileInputRef.current?.click()}
              disabled={isScanning}
              className='btn-ghost text-sm !px-3.5 !py-2 disabled:opacity-50'
            >
              {isScanning ? 'Scanning…' : 'Upload screenshot'}
            </button>
          </div>
        </div>
      </div>

      <form
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault();
          clientAction(new FormData(formRef.current!));
        }}
        className='space-y-4'
      >
        <div className='space-y-1.5'>
          <div className='flex items-center justify-between gap-2'>
            <label htmlFor='text' className='text-xs font-medium text-zinc-500'>
              What did you spend on?
            </label>
            <button
              type='button'
              onClick={handleAISuggestCategory}
              disabled={isCategorizingAI || !description.trim()}
              className='text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white disabled:opacity-40 underline-offset-2 hover:underline'
            >
              {isCategorizingAI ? 'Suggesting…' : 'Suggest category'}
            </button>
          </div>
          <input
            type='text'
            id='text'
            name='text'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='input-field'
            placeholder='YouTube Premium, Amazon order, Jio recharge…'
            required
          />
        </div>

        <div className='grid grid-cols-2 gap-3'>
          <div className='space-y-1.5'>
            <label htmlFor='merchant' className='text-xs font-medium text-zinc-500'>
              Merchant / app
            </label>
            <input
              type='text'
              id='merchant'
              name='merchant'
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              className='input-field'
              placeholder='Netflix, Flipkart…'
            />
          </div>
          <div className='space-y-1.5'>
            <label htmlFor='date' className='text-xs font-medium text-zinc-500'>
              Date
            </label>
            <input
              type='date'
              name='date'
              id='date'
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className='input-field'
              required
              onFocus={(e) => e.target.showPicker()}
            />
          </div>
        </div>

        <div className='grid grid-cols-2 gap-3'>
          <div className='space-y-1.5'>
            <label htmlFor='amount' className='text-xs font-medium text-zinc-500'>
              Amount
            </label>
            <div className='relative'>
              <span className='absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 text-sm'>
                ₹
              </span>
              <input
                type='number'
                name='amount'
                id='amount'
                min='0'
                max='1000000'
                step='0.01'
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className='input-field pl-7'
                required
              />
            </div>
          </div>
          <div className='space-y-1.5'>
            <label htmlFor='category' className='text-xs font-medium text-zinc-500'>
              Category
            </label>
            <select
              id='category'
              name='category'
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className='input-field cursor-pointer'
              required
            >
              <option value='' disabled>
                Select…
              </option>
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-3'>
          <div className='space-y-1.5'>
            <label
              htmlFor='paymentMethod'
              className='text-xs font-medium text-zinc-500'
            >
              Paid via
            </label>
            <select
              id='paymentMethod'
              name='paymentMethod'
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className='input-field cursor-pointer'
            >
              <option value=''>Optional…</option>
              {PAYMENT_METHODS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <div className='space-y-1.5'>
            <label htmlFor='note' className='text-xs font-medium text-zinc-500'>
              Note
            </label>
            <input
              type='text'
              id='note'
              name='note'
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className='input-field'
              placeholder='Monthly plan, gift…'
            />
          </div>
        </div>

        <button type='submit' className='w-full btn-primary py-2.5' disabled={isLoading}>
          {isLoading ? 'Saving…' : 'Add expense'}
        </button>
      </form>

      {alertMessage && (
        <p
          className={`mt-3 text-xs ${
            alertType === 'success'
              ? 'text-zinc-600 dark:text-zinc-400'
              : 'text-red-500'
          }`}
        >
          {alertMessage}
        </p>
      )}
    </section>
  );
};

export default AddRecord;
