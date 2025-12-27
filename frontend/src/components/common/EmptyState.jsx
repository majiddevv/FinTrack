import { FolderOpen } from 'lucide-react';

const EmptyState = ({ 
  icon: Icon = FolderOpen, 
  title = 'No data found', 
  description = 'Get started by adding your first item.',
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-gray-100 rounded-full p-4 mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-500 text-center max-w-sm mb-4">{description}</p>
      {action && action}
    </div>
  );
};

export default EmptyState;

