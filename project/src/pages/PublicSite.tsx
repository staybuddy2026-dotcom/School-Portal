import { Icon } from '@/components/Icon';
import { Button } from '@/components/ui';
import { schoolInfo } from '@/data';
import { colors } from '@/theme';

const heroImg = 'https://images.pexels.com/photos/14446732/pexels-photo-14446732.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
const classroomImg = 'https://images.pexels.com/photos/37898351/pexels-photo-37898351.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
const libraryImg = 'https://images.pexels.com/photos/7929352/pexels-photo-7929352.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
const sportsImg = 'https://images.pexels.com/photos/36871459/pexels-photo-36871459.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

interface PublicSiteProps {
  page: 'home' | 'about' | 'contact';
  onNavigate: (page: 'home' | 'about' | 'contact') => void;
  onLogin: () => void;
}

export function PublicSite({ page, onNavigate, onLogin }: PublicSiteProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-ink-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white">
              <Icon name="GraduationCap" size={20} />
            </div>
            <div>
              <p className="text-[14px] font-bold text-ink-900">Greenwood</p>
              <p className="text-[12px] text-ink-400">International School</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-1">
            {(['home', 'about', 'contact'] as const).map(p => (
              <button key={p} onClick={() => onNavigate(p)} className={`px-4 py-2 rounded-lg text-[14px] font-medium transition-colors ${page === p ? 'text-primary-600 bg-primary-50' : 'text-ink-600 hover:bg-ink-50'}`}>
                {p === 'home' ? 'Home' : p === 'about' ? 'About' : 'Contact'}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={onLogin}>Login</Button>
            <Button variant="primary" size="sm" onClick={onLogin} className="hidden sm:inline-flex">Parent Portal</Button>
          </div>
        </div>
      </nav>

      {page === 'home' && <HomePage onNavigate={onNavigate} onLogin={onLogin} />}
      {page === 'about' && <AboutPage />}
      {page === 'contact' && <ContactPage />}

      {/* Footer */}
      <footer className="bg-ink-900 text-ink-300">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center text-white">
                  <Icon name="GraduationCap" size={20} />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-white">Greenwood</p>
                  <p className="text-[12px] text-ink-400">International School</p>
                </div>
              </div>
              <p className="text-[14px] text-ink-400">{schoolInfo.tagline}</p>
            </div>
            <div>
              <p className="text-[14px] font-semibold text-white mb-3">Quick Links</p>
              <div className="space-y-2">
                {(['home', 'about', 'contact'] as const).map(p => (
                  <button key={p} onClick={() => onNavigate(p)} className="block text-[14px] text-ink-400 hover:text-white transition-colors capitalize">{p}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[14px] font-semibold text-white mb-3">Portals</p>
              <div className="space-y-2">
                <button onClick={onLogin} className="block text-[14px] text-ink-400 hover:text-white transition-colors">Parent Portal</button>
                <button onClick={onLogin} className="block text-[14px] text-ink-400 hover:text-white transition-colors">Staff Portal</button>
                <button onClick={onLogin} className="block text-[14px] text-ink-400 hover:text-white transition-colors">Teacher Portal</button>
              </div>
            </div>
            <div>
              <p className="text-[14px] font-semibold text-white mb-3">Contact</p>
              <div className="space-y-2 text-[14px] text-ink-400">
                <p>{schoolInfo.address}</p>
                <p>{schoolInfo.phone}</p>
                <p>{schoolInfo.email}</p>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-ink-800 text-[12px] text-ink-500 text-center">
            © 2026 Greenwood International School. All content is placeholder text until provided by the school.
          </div>
        </div>
      </footer>
    </div>
  );
}

function HomePage({ onNavigate, onLogin }: { onNavigate: (p: 'home' | 'about' | 'contact') => void; onLogin: () => void }) {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative h-[600px] flex items-center overflow-hidden">
        <img src={heroImg} alt="School campus" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/80 via-ink-900/60 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 lg:px-6 w-full">
          <div className="max-w-xl text-white">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-[14px] font-medium mb-4 animate-slide-up">
              <Icon name="Award" size={14} /> Estd. {schoolInfo.estd} · {schoolInfo.affiliation}
            </span>
            <h1 className="text-[36px] md:text-[48px] font-bold leading-tight text-balance animate-slide-up">
              Nurturing Minds,<br />Building Futures
            </h1>
            <p className="mt-4 text-[18px] text-ink-200 text-balance animate-slide-up">
              A modern learning community where every student is empowered to achieve their full potential through excellence in academics, sports, and character.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 animate-slide-up">
              <Button variant="primary" size="lg" onClick={onLogin} icon={<Icon name="ArrowRight" size={18} />}>
                Access Portal
              </Button>
              <Button variant="outline" size="lg" onClick={() => onNavigate('about')} className="!bg-white/10 !border-white/30 !text-white hover:!bg-white/20">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-ink-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Students', value: '1,200+', icon: 'Users' },
              { label: 'Teachers', value: '85+', icon: 'UserCheck' },
              { label: 'Years of Excellence', value: '27+', icon: 'Calendar' },
              { label: 'Pass Rate', value: '98%', icon: 'TrendingUp' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mx-auto mb-3">
                  <Icon name={s.icon} size={22} />
                </div>
                <p className="text-[30px] font-bold text-ink-900">{s.value}</p>
                <p className="text-[14px] text-ink-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-ink-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-[30px] font-bold text-ink-900">A Complete Learning Ecosystem</h2>
            <p className="text-ink-500 mt-3 text-balance">Everything parents, teachers, and staff need — connected through one centralized platform.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Academic Excellence', desc: 'Comprehensive curriculum tracking, learning outcomes, and real-time academic monitoring for every student.', icon: 'BookOpen', color: 'primary' },
              { title: 'Seamless Communication', desc: 'Circulars, notifications, PTM scheduling, and direct messaging between parents and teachers.', icon: 'MessageSquare', color: 'secondary' },
              { title: 'Smart Fee Management', desc: 'Online payments, instalment tracking, receipts, and automated reminders — all in one place.', icon: 'CreditCard', color: 'accent' },
              { title: 'Safe Transport', desc: 'Live GPS tracking, route management, and real-time parent notifications for student safety.', icon: 'Bus', color: 'success' },
              { title: 'Health & Wellness', desc: 'Dedicated infirmary module with visit records, health profiles, and instant parent alerts.', icon: 'HeartPulse', color: 'error' },
              { title: 'Parent Engagement', desc: 'Gate passes, appointments, certificates, consent forms, and a full helpdesk — accessible anytime.', icon: 'LifeBuoy', color: 'warning' },
            ].map(f => (
              <div key={f.title} className="bg-white rounded-2xl p-6 border border-ink-100 hover:shadow-card hover:border-ink-200 transition-all group">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${f.color === 'primary' ? 'bg-primary-50 text-primary-600' : f.color === 'secondary' ? 'bg-secondary-50 text-secondary-600' : f.color === 'accent' ? 'bg-accent-50 text-accent-600' : f.color === 'success' ? 'bg-success-50 text-success-600' : f.color === 'error' ? 'bg-error-50 text-error-600' : 'bg-warning-50 text-warning-600'}`}>
                  <Icon name={f.icon} size={24} />
                </div>
                <h3 className="text-[18px] font-semibold text-ink-900">{f.title}</h3>
                <p className="text-[14px] text-ink-500 mt-2 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src={classroomImg} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-[30px] font-bold text-balance">Stay Connected with Your Child's Education</h2>
          <p className="text-primary-100 mt-4 text-[18px] text-balance">Access attendance, fees, academic progress, transport tracking, and more — all from one parent portal.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button variant="outline" size="lg" onClick={onLogin} className="!bg-white !border-white !text-primary-700 hover:!bg-primary-50" icon={<Icon name="LogIn" size={18} />}>
              Login to Parent Portal
            </Button>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <h2 className="text-[30px] font-bold text-ink-900 text-center mb-3">Campus Life</h2>
          <p className="text-ink-500 text-center mb-10">A glimpse into life at Greenwood</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[classroomImg, libraryImg, sportsImg].map((img, i) => (
              <div key={i} className="relative aspect-[4/3] rounded-2xl overflow-hidden group">
                <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 to-transparent" />
                <p className="absolute bottom-4 left-4 text-white font-medium">
                  {i === 0 ? 'Modern Classrooms' : i === 1 ? 'Well-Stocked Library' : 'Sports & Activities'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="pt-16">
      <section className="bg-gradient-to-br from-ink-900 to-primary-900 text-white py-20">
        <div className="max-w-3xl mx-auto px-4 lg:px-6 text-center">
          <h1 className="text-[36px] font-bold">About Our School</h1>
          <p className="text-ink-300 mt-4 text-[18px]">{schoolInfo.tagline}</p>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 lg:px-6 prose prose-lg">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-[24px] font-bold text-ink-900 mb-4">Our Story</h2>
              <p className="text-ink-600 leading-relaxed">
                [School-provided content placeholder] — This section will contain the school's history, mission, and vision as provided by the school administration. The content here is a placeholder until the school supplies the actual information.
              </p>
              <p className="text-ink-600 leading-relaxed mt-4">
                Greenwood International School was established in {schoolInfo.estd} and is {schoolInfo.affiliation}. We are committed to providing a holistic education that balances academic excellence with character development.
              </p>
            </div>
            <img src={classroomImg} alt="Classroom" className="rounded-2xl shadow-card" />
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Our Mission', icon: 'Target', text: '[Placeholder] The school\'s mission statement will be displayed here as provided by the school.' },
              { title: 'Our Vision', icon: 'Eye', text: '[Placeholder] The school\'s vision statement will be displayed here as provided by the school.' },
              { title: 'Our Values', icon: 'Heart', text: '[Placeholder] The core values that guide the school community will be listed here.' },
            ].map(v => (
              <div key={v.title} className="bg-ink-50 rounded-2xl p-6 border border-ink-100">
                <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-3">
                  <Icon name={v.icon} size={20} />
                </div>
                <h3 className="font-semibold text-ink-900">{v.title}</h3>
                <p className="text-[14px] text-ink-500 mt-2">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ContactPage() {
  return (
    <div className="pt-16">
      <section className="bg-gradient-to-br from-ink-900 to-primary-900 text-white py-20">
        <div className="max-w-3xl mx-auto px-4 lg:px-6 text-center">
          <h1 className="text-[36px] font-bold">Get in Touch</h1>
          <p className="text-ink-300 mt-4 text-[18px]">We'd love to hear from you</p>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 lg:px-6 grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-[24px] font-bold text-ink-900 mb-6">Contact Information</h2>
            <div className="space-y-5">
              {[
                { icon: 'MapPin', label: 'Address', value: schoolInfo.address },
                { icon: 'Phone', label: 'Phone', value: schoolInfo.phone },
                { icon: 'Mail', label: 'Email', value: schoolInfo.email },
                { icon: 'Clock', label: 'Office Hours', value: 'Monday - Saturday, 8:00 AM - 4:00 PM' },
              ].map(c => (
                <div key={c.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                    <Icon name={c.icon} size={20} />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-ink-500">{c.label}</p>
                    <p className="text-[16px] text-ink-800 mt-0.5">{c.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-ink-200 p-6 shadow-soft">
            <h2 className="text-[20px] font-bold text-ink-900 mb-4">Send a Message</h2>
            <p className="text-[14px] text-ink-400 mb-4">[Placeholder form — content will be configured by the school]</p>
            <div className="space-y-4">
              <div>
                <label className="block text-[14px] font-medium text-ink-700 mb-1.5">Your Name</label>
                <input className={`w-full h-10 px-3.5 text-[14px] rounded-lg border border-[${colors.border.medium}] outline-none focus:outline-none focus:ring-0 focus:border-[${colors.brand.primary}]`} placeholder="Enter your name" />
              </div>
              <div>
                <label className="block text-[14px] font-medium text-ink-700 mb-1.5">Email</label>
                <input className={`w-full h-10 px-3.5 text-[14px] rounded-lg border border-[${colors.border.medium}] outline-none focus:outline-none focus:ring-0 focus:border-[${colors.brand.primary}]`} placeholder="Enter your email" />
              </div>
              <div>
                <label className="block text-[14px] font-medium text-ink-700 mb-1.5">Message</label>
                <textarea rows={4} className={`w-full px-3.5 py-2.5 text-[14px] rounded-lg border border-[${colors.border.medium}] outline-none focus:outline-none focus:ring-0 focus:border-[${colors.brand.primary}] resize-y`} placeholder="Write your message" />
              </div>
              <Button variant="primary" size="md" className="w-full" icon={<Icon name="Send" size={16} />}>Send Message</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
