export const Sidebar = () => (
  <div className='flex h-full w-64 flex-col justify-center'>
    {[1, 2, 3].map((item) => (
      <div key={item}>{item}</div>
    ))}
  </div>
);
