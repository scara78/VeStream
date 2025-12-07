import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Neural Divider - Cyberpunk-styled separator
 */
export const NeuralDivider = ({ className, variant = 'cyan' }) => {
  const variantColors = {
    cyan: 'from-transparent via-neon-cyan to-transparent',
    purple: 'from-transparent via-neon-purple to-transparent',
    magenta: 'from-transparent via-neon-magenta to-transparent',
    holo: 'from-neon-cyan via-neon-purple to-neon-magenta',
  };

  return (
    <div className={cn('relative h-px w-full my-6', className)}>
      <div className={`absolute inset-0 bg-gradient-to-r ${variantColors[variant]} opacity-50`} />
      <div className={`absolute inset-0 bg-gradient-to-r ${variantColors[variant]} blur-sm`} />
    </div>
  );
};

/**
 * Neural Container - Holographic container with glow effects
 */
export const NeuralContainer = ({
  children,
  className,
  variant = 'cyan',
  glow = true,
  animate = false
}) => {
  const variantStyles = {
    cyan: 'border-neon-cyan/20 shadow-neon-cyan/10',
    purple: 'border-neon-purple/20 shadow-neon-purple/10',
    magenta: 'border-neon-magenta/20 shadow-neon-magenta/10',
    holo: 'border-neon-cyan/30 shadow-neon-holo',
  };

  return (
    <div
      className={cn(
        'glass-ultra rounded-2xl border p-6',
        variantStyles[variant],
        glow && 'hover:shadow-neon-cyan/30 transition-all duration-300',
        animate && 'animate-holo-shift',
        className
      )}
    >
      {children}
    </div>
  );
};

/**
 * Neural Grid - Cyberpunk grid background
 */
export const NeuralGrid = ({ className, opacity = 0.1 }) => {
  return (
    <div
      className={cn('absolute inset-0 pointer-events-none', className)}
      style={{ opacity }}
    >
      <div className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #00f0ff 1px, transparent 1px),
            linear-gradient(to bottom, #00f0ff 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
    </div>
  );
};

/**
 * Neural Pulse Dot - Animated indicator dot
 */
export const NeuralPulseDot = ({ className, variant = 'cyan', size = 'sm' }) => {
  const sizeClasses = {
    xs: 'w-2 h-2',
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  };

  const variantColors = {
    cyan: 'bg-neon-cyan shadow-neon-cyan',
    purple: 'bg-neon-purple shadow-neon-purple',
    magenta: 'bg-neon-magenta shadow-neon-magenta',
  };

  return (
    <div className={cn('relative', className)}>
      <div className={cn('rounded-full', sizeClasses[size], variantColors[variant], 'animate-neural-pulse')} />
      <div className={cn('absolute inset-0 rounded-full', variantColors[variant], 'animate-ping opacity-75')} />
    </div>
  );
};

/**
 * Neural Progress Bar - Futuristic progress indicator
 */
export const NeuralProgress = ({
  value = 0,
  max = 100,
  className,
  variant = 'cyan',
  showLabel = false,
  label = ''
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const variantColors = {
    cyan: 'bg-neon-cyan shadow-neon-cyan',
    purple: 'bg-neon-purple shadow-neon-purple',
    magenta: 'bg-neon-magenta shadow-neon-magenta',
    holo: 'bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-magenta',
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-text-secondary">{label}</span>
          <span className="text-sm font-mono text-neon-cyan">{percentage.toFixed(0)}%</span>
        </div>
      )}
      <div className="relative h-2 w-full bg-void-neural/50 rounded-full overflow-hidden border border-neon-cyan/20">
        <div
          className={cn('h-full transition-all duration-300', variantColors[variant])}
          style={{ width: `${percentage}%` }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-holo-scan"
        />
      </div>
    </div>
  );
};

/**
 * Neural Status Indicator - Live status badge with pulse
 */
export const NeuralStatus = ({
  status = 'online',
  label,
  className,
  showPulse = true
}) => {
  const statusConfig = {
    online: { color: 'neon-cyan', text: 'Online' },
    offline: { color: 'text-secondary', text: 'Offline' },
    busy: { color: 'neon-magenta', text: 'Busy' },
    away: { color: 'neon-purple', text: 'Away' },
  };

  const config = statusConfig[status] || statusConfig.online;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="relative">
        <div className={`w-2 h-2 rounded-full bg-${config.color}`} />
        {showPulse && status === 'online' && (
          <div className={`absolute inset-0 w-2 h-2 rounded-full bg-${config.color} animate-ping opacity-75`} />
        )}
      </div>
      <span className="text-sm text-text-secondary">{label || config.text}</span>
    </div>
  );
};

/**
 * Neural Stat Card - Statistics display with holographic design
 */
export const NeuralStatCard = ({
  label,
  value,
  icon: Icon,
  variant = 'cyan',
  trend,
  className
}) => {
  const variantStyles = {
    cyan: 'border-neon-cyan/20 shadow-neon-cyan/10 text-neon-cyan',
    purple: 'border-neon-purple/20 shadow-neon-purple/10 text-neon-purple',
    magenta: 'border-neon-magenta/20 shadow-neon-magenta/10 text-neon-magenta',
  };

  return (
    <div className={cn('glass-ultra rounded-xl border p-4 hover:shadow-neon-cyan/30 transition-all', variantStyles[variant], className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-text-tertiary uppercase tracking-wider">{label}</span>
        {Icon && <Icon className="w-5 h-5 opacity-60" />}
      </div>
      <div className="flex items-end justify-between">
        <div className="text-3xl font-bold font-mono">{value}</div>
        {trend && (
          <div className={cn(
            'text-xs font-semibold px-2 py-1 rounded-full',
            trend > 0 ? 'bg-neon-cyan/10 text-neon-cyan' : 'bg-neon-magenta/10 text-neon-magenta'
          )}>
            {trend > 0 ? '+' : ''}{trend}%
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Neural Code Block - Cyberpunk-styled code display
 */
export const NeuralCodeBlock = ({ code, language = 'javascript', className }) => {
  return (
    <div className={cn('glass-ultra rounded-lg border border-neon-cyan/20 overflow-hidden', className)}>
      <div className="flex items-center justify-between px-4 py-2 bg-void-neural/50 border-b border-neon-cyan/10">
        <span className="text-xs text-neon-cyan font-mono uppercase">{language}</span>
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-neon-magenta/50" />
          <div className="w-3 h-3 rounded-full bg-neon-purple/50" />
          <div className="w-3 h-3 rounded-full bg-neon-cyan/50" />
        </div>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="text-sm text-neon-cyan/80 font-mono">{code}</code>
      </pre>
    </div>
  );
};

/**
 * Neural Alert - Futuristic notification/alert component
 */
export const NeuralAlert = ({
  children,
  variant = 'info',
  icon: Icon,
  onClose,
  className
}) => {
  const variantStyles = {
    info: 'border-neon-cyan/30 bg-neon-cyan/5 text-neon-cyan',
    success: 'border-neon-cyan/30 bg-neon-cyan/5 text-neon-cyan',
    warning: 'border-neon-purple/30 bg-neon-purple/5 text-neon-purple',
    error: 'border-neon-magenta/30 bg-neon-magenta/5 text-neon-magenta',
  };

  return (
    <div className={cn('glass-ultra rounded-lg border p-4 flex items-start gap-3', variantStyles[variant], className)}>
      {Icon && <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />}
      <div className="flex-1">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

/**
 * Neural Tooltip - Holographic tooltip
 */
export const NeuralTooltip = ({ children, content, position = 'top', className }) => {
  const [show, setShow] = React.useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </div>
      {show && (
        <div className={cn(
          'absolute z-50 px-3 py-2 text-sm glass-ultra rounded-lg border border-neon-cyan/30 shadow-neon-cyan/20 whitespace-nowrap',
          positionClasses[position],
          className
        )}>
          {content}
          <div className="absolute w-2 h-2 bg-void-deep border-neon-cyan/30 rotate-45
            top-1/2 -translate-y-1/2 -right-1 border-r border-t" />
        </div>
      )}
    </div>
  );
};

/**
 * Neural Tab Navigation - Cyberpunk tab system
 */
export const NeuralTabs = ({ tabs, activeTab, onChange, variant = 'cyan', className }) => {
  const variantStyles = {
    cyan: {
      active: 'bg-neon-cyan/10 border-neon-cyan text-neon-cyan shadow-neon-cyan/20',
      inactive: 'border-neon-cyan/20 text-text-secondary hover:text-neon-cyan hover:border-neon-cyan/40'
    },
    purple: {
      active: 'bg-neon-purple/10 border-neon-purple text-neon-purple shadow-neon-purple/20',
      inactive: 'border-neon-purple/20 text-text-secondary hover:text-neon-purple hover:border-neon-purple/40'
    },
  };

  return (
    <div className={cn('flex gap-2 border-b border-neon-cyan/10 pb-2', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'px-4 py-2 rounded-t-lg border-b-2 transition-all duration-300 font-semibold',
            activeTab === tab.id
              ? variantStyles[variant].active
              : variantStyles[variant].inactive
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default {
  NeuralDivider,
  NeuralContainer,
  NeuralGrid,
  NeuralPulseDot,
  NeuralProgress,
  NeuralStatus,
  NeuralStatCard,
  NeuralCodeBlock,
  NeuralAlert,
  NeuralTooltip,
  NeuralTabs,
};
