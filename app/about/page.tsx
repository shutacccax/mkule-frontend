export const metadata = {
  title: "About Us",
};

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-serif font-black mb-8">
        About The Manila Collegian
      </h1>

      <div className="prose prose-lg max-w-none">
        <p>
          The Manila Collegian is the official student publication of the
          University of the Philippines Manila.
        </p>

        <p>
          Founded on the principles of academic freedom and critical inquiry,
          the publication serves as a platform for student voices, investigative
          reporting, and cultural discourse.
        </p>
      </div>
    </main>
  );
}
