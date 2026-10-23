import React from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  Circle,
  Clock,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Zap,
  Target,
} from 'lucide-react';
import { usePractice } from '../context/PracticeContext';
import { AZ900_DOMAINS } from '../data/domains';
import { NavTab } from './Sidebar';

interface StudyPlanProps {
  onStartQuiz: (mode: 'all' | 'quick10' | 'domain' | 'missed' | 'flagged', domainId?: string) => void;
  setActiveTab: (tab: NavTab) => void;
}

export const StudyPlan: React.FC<StudyPlanProps> = ({ onStartQuiz, setActiveTab }) => {
  const { studyPlan, toggleStudyTask, resetStudyPlan } = usePractice();

  const completedCount = studyPlan.filter((t) => t.completed).length;
  const totalCount = studyPlan.length;
  const percentComplete = Math.round((completedCount / totalCount) * 100);

  // Find next uncompleted task as "Today's Goal"
  const todaysGoal = studyPlan.find((t) => !t.completed) || studyPlan[studyPlan.length - 1];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header Banner */}
      <div className="bg-white border border-[#E8E5DC] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono uppercase tracking-wider text-[#8B94A0]">
              7-Day Structured Path
            </span>
            <span className="text-[#8B94A0]">•</span>
            <span className="text-xs font-mono text-[#0C4FD7] font-semibold">
              AZ-900 Blueprint
            </span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#12151A]">
            Weekly Study Plan
          </h1>
          <p className="text-sm text-[#58616E] mt-1.5 max-w-xl leading-relaxed">
            Manageable daily goals designed to ensure complete coverage of all 3 official domains, review trapped distractors, and achieve exam readiness.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="font-display text-2xl font-bold text-[#12151A]">
              {completedCount} / {totalCount}
            </span>
            <span className="text-xs text-[#58616E] block">
              {percentComplete}% completed
            </span>
          </div>

          <button
            onClick={() => {
              if (window.confirm('Reset all study plan task checkboxes?')) {
                resetStudyPlan();
              }
            }}
            title="Reset plan completion"
            className="p-2.5 rounded-xl border border-[#E8E5DC] text-[#58616E] hover:text-[#C04328] hover:bg-[#FDF2EF] transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Today's Goal Highlight Card */}
      {todaysGoal && (
        <section className="bg-white border-2 border-[#12151A] rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] text-[#0C4FD7] flex items-center justify-center shrink-0">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#8B94A0]">
                  Current Milestone • {todaysGoal.dayLabel}
                </span>
                <h3 className="font-display text-xl font-bold text-[#12151A]">
                  {todaysGoal.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-[#FAF9F6] border border-[#E8E5DC] text-[#58616E] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {todaysGoal.durationMinutes} mins
              </span>
              <button
                onClick={() => toggleStudyTask(todaysGoal.id)}
                className={`px-3 py-1 rounded-full text-xs font-bold font-mono transition-colors ${
                  todaysGoal.completed
                    ? 'bg-[#EAF6F0] text-[#1A7B54]'
                    : 'bg-[#F3F1EC] text-[#58616E] hover:bg-[#E8E5DC]'
                }`}
              >
                {todaysGoal.completed ? 'Completed' : 'Mark Complete'}
              </button>
            </div>
          </div>

          <p className="text-sm text-[#58616E] mt-3 leading-relaxed">
            {todaysGoal.objective}
          </p>

          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={() => {
                if (todaysGoal.actionType === 'flashcards') {
                  setActiveTab('flashcards');
                } else if (todaysGoal.actionType === 'review') {
                  onStartQuiz('missed');
                } else if (todaysGoal.actionType === 'exam') {
                  onStartQuiz('all');
                } else {
                  onStartQuiz('domain', todaysGoal.domainId);
                }
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0C4FD7] hover:bg-[#093FB0] text-white text-xs font-semibold transition-colors shadow-xs"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Launch Milestone Activity</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      )}

      {/* Complete 7-Day Checklist */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-bold text-[#12151A]">
          Checklist of Milestones
        </h2>

        <div className="space-y-3">
          {studyPlan.map((task) => {
            const domainMeta = AZ900_DOMAINS[task.domainId];

            return (
              <div
                key={task.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  task.completed
                    ? 'bg-[#FAF9F6] border-[#E8E5DC] opacity-80'
                    : 'bg-white border-[#E8E5DC] shadow-xs hover:border-[#DCD7CB]'
                }`}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleStudyTask(task.id)}
                    className="mt-1 text-[#8B94A0] hover:text-[#1A7B54] transition-colors"
                    aria-label={`Toggle completion for ${task.title}`}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-[#1A7B54] fill-current" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#12151A]">
                        {task.dayLabel}
                      </span>
                      <span className="text-[#8B94A0]">•</span>
                      <span
                        className="text-[10px] font-mono font-bold px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: domainMeta?.accentBg || '#FAF9F6',
                          color: domainMeta?.color || '#12151A',
                        }}
                      >
                        {domainMeta?.name}
                      </span>
                      <span className="text-xs font-mono text-[#8B94A0] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {task.durationMinutes}m
                      </span>
                    </div>

                    <h4
                      className={`text-sm font-bold ${
                        task.completed ? 'line-through text-[#8B94A0]' : 'text-[#12151A]'
                      }`}
                    >
                      {task.title}
                    </h4>

                    <p className="text-xs text-[#58616E] leading-relaxed max-w-xl">
                      {task.objective}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 sm:self-center">
                  <button
                    onClick={() => {
                      if (task.actionType === 'flashcards') {
                        setActiveTab('flashcards');
                      } else if (task.actionType === 'review') {
                        onStartQuiz('missed');
                      } else if (task.actionType === 'exam') {
                        onStartQuiz('all');
                      } else {
                        onStartQuiz('domain', task.domainId);
                      }
                    }}
                    className="px-3.5 py-1.5 rounded-xl border border-[#E8E5DC] text-xs font-semibold text-[#12151A] hover:bg-[#FAF9F6] transition-colors"
                  >
                    Open
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
