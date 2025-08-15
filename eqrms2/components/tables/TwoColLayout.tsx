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
    <div className={`grid grid-cols-1 md:grid-cols-2 ${containerClassName}`}>
      <div className={`${labelClassName}`}>
        {label}
      </div>
      <div>
        {children}
      </div>
    </div>
  );
};

export default TwoColLayout;
