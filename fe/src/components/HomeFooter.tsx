"use client";

import Link from "next/link";
import { MapPin, Share2 } from "lucide-react";

import { useLocale } from "@/components/locale-provider";

const footerDictionary = {
  vi: {
    aboutText:
      "EduCart xây dựng hệ sinh thái chia sẻ học liệu cho sinh viên, tập trung vào giáo trình, tài liệu số, dụng cụ học tập và mô hình thuê ngắn hạn minh bạch trong môi trường campus.",
    links: "Về chúng tôi",
    contact: "Thông tin liên hệ",
    newsletter: "Đăng ký nhận tin",
    newsletterText: "Cập nhật khuyến mại, tài liệu số mới và các tin đăng nổi bật.",
    guide: "Hướng dẫn giao dịch",
    rentPolicy: "Chính sách thuê sách",
    quality: "Quy chuẩn kiểm định chất lượng",
    support: "Trung tâm trợ giúp và khiếu nại",
    legal: "Bộ hồ sơ pháp lý",
    address: "Địa điểm: Trường Đại học Bách khoa - ĐHQG HCM, cơ sở 2",
    email: "Email: contact.educart@gmail.com",
    phone: "Số điện thoại: 0329 123 456",
    facebook: "Facebook: facebook.com/EduCart.HCMUT",
    emailPlaceholder: "Email của bạn",
    subscribe: "Đăng ký",
    rights: "© 2024 EDUCart Group. All rights reserved.",
  },
  en: {
    aboutText:
      "EduCart builds a student-to-student learning marketplace focused on textbooks, digital resources, study tools, and short-term rentals with transparent campus-friendly transactions.",
    links: "About us",
    contact: "Contact",
    newsletter: "Newsletter",
    newsletterText: "Get updates on deals, digital resources, and featured listings.",
    guide: "Trading guide",
    rentPolicy: "Book rental policy",
    quality: "Quality control standards",
    support: "Support and dispute center",
    legal: "Legal package",
    address: "Location: Ho Chi Minh City University of Technology, campus 2",
    email: "Email: contact.educart@gmail.com",
    phone: "Phone: 0329 123 456",
    facebook: "Facebook: facebook.com/EduCart.HCMUT",
    emailPlaceholder: "Your email",
    subscribe: "Subscribe",
    rights: "© 2024 EDUCart Group. All rights reserved.",
  },
} as const;

export default function HomeFooter() {
  const { locale } = useLocale();
  const t = footerDictionary[locale];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-xl font-bold text-white">EduCart</h3>
            <p className="mt-4 text-sm leading-7">{t.aboutText}</p>
            <Link href="/khung-phap-ly" className="mt-4 inline-block text-sm font-semibold text-blue-300 hover:text-white">
              {t.legal}
            </Link>
            <div className="mt-4 flex gap-3">
              <button className="rounded-lg p-2 hover:bg-gray-800" aria-label="Location">
                <MapPin className="h-5 w-5" />
              </button>
              <button className="rounded-lg p-2 hover:bg-gray-800" aria-label="Share">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white">{t.links}</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/huong-dan-giao-dich" className="hover:text-white">{t.guide}</Link></li>
              <li><Link href="/chinh-sach-thue-sach" className="hover:text-white">{t.rentPolicy}</Link></li>
              <li><Link href="/quy-chuan-chat-luong" className="hover:text-white">{t.quality}</Link></li>
              <li><Link href="/trung-tam-ho-tro" className="hover:text-white">{t.support}</Link></li>
              <li><Link href="/khung-phap-ly" className="hover:text-white">{t.legal}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white">{t.contact}</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="text-white">{t.address}</li>
              <li className="text-white">{t.email}</li>
              <li className="text-white">{t.phone}</li>
              <li className="text-white">{t.facebook}</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white">{t.newsletter}</h4>
            <p className="mt-2 text-sm">{t.newsletterText}</p>
            <div className="mt-4 flex">
              <input
                type="email"
                placeholder={t.emailPlaceholder}
                className="flex-1 rounded-l-lg bg-gray-800 px-4 py-2 text-sm text-white placeholder-gray-500 outline-none"
              />
              <button className="rounded-r-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                {t.subscribe}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8">
          <p className="text-center text-sm text-gray-500">{t.rights}</p>
        </div>
      </div>
    </footer>
  );
}
