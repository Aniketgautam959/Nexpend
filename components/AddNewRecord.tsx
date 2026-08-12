'use client';
import { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import addExpenseRecord from '@/app/actions/addExpenseRecord';
import { suggestCategory } from '@/app/actions/suggestCategory';
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from '@/lib/expenseMeta';

const AddRecord = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [amount, setAmount] = useState(199);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<'success' | 'error' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [description, setDescription] = useState('');
  const [isCategorizingAI, setIsCategorizingAI] = useState(false);

  const clientAction = async (formData: FormData) => {
    setIsLoading(true);
    setAlertMessage(null);

    formData.set('amount', amount.toString());
    formData.set('category', category);
    formData.set('paymentMethod', paymentMethod);

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

  return (
    <section className='panel p-5 sm:p-6'>
      <h2 className='panel-title mb-1'>Add expense</h2>
      <p className='panel-sub mb-5'>
        Log subscriptions, shopping, bills, and everyday spends
      </p>

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
