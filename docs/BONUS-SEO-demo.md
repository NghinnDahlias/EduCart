# BONUS SEO Demo

## Mục tiêu

File này là kịch bản quay video ngắn để demo phần `SEO & Optimization` của EduCart.

Mục tiêu khi quay:
- chứng minh hệ thống có metadata SEO
- chứng minh có `robots.txt` và `sitemap.xml`
- chứng minh các trang chính có title/description riêng
- chứng minh Lighthouse có hạng mục SEO hoạt động

## Chuẩn bị trước khi quay

1. Chạy frontend:

```bash
cd fe
npm run dev
```

2. Mở web tại:

```text
http://localhost:3000
```

3. Dùng Chrome hoặc Edge để dễ chạy Lighthouse.

## Các file có thể mở để giải thích nhanh

- [fe/src/lib/seo.ts](/c:/Users/user/Desktop/EduCart/fe/src/lib/seo.ts:1)
- [fe/src/app/layout.tsx](/c:/Users/user/Desktop/EduCart/fe/src/app/layout.tsx:1)
- [fe/src/app/robots.ts](/c:/Users/user/Desktop/EduCart/fe/src/app/robots.ts:1)
- [fe/src/app/sitemap.ts](/c:/Users/user/Desktop/EduCart/fe/src/app/sitemap.ts:1)
- [fe/src/app/products/layout.tsx](/c:/Users/user/Desktop/EduCart/fe/src/app/products/layout.tsx:1)
- [fe/src/app/products/[id]/layout.tsx](/c:/Users/user/Desktop/EduCart/fe/src/app/products/%5Bid%5D/layout.tsx:1)
- [fe/src/app/forum/layout.tsx](/c:/Users/user/Desktop/EduCart/fe/src/app/forum/layout.tsx:1)
- [fe/src/app/forum/[id]/layout.tsx](/c:/Users/user/Desktop/EduCart/fe/src/app/forum/%5Bid%5D/layout.tsx:1)
- [fe/src/app/seller/[id]/layout.tsx](/c:/Users/user/Desktop/EduCart/fe/src/app/seller/%5Bid%5D/layout.tsx:1)
- [fe/src/app/khung-phap-ly/layout.tsx](/c:/Users/user/Desktop/EduCart/fe/src/app/khung-phap-ly/layout.tsx:1)

## Kịch bản quay video 1 đến 2 phút

### Phần 1. Giới thiệu nhanh

Nói:

```text
Phần bonus SEO của EduCart tập trung vào tối ưu on-page bằng metadata, canonical URL, robots.txt, sitemap.xml và metadata riêng cho các trang quan trọng như sản phẩm, người bán, diễn đàn và trang pháp lý.
```

### Phần 2. Demo robots.txt

Mở:

```text
http://localhost:3000/robots.txt
```

Nói:

```text
Đây là file robots.txt. Hệ thống đã khai báo các vùng cho phép bot truy cập, đồng thời chặn một số vùng nội bộ như admin, checkout và payment gateway. File này cũng trỏ tới sitemap.xml của hệ thống.
```

Điểm cần chỉ:
- có `allow: /`
- có `disallow` cho các route nội bộ
- có link tới `sitemap.xml`

### Phần 3. Demo sitemap.xml

Mở:

```text
http://localhost:3000/sitemap.xml
```

Nói:

```text
Đây là sitemap.xml. Hệ thống đã khai báo các route quan trọng để hỗ trợ search engine thu thập dữ liệu, ví dụ trang chủ, trang sản phẩm, diễn đàn và các trang chính sách.
```

Điểm cần chỉ:
- `/`
- `/products`
- `/forum`
- `/khung-phap-ly`

### Phần 4. Demo metadata trang danh sách sản phẩm

Mở:

```text
http://localhost:3000/products
```

Thao tác:
- nhấn `F12`
- vào tab `Elements`
- tìm:
  - `<title>`
  - `<meta name="description">`
  - `<link rel="canonical">`

Nói:

```text
Trang sản phẩm có metadata riêng gồm tiêu đề, mô tả và canonical URL. Đây là tối ưu on-page cơ bản để công cụ tìm kiếm hiểu được nội dung trang.
```

### Phần 5. Demo metadata trang chi tiết sản phẩm

Mở một sản phẩm bất kỳ, ví dụ:

```text
http://localhost:3000/products/1
```

Thao tác:
- vẫn ở `Elements`
- tìm lại:
  - `<title>`
  - `<meta name="description">`
  - `og:title`
  - `og:description`

Nói:

```text
Trang chi tiết sản phẩm có metadata riêng cho product detail và có thêm Open Graph để hỗ trợ chia sẻ liên kết trên mạng xã hội.
```

### Phần 6. Demo metadata seller và forum

Mở:

```text
http://localhost:3000/seller/1
http://localhost:3000/forum/1
```

Nói:

```text
Ngoài trang sản phẩm, các route quan trọng khác như hồ sơ người bán và bài viết diễn đàn cũng có metadata riêng để tăng khả năng index và hiển thị đúng ngữ cảnh tìm kiếm.
```

### Phần 7. Demo trang pháp lý

Mở:

```text
http://localhost:3000/khung-phap-ly
```

Nói:

```text
Trang pháp lý không chỉ phục vụ nghiệp vụ và độ tin cậy của nền tảng mà còn là một nhóm trang nội dung tĩnh có giá trị SEO, vì nội dung rõ ràng, có cấu trúc và có khả năng được index tốt.
```

### Phần 8. Demo Lighthouse

Mở DevTools:
- chọn tab `Lighthouse`
- tick:
  - `Performance`
  - `Best Practices`
  - `SEO`
- chạy trên:
  - `/`
  - `/products`
  - `/khung-phap-ly`

Nói:

```text
Ở đây nhóm dùng Lighthouse để kiểm tra chất lượng on-page. Mục SEO xác nhận hệ thống có title, description, khả năng index, cấu trúc link và các tín hiệu cơ bản cần thiết cho tìm kiếm.
```

Nếu cần quay ngắn hơn, chỉ cần chạy Lighthouse ở `/products`.

## Phiên bản nói ngắn gọn

Nếu bạn cần nói nhanh trong 30 đến 45 giây:

```text
EduCart đã triển khai tối ưu SEO on-page ở mức nền tảng. Toàn hệ thống có metadata chung, các trang quan trọng như sản phẩm, người bán, diễn đàn và chính sách pháp lý có metadata riêng. Hệ thống cũng cung cấp robots.txt và sitemap.xml để hỗ trợ bot tìm kiếm thu thập dữ liệu. Khi kiểm tra bằng Lighthouse, phần SEO có thể xác nhận các tín hiệu cơ bản như title, description, canonical và khả năng index trang.
```

## Checklist khi quay

- mở được `/robots.txt`
- mở được `/sitemap.xml`
- mở được `/products`
- mở được `/products/1`
- mở được `/seller/1`
- mở được `/forum/1`
- mở được `/khung-phap-ly`
- trong DevTools nhìn thấy:
  - `title`
  - `meta description`
  - `canonical`
  - `og:title`
  - `og:description`
- chạy ít nhất 1 lần Lighthouse

## Gợi ý chụp ảnh cho báo cáo

Bạn nên chụp 4 ảnh:

1. Ảnh `robots.txt`
2. Ảnh `sitemap.xml`
3. Ảnh DevTools hiển thị `title + meta description + canonical`
4. Ảnh Lighthouse tab `SEO`

## Gợi ý ghi vào báo cáo kỹ thuật

Bạn có thể viết:

```text
Hệ thống EduCart đã triển khai tối ưu SEO on-page với metadata cấp toàn cục và metadata theo route cho các trang trọng yếu như sản phẩm, hồ sơ người bán, diễn đàn và trang chính sách. Ngoài ra, hệ thống sinh robots.txt và sitemap.xml để hỗ trợ search engine crawler. Việc đánh giá bằng Lighthouse cho thấy ứng dụng đã đáp ứng các tín hiệu SEO cơ bản ở tầng frontend.
```
