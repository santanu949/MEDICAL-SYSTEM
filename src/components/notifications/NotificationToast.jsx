import { Bell, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useMedical } from '../../context/MedicalContext.jsx';

const ICON_MAP = {
  success: <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />,
  error:   <AlertCircle className="w-4 h-4 text-error shrink-0" />,
  info:    <Bell className="w-4 h-4 text-primary-brand shrink-0" />,
  warning: <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />,
};

const BORDER_MAP = {
  success: 'border-l-green-500',
  error:   'border-l-error',
  info:    'border-l-primary-brand',
  warning: 'border-l-amber-500',
};

export default function NotificationToast() {
  const { unreadNotifications, dismissNotification } = useMedical();
  const visible = unreadNotifications.slice(0, 3);

  return (
    <div className="fixed bottom-24 right-4 left-4 md:left-auto md:w-80 space-y-2 pointer-events-none z-[80]">
      <AnimatePresence>
        {visible.map((n) => (
          <motion.div
            key={n.id}
            initial={{ y: 20, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`p-3 rounded-xl shadow-xl flex items-center gap-3 border-l-4 pointer-events-auto bg-white border border-outline-variant/20 ${BORDER_MAP[n.type]}`}
          >
            {ICON_MAP[n.type]}
            <span className="text-[10px] font-bold text-on-surface line-clamp-2 flex-1">
              {n.message}
            </span>
            <button
              onClick={() => dismissNotification(n.id)}
              className="ml-1 w-5 h-5 rounded-full flex items-center justify-center text-outline hover:text-on-surface hover:bg-surface-container transition-colors shrink-0"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
