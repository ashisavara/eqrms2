interface TwoColLayoutProps {
  label: string;
  children: React.ReactNode;
  labelClassName?: string;
  containerClassName?: string;
}

const TwoColLayout = ({ 
  label, 
  children, 
  labelClassName = "font-bold",
  containerClassName = "mb-2"
}: TwoColLayoutProps) => {
  return (
    <div className={`flex ${containerClassName}`}>
      <div className={`w-45 min-w-[180px] flex-shrink-0 ${labelClassName}`}>
        {label}
      </div>
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
};

export default TwoColLayout;
