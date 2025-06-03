
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface TextInputWithLengthProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  maxLength?: number;
  showBar?: boolean;
}

interface TextareaWithLengthProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  maxLength?: number;
  showBar?: boolean;
}

export const TextInputWithLength = ({ 
  value, 
  maxLength = 100, 
  showBar = true, 
  className,
  ...props 
}: TextInputWithLengthProps) => {
  const percentage = (value.length / maxLength) * 100;
  const isNearLimit = percentage > 80;

  return (
    <div className="space-y-2">
      <Input 
        value={value}
        className={className}
        {...props}
      />
      {showBar && (
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-gray-200 rounded-full h-1">
            <div 
              className={cn(
                "h-1 rounded-full transition-all",
                isNearLimit ? "bg-red-500" : "bg-blue-500"
              )}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
          <span className={cn(
            "text-xs",
            isNearLimit ? "text-red-500" : "text-gray-500"
          )}>
            {value.length}/{maxLength}
          </span>
        </div>
      )}
    </div>
  );
};

export const TextareaWithLength = ({ 
  value, 
  maxLength = 500, 
  showBar = true, 
  className,
  ...props 
}: TextareaWithLengthProps) => {
  const percentage = (value.length / maxLength) * 100;
  const isNearLimit = percentage > 80;

  return (
    <div className="space-y-2">
      <Textarea 
        value={value}
        className={className}
        {...props}
      />
      {showBar && (
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-gray-200 rounded-full h-1">
            <div 
              className={cn(
                "h-1 rounded-full transition-all",
                isNearLimit ? "bg-red-500" : "bg-blue-500"
              )}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
          <span className={cn(
            "text-xs",
            isNearLimit ? "text-red-500" : "text-gray-500"
          )}>
            {value.length}/{maxLength}
          </span>
        </div>
      )}
    </div>
  );
};
