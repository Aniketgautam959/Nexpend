export default function Loading() {
  return (
    <main className='dash-bg min-h-screen text-foreground'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6'>
        <div className='h-16 rounded-2xl bg-zinc-200/60 dark:bg-zinc-800/60 animate-pulse' />
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div className='h-80 rounded-2xl bg-zinc-200/60 dark:bg-zinc-800/60 animate-pulse' />
          <div className='h-80 rounded-2xl bg-zinc-200/60 dark:bg-zinc-800/60 animate-pulse' />
        </div>
      </div>
    </main>
  );
}
