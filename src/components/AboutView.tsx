import React from 'react';
import {
  Info,
  Users,
  GraduationCap,
  BookOpen,
  Award,
  Cpu,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Code2
} from 'lucide-react';

export const AboutView: React.FC = () => {
  const teamMembers = [
    {
      name: 'Varghese James',
      role: 'CV Pipeline Architect & Model Fine-Tuning',
      usn: '5th Sem B.Tech CSE',
      contribution: 'Dataset curation, YOLOv8 model quantization, and CIoU loss formulation.'
    },
    {
      name: 'Adithyan S',
      role: 'Full-Stack Integration & Vision Engine',
      usn: '5th Sem B.Tech CSE',
      contribution: 'Web camera streaming, edge inference synchronization, and UI engineering.'
    },
    {
      name: 'Drishya Pradeep',
      role: 'Textile Science & Preprocessing Lead',
      usn: '5th Sem B.Tech CSE',
      contribution: 'Gabor wavelet filter calibration, CLAHE normalization, and care database.'
    }
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Hero Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-linear-to-br from-slate-900 via-slate-900 to-indigo-950/50 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <GraduationCap className="w-5 h-5 text-indigo-400" />
          <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            5TH SEMESTER B.TECH PROJECT DEFENSE
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-100 font-sans tracking-tight">
          Project VASTRA
        </h1>
        <p className="text-base text-indigo-300 font-mono mt-1">
          Vision-Assisted Smart Textile Recognition and Analysis
        </p>
        <p className="text-sm text-slate-400 mt-3 leading-relaxed max-w-3xl">
          An applied computer vision platform engineered for automated textile attribute identification,
          weave structure recognition, color-space chromatic analysis, and scientific garment preservation.
          Developed as part of the academic curriculum for Course <strong>PBCMT504 Computer Vision</strong>.
        </p>
      </div>

      {/* Academic Details & Guide Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Course & Institution Information */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-semibold text-slate-100">Course & Academic Details</h3>
          </div>

          <div className="space-y-2.5 text-xs font-mono">
            <div className="flex justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="text-slate-400">Course Code</span>
              <span className="text-indigo-300 font-semibold">PBCMT504</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="text-slate-400">Course Title</span>
              <span className="text-slate-200">Computer Vision</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="text-slate-400">Semester & Branch</span>
              <span className="text-slate-200">5th Semester, B.Tech CSE</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="text-slate-400">Department</span>
              <span className="text-slate-200">Computer Science & Engineering</span>
            </div>
          </div>
        </div>

        {/* Project Guide */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <Award className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-semibold text-slate-100">Project Guide & Supervisor</h3>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
                AG
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-100">Prof. Anish George</h4>
                <p className="text-xs text-indigo-300 font-mono">Project Guide & Assistant Professor</p>
                <p className="text-xs text-slate-400">Department of Computer Science & Engineering</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 pt-2 border-t border-slate-900 leading-relaxed">
              Supervising research on real-time neural object detection, multi-scale textile segmentation,
              and ethical edge computer vision deployments.
            </p>
          </div>
        </div>
      </div>

      {/* Project Team Members */}
      <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-semibold text-slate-100">Project Team Members</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">3-Member Research Group</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="p-5 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-sm font-bold text-slate-100">{member.name}</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {member.usn}
                  </span>
                </div>
                <div className="text-xs font-semibold text-indigo-300 font-mono mb-2">
                  {member.role}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {member.contribution}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Architecture & Methodology Overview */}
      <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
          <Cpu className="w-5 h-5 text-violet-400" />
          <h3 className="text-base font-semibold text-slate-100">System Pipeline Methodology</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="font-mono text-indigo-400 font-bold">STAGE 1: ACQUISITION</div>
            <div className="font-semibold text-slate-200">Spatial Letterboxing</div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Raw camera stream or uploaded raster image is resized to 640×640 px maintaining aspect ratio with symmetric black padding.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="font-mono text-blue-400 font-bold">STAGE 2: FILTERING</div>
            <div className="font-semibold text-slate-200">CLAHE & CIE-Lab</div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Decoupling luminance (L*) from chromaticity channels (a*, b*) to eliminate ambient shadows; CLAHE reveals subtle weave ridges.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="font-mono text-violet-400 font-bold">STAGE 3: DETECTION</div>
            <div className="font-semibold text-slate-200">CSPDarknet53 & PANet</div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Multi-scale feature pyramid extracts bounding box regression via CIoU loss and garment categorization with Soft-DIoU NMS.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="font-mono text-emerald-400 font-bold">STAGE 4: SYNTHESIS</div>
            <div className="font-semibold text-slate-200">Textile Directives</div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Classifier outputs map directly to material care rules, temperature thresholds, color harmonies, and longevity guides.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
