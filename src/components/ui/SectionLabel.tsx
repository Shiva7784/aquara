"use client";

interface SectionLabelProps {
  number: string;
  total?: string;
  title: string;
}

export function SectionLabel({ number, total = "05", title }: SectionLabelProps) {
  return (
    <div className="flex items-center gap-4 text-[10px] tracking-[0.3em] uppercase text-[#36C7E8]/70 font-mono mb-6">
      <span className="text-[#D94B73] font-semibold">{number}</span>
      <span className="text-white/20">/</span>
      <span className="text-white/40">{total}</span>
      <span className="h-[1px] w-8 bg-[#36C7E8]/30 ml-2" />
      <span className="text-[#F5F7F8]/60 tracking-[0.25em]">{title}</span>
    </div>
  );
}
