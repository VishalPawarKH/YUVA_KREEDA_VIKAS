export default function AboutUs() {
  return (
    <div className="bg-slate-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">About Yuva Kreeda Vikas</h1>
          <p className="mt-4 text-xl text-slate-600">Empowering youth through structured sports development.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12">
          <div className="prose prose-emerald max-w-none">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Yuva Kreeda Vikas is dedicated to connecting aspiring athletes with professional coaches and top-tier sports infrastructure. We believe that structured sports development is key to empowering the youth and building a healthier, more disciplined society.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mb-4">What We Do</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              We provide a comprehensive platform that simplifies the process of finding and booking sports facilities. Whether you are looking to practice cricket, football, badminton, swimming, tennis, hockey, or athletics, our platform ensures you have access to the best resources available.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mb-4">For Administrators</h2>
            <p className="text-slate-600 leading-relaxed">
              Our platform goes beyond just booking. We support sports administrators with real-time planning and analytics tools, enabling them to manage infrastructure efficiently and make data-driven decisions to improve sports programs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
