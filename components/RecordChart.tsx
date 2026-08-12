import BarChart from './BarChart';
import type { Record } from '@/types/Record';

const RecordChart = ({ records }: { records: Record[] }) => {
  const header = (
    <div className='flex items-center justify-between gap-3 mb-5'>
      <div>
        <h2 className='panel-title'>Spending chart</h2>
        <p className='panel-sub mt-0.5'>Daily totals over time</p>
      </div>
    </div>
  );

  if (!records || records.length === 0) {
    return (
      <section className='panel p-5 sm:p-6 w-full'>
        {header}
        <div className='flex-1 flex flex-col items-center justify-center text-center py-8 px-4 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-black/20'>
          <div className='h-12 w-12 rounded-2xl bg-accent/15 text-accent flex items-center justify-center mb-4'>
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1.75}
                d='M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z'
              />
            </svg>
          </div>
          <h3 className='font-semibold text-zinc-900 dark:text-white mb-1'>
            No chart data yet
          </h3>
          <p className='text-sm text-zinc-500 max-w-xs'>
            Add your first expense and the chart will light up here.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className='panel p-5 sm:p-6 w-full'>
      {header}
      <div className='overflow-x-auto -mx-1 px-1'>
        <BarChart
          records={records.map((record) => ({
            ...record,
            date: String(record.date),
          }))}
        />
      </div>
    </section>
  );
};

export default RecordChart;
