interface PageHeaderProps {
  title: string;
  rightContent?: string;
  className?: string;
}

export function PageHeader({ title, rightContent }: PageHeaderProps) {
  return (
    <div
      className={`flex justify-between items-center border-b border-gray-800 pb-4`}
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-white">{title}</h2>
      {rightContent && (
        <div className="text-gray-400 text-md font-bold self-end">
          {rightContent}
        </div>
      )}
    </div>
  );
}
