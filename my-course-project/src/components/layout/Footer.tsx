import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  BookOpen,
  Users,
  Award,
  Clock,
} from "lucide-react";

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

interface FooterSectionProps {
  title: string;
  children: React.ReactNode;
}

const FooterLink: React.FC<FooterLinkProps> = ({ href, children }) => (
  <a
    href={href}
    className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-1 transform inline-block cursor-pointer"
  >
    {children}
  </a>
);

const FooterSection: React.FC<FooterSectionProps> = ({ title, children }) => (
  <div className="space-y-4">
    <h3 className="text-xl font-bold text-white border-b-2 border-blue-400 pb-2 inline-block">
      {title}
    </h3>
    <div className="space-y-3">{children}</div>
  </div>
);

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const stats = [
    { icon: BookOpen, number: "200+", label: "Khóa học lập trình" },
    { icon: Users, number: "15K+", label: "Developer đã đào tạo" },
    { icon: Award, number: "98%", label: "Tỷ lệ có việc làm" },
    { icon: Clock, number: "24/7", label: "Hỗ trợ coding" },
  ];

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.2),transparent_50%),radial-gradient(circle_at_75%_75%,rgba(147,51,234,0.2),transparent_50%)]"></div>
        <div className="absolute inset-0"></div>
      </div>

      <div className="relative z-10 border-b border-gray-700/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center group hover:transform hover:scale-105 transition-all duration-500"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 group-hover:shadow-2xl group-hover:shadow-purple-500/30 group-hover:rotate-3 transition-all duration-500">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">
                  {stat.number}
                </div>
                <div className="text-gray-300 text-sm group-hover:text-gray-200 transition-colors duration-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  LearnX
                </h2>
              </div>
              <p className="text-gray-300 leading-relaxed text-sm">
                Nền tảng học lập trình trực tuyến hàng đầu Việt Nam. Từ cơ bản
                đến nâng cao, từ Frontend đến Backend, từ Mobile đến AI. Học
                thực tế, làm dự án thật, có việc làm ngay!
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-100">
                Kết nối với chúng tôi
              </h4>
              <div className="flex space-x-3">
                {[
                  {
                    Icon: Facebook,
                    color: "hover:bg-blue-600 hover:text-white",
                  },
                  { Icon: Twitter, color: "hover:bg-sky-500 hover:text-white" },
                  {
                    Icon: Instagram,
                    color: "hover:bg-pink-500 hover:text-white",
                  },
                  { Icon: Youtube, color: "hover:bg-red-600 hover:text-white" },
                ].map(({ Icon, color }, index) => (
                  <div
                    key={index}
                    className={`w-10 h-10 bg-gray-700/50 backdrop-blur rounded-xl flex items-center justify-center text-gray-300 ${color} transition-all duration-300 hover:scale-110 hover:shadow-lg cursor-pointer border border-gray-600/50 hover:border-transparent`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <FooterSection title="Khóa học phổ biến">
            <FooterLink href="">React + Next.js Masterclass</FooterLink>
            <FooterLink href="">Node.js Backend Complete</FooterLink>
            <FooterLink href="">Python từ Zero to Hero</FooterLink>
            <FooterLink href="">Flutter Mobile App</FooterLink>
            <FooterLink href="">DevOps & AWS Cloud</FooterLink>
            <FooterLink href="">
              <span className="text-blue-400 font-medium">
                Xem tất cả khóa học →
              </span>
            </FooterLink>
          </FooterSection>

          <FooterSection title="Ngôn ngữ & Công nghệ">
            <FooterLink href="">JavaScript / TypeScript</FooterLink>
            <FooterLink href="">Python / Django</FooterLink>
            <FooterLink href="">Java / Spring Boot</FooterLink>
            <FooterLink href="">C# / .NET</FooterLink>
            <FooterLink href="">PHP / Laravel</FooterLink>
            <FooterLink href="">Go / Rust</FooterLink>
          </FooterSection>

          <FooterSection title="Liên hệ">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-gray-300 group hover:text-blue-300 transition-colors duration-300">
                <div className="w-8 h-8 bg-blue-600/80 backdrop-blur rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500 transition-colors duration-300">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-sm">123 Nguyễn Văn Cừ, Q.5, TP.HCM</span>
              </div>

              <div className="flex items-center space-x-3 text-gray-300 group hover:text-green-300 transition-colors duration-300">
                <div className="w-8 h-8 bg-green-600/80 backdrop-blur rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-green-500 transition-colors duration-300">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-sm">+84 (028) 1234 5678</span>
              </div>

              <div className="flex items-center space-x-3 text-gray-300 group hover:text-purple-300 transition-colors duration-300">
                <div className="w-8 h-8 bg-purple-600/80 backdrop-blur rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500 transition-colors duration-300">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-sm">info@learnx.dev</span>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="text-lg font-semibold mb-4 text-gray-100">
                Nhận khóa học miễn phí
              </h4>
              <div className="space-y-3">
                <div className="flex rounded-xl overflow-hidden shadow-lg">
                  <input
                    type="email"
                    placeholder="Email để nhận khóa học HTML/CSS miễn phí"
                    className="flex-1 px-4 py-3 bg-gray-700/50 backdrop-blur border border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                  />
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-medium text-sm whitespace-nowrap hover:shadow-lg">
                    Nhận ngay
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl">🎁</span>
                  <p className="text-xs text-gray-400">
                    Tặng kèm roadmap lập trình 2024
                  </p>
                </div>
              </div>
            </div>
          </FooterSection>
        </div>
      </div>

      <div className="relative z-10 border-t border-gray-700/50 bg-black/30 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-300 text-sm">
              © {currentYear} LearnX. Tất cả quyền được bảo lưu.
            </div>
            <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
              <FooterLink href="">Chính sách hoàn tiền</FooterLink>
              <FooterLink href="">Điều khoản sử dụng</FooterLink>
              <FooterLink href="">Chính sách bảo mật</FooterLink>
              <FooterLink href="">Liên hệ hợp tác</FooterLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
