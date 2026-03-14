import { Link } from 'react-router-dom';
import { ArrowRight, Trophy, Users, Calendar } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-emerald-800 text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              Empowering Youth Through <span className="text-emerald-300">Structured Sports</span>
            </h1>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto lg:mx-0 mb-10">
              Yuva Kreeda Vikas connects athletes with coaches and top-tier sports infrastructure. 
              Book your slots, train hard, and achieve greatness.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <Link 
                to="/register" 
                className="bg-white text-emerald-800 hover:bg-emerald-50 px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center shadow-lg"
              >
                Join Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                to="/about" 
                className="border-2 border-emerald-400 text-emerald-50 hover:bg-emerald-700 px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-emerald-500 rounded-3xl transform rotate-3 scale-105 opacity-50"></div>
            <img 
              src="https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&q=80&w=1000" 
              alt="Athletes training on a track" 
              className="relative rounded-3xl shadow-2xl object-cover h-[500px] w-full"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Why Choose Yuva Kreeda Vikas?</h2>
            <p className="mt-4 text-lg text-slate-600">We provide everything you need to excel in your sporting journey.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Easy Slot Booking</h3>
              <p className="text-slate-600">
                Book world-class sports facilities instantly. Manage your schedule and cancellations with ease.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Expert Coaches</h3>
              <p className="text-slate-600">
                Connect with experienced coaches who can guide you to reach your full potential.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Real-time Analytics</h3>
              <p className="text-slate-600">
                Track your progress, analyze your performance, and plan your development effectively.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sports Section */}
      <section className="py-20 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Available Sports</h2>
            <p className="mt-4 text-lg text-slate-600">Train in state-of-the-art facilities across multiple disciplines.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Cricket', img: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=400' },
              { name: 'Football', img: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=400' },
              { name: 'Badminton', img: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=400' },
              { name: 'Swimming', img: 'https://images.unsplash.com/photo-1519315901367-f34bf9150f01?auto=format&fit=crop&q=80&w=400' },
              { name: 'Tennis', img: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=400' },
              { name: 'Hockey', img: 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?auto=format&fit=crop&q=80&w=400' },
              { name: 'Athletics', img: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=400' },
              { name: 'Basketball', img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=400' }
            ].map((sport) => (
              <div key={sport.name} className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer aspect-square">
                <img 
                  src={sport.img} 
                  alt={sport.name} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
                <h3 className="absolute bottom-4 left-4 font-bold text-xl text-white">{sport.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
