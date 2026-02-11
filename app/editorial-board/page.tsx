import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editorial Board | Mkule",
};

export default function EditorialBoardPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-24">
      <header className="mb-20">
        <h1 className="text-5xl md:text-6xl font-serif font-black mb-4 tracking-tighter">
          Editorial Board
        </h1>
        <p className="text-xs font-sans font-black uppercase tracking-[0.3em] text-brand">
          Academic Year 2025–2026
        </p>
      </header>

      {/* --- EXECUTIVE EDITORS --- */}
      <section className="mb-20">
        <SectionHeader title="Executive Board" />
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
          <BoardMember role="Editor-in-Chief" name="Casandra Peñaverde" course="IV - BA Political Science" />
          <BoardMember role="Managing Editor" name="Chester Leangee Datoon" course="IV - BS Pharmacy" />
          <BoardMember role="Associate Editor for Internals" name="Benedict Ballaran" course="IV - BA Political Science" />
          <BoardMember role="Associate Editor for Externals" name="Justine Antonie Wagan" course="III - BA Organizational Communication" />
          <BoardMember role="Asst. Managing Editor" name="Lian Gabrielle Inlong" course="II - BS Public Health" />
          <BoardMember role="Asst. Assoc. Editor for Externals" name="Angel Vera Egama" course="II - BS Biochemistry" />
        </div>
      </section>

      {/* --- SECTION EDITORS --- */}
      <section className="mb-20">
        <SectionHeader title="Section Editors" />
        <div className="grid md:grid-cols-3 gap-x-8 gap-y-10">
          <BoardMember role="News Editor" name="Axel John Cainglet" course="II - BA Political Science" />
          <BoardMember role="Features Editor" name="Rachelle Lara Montes" course="II - BA Political Science" />
          <BoardMember role="Culture Editor" name="Bea de Guzman" course="IV - BA Behavioral Science" />
          <BoardMember role="Graphics Editor" name="Carl Dexter Donor" course="IV - BS Pharmacy" />
          <BoardMember role="Multimedia Editor" name="Arman John Quitoriano" course="IV - BA Organizational Communication" />
        </div>
      </section>
    </main>
  );
}

// --- SUB-COMPONENTS ---

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4 mb-10">
      <h2 className="text-[10px] font-sans font-black uppercase tracking-[0.2em] text-gray-400 whitespace-nowrap">
        {title}
      </h2>
      <div className="h-[1px] w-full bg-gray-100" />
    </div>
  );
}

function BoardMember({ role, name, course }: { role: string; name: string; course?: string }) {
  return (
    <div className="group">
      <p className="text-[9px] font-sans font-black uppercase tracking-widest text-brand mb-1">
        {role}
      </p>
      <p className="text-2xl font-serif font-bold group-hover:text-brand transition-colors duration-300 leading-tight">
        {name}
      </p>
      {course && (
        <p className="text-[10px] font-sans font-bold uppercase tracking-widest text-gray-400 mt-1">
          {course}
        </p>
      )}
    </div>
  );
}