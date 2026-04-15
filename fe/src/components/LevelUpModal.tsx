import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, GraduationCap, Zap } from "lucide-react";

// ─── Confetti Particle ────────────────────────────────────────────────────────

const CONFETTI_COLORS = [
  "#3b82f6", "#a855f7", "#f59e0b", "#10b981",
  "#ef4444", "#ec4899", "#06b6d4", "#84cc16",
];

const CONFETTI_SHAPES = ["circle", "square", "triangle"] as const;

function ConfettiParticle({ index }: { index: number }) {
  const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
  const shape = CONFETTI_SHAPES[index % CONFETTI_SHAPES.length];
  const x = `${(index * 37 + 5) % 100}%`;
  const delay = (index * 0.11) % 1.2;
  const size = 6 + (index % 4) * 2;
  const duration = 1.8 + (index % 5) * 0.3;

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, top: "-10px" }}
      animate={{
        y: ["0px", "340px"],
        x: [`0px`, `${((index % 7) - 3) * 18}px`],
        rotate: [0, 360 * (index % 2 === 0 ? 1 : -1)],
        opacity: [1, 1, 0],
      }}
      transition={{
        duration,
        delay,
        ease: "easeIn",
        repeat: Infinity,
        repeatDelay: 0.8,
      }}
    >
      {shape === "circle" && (
        <div style={{ width: size, height: size, borderRadius: "50%", backgroundColor: color }} />
      )}
      {shape === "square" && (
        <div style={{ width: size, height: size, backgroundColor: color }} />
      )}
      {shape === "triangle" && (
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: `${size / 2}px solid transparent`,
            borderRight: `${size / 2}px solid transparent`,
            borderBottom: `${size}px solid ${color}`,
          }}
        />
      )}
    </motion.div>
  );
}

// ─── Year Badge ───────────────────────────────────────────────────────────────

function YearBadge() {
  return (
    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full shadow-lg shadow-blue-500/30 mx-auto">
      <GraduationCap className="w-4 h-4" />
      <span className="text-sm font-bold">Year 2</span>
      <motion.div
        animate={{ x: [0, 4, 0] }}
        transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
      >
        →
      </motion.div>
      <span className="text-sm font-bold">Year 3</span>
      <Zap className="w-4 h-4 text-yellow-300" />
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

interface LevelUpModalProps {
  show: boolean;
  onAccept: () => void;
  onDismiss: () => void;
}

export function LevelUpModal({ show, onAccept, onDismiss }: LevelUpModalProps) {
  const acceptRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (show) {
      setTimeout(() => acceptRef.current?.focus(), 300);
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ backdropFilter: "blur(6px)", backgroundColor: "rgba(17,24,39,0.55)" }}
        >
          <motion.div
            initial={{ scale: 0.78, opacity: 0, y: 32 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.88, opacity: 0, y: 16 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
          >
            {/* Confetti rain */}
            <div className="absolute inset-x-0 top-0 h-44 overflow-hidden pointer-events-none">
              {Array.from({ length: 22 }).map((_, i) => (
                <ConfettiParticle key={i} index={i} />
              ))}
            </div>

            {/* Close button */}
            <button
              onClick={onDismiss}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Gradient top band */}
            <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

            {/* Body */}
            <div className="px-8 pt-8 pb-8 text-center">

              {/* Big emoji */}
              <motion.div
                animate={{ rotate: [-8, 8, -8], scale: [1, 1.08, 1] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                className="text-6xl mb-4 select-none"
              >
                🎉
              </motion.div>

              {/* Heading */}
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Happy New Academic Year!
              </h2>
              <p className="text-gray-500 text-sm mb-5">
                Your profile has been detected as leveling up.
              </p>

              {/* Year badge */}
              <div className="flex justify-center mb-6">
                <YearBadge />
              </div>

              {/* AI question card */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 rounded-2xl p-5 mb-7 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/30 mt-0.5">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1.5">
                      EduCart AI
                    </p>
                    <p className="text-gray-800 text-sm leading-relaxed">
                      You are moving to{" "}
                      <span className="font-bold text-blue-700">Year 3</span>. Do you want AI to
                      update your feed with{" "}
                      <span className="font-bold text-purple-700">
                        3rd-year Information Technology
                      </span>{" "}
                      materials — textbooks, slides, tools & more?
                    </p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-3">
                <motion.button
                  ref={acceptRef}
                  whileHover={{ scale: 1.025 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onAccept}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  Yes, update my feed
                </motion.button>

                <button
                  onClick={onDismiss}
                  className="w-full py-2.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Not yet
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
