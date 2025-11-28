import React, { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import { getCourses as getProCourses } from "@/services/coursesPro.service";
import type { CoursePro } from "@/types/coursePro";
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
    className="text-gray-300 transition-all duration-300 transform inline-block cursor-pointer 
      hover:text-white hover:-translate-y-1 hover:scale-105 hover:drop-shadow-[0_2px_6px_rgba(96,165,250,0.6)]"
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
  const [bookStyles, setBookStyles] = useState<React.CSSProperties[]>([]);
  const [bubbleStyles, setBubbleStyles] = useState<React.CSSProperties[]>([]);
  const [proCourses, setProCourses] = useState<CoursePro[]>([]);

  useEffect(() => {
    const generateRandomStyles = (count: number, animationName: string) => {
      const styles: React.CSSProperties[] = [];
      for (let i = 0; i < count; i++) {
        styles.push({
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animation: `${animationName} ${
            20 + Math.random() * 30
          }s infinite ease-in-out ${Math.random() * 10}s`,
          width: `${20 + Math.random() * 80}px`,
          height: `${20 + Math.random() * 80}px`,
        });
      }
      return styles;
    };

    setBookStyles(generateRandomStyles(5, "float"));
    setBubbleStyles(generateRandomStyles(15, "bubble"));

    const fetchProCourses = async () => {
      try {
        const courses = await getProCourses();
        setProCourses(courses);
      } catch (error) {
        console.error("Failed to fetch pro courses:", error);
      }
    };

    fetchProCourses();
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white w-full relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        {bookStyles.map((style: React.CSSProperties, i: number) => (
          <div
            key={`book-${i}`}
            className="absolute text-4xl opacity-20"
            style={style}
          >
            📚
          </div>
        ))}
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {bubbleStyles.map((style: React.CSSProperties, i: number) => (
          <div
            key={`bubble-${i}`}
            className="absolute rounded-full bg-gradient-to-br from-blue-400/10 to-purple-400/10 backdrop-blur-sm border border-white/10"
            style={style}
          />
        ))}
      </div>

      <style jsx>{`
          50% {
            opacity: 0.2;
          }
          100% {
            transform: translateY(-120vh) scale(1.2);
            opacity: 0;
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <Image
                src="/images/Brand.jpg"
                alt="LearnX"
                width={160}
                height={48}
                className="w-40 h-auto object-contain brightness-110 drop-shadow-[0_2px_6px_rgba(255,255,255,0.2)]"
                priority
              />
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Nền tảng học lập trình trực tuyến hàng đầu Việt Nam.
            </p>
            <div className="flex space-x-3">
              <Facebook className="w-5 h-5 text-gray-400 hover:text-blue-500 hover:scale-110 hover:rotate-6 transition-all duration-300 cursor-pointer" />
              <Twitter className="w-5 h-5 text-gray-400 hover:text-sky-400 hover:scale-110 hover:-rotate-6 transition-all duration-300 cursor-pointer" />
              <Instagram className="w-5 h-5 text-gray-400 hover:text-pink-500 hover:scale-110 hover:rotate-3 transition-all duration-300 cursor-pointer" />
              <Youtube className="w-5 h-5 text-gray-400 hover:text-red-500 hover:scale-110 hover:-rotate-3 transition-all duration-300 cursor-pointer" />
            </div>
          </div>

          <FooterSection title="SẢN PHẨM">
            <div className="flex flex-col space-y-2">
              <FooterLink href="https://codepip.com/games/nester/">
                Game Nester
              </FooterLink>
              <FooterLink href="https://flukeout.github.io/">
                Game CSS Diner
              </FooterLink>
              <FooterLink href="https://codepip.com/games/css-scoops/">
                Game CSS Selectors
              </FooterLink>
              <FooterLink href="https://flexboxfroggy.com/#vi">
                Game Froggy
              </FooterLink>
            </div>
          </FooterSection>

          <FooterSection title="KHÓA HỌC">
            <div className="flex flex-col space-y-2">
              {proCourses.map((course) => (
                <FooterLink key={course.id} href={`/courses/pro/${course.id}`}>
                  {course.title}
                </FooterLink>
              ))}
            </div>
          </FooterSection>

          <FooterSection title="LIÊN HỆ">
            <div className="space-y-3">
              <div className="flex items-start space-x-2 text-gray-400">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span className="text-sm">123 Nguyễn Văn Cừ, Q.5, TP.HCM</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">+84 (028) 1234 5678</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">info@learnx.dev</span>
              </div>
            </div>
          </FooterSection>
        </div>
      </div>

      {}
      <div className="border-t border-gray-800 relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm text-gray-400">
            <div>© {currentYear} LearnX. Tất cả quyền được bảo lưu.</div>
            <div className="flex space-x-6">
              <FooterLink href="">Chính sách bảo mật</FooterLink>
              <FooterLink href="">Điều khoản sử dụng</FooterLink>
              <FooterLink href="">Liên hệ</FooterLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
