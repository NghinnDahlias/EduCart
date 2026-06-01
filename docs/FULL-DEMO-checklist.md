# FULL DEMO CHECKLIST - EduCart

## 1. Muc tieu cua video demo

Video can chung minh duoc:

- he thong chay on dinh
- co du lieu thuc va thay doi du lieu trong CSDL
- co day du luong buyer, seller, admin
- co bonus AI, SEO, policy/legal
- co luong thanh toan, theo doi don, report scam, trust score

## 2. Chuan bi truoc khi quay

### 2.1. Khoi dong he thong

Frontend:

```bash
cd fe
npm run dev
```

Backend Docker:

```bash
cd be
docker compose up --build
```

Health check:

- mo `http://localhost:5000/api/health`
- mong doi: `ok = true`

### 2.2. Tai khoan de demo

- `buyer@educart.local / password123`
- `seller@educart.local / password123`
- `admin@educart.local / password123`
- `hoangnam@educart.local / password123`

### 2.3. Cac route nen mo san o tab rieng

- `http://localhost:3000`
- `http://localhost:3000/products`
- `http://localhost:3000/orders`
- `http://localhost:3000/forum`
- `http://localhost:3000/profile`
- `http://localhost:3000/admin`
- `http://localhost:3000/khung-phap-ly`
- `http://localhost:3000/robots.txt`
- `http://localhost:3000/sitemap.xml`

### 2.4. Cua so DB / query nen mo san

Neu demo bang SQL Server:

- bang `Users`
- bang `Products`
- bang `Orders`
- bang `OrderItems`
- bang `PaymentTransactions`
- bang `OrderFees`
- bang `Messages`
- bang `Posts`
- bang `Comments`
- bang `Reviews`
- bang `Reports`

## 3. Kich ban quay tong the

Thu tu khuyen nghi:

1. Gioi thieu de tai
2. Kien truc va stack
3. Chay he thong va health check
4. Demo buyer
5. Demo seller
6. Demo admin
7. Demo AI chatbot
8. Demo SEO
9. Demo policy/legal
10. Doi chieu du lieu trong DB

## 4. Gioi thieu mo dau

Noi mau:

"De tai cua nhom em la EduCart, mot san giao dich hoc lieu theo mo hinh C2C danh cho sinh vien. He thong duoc hien thuc bang Next.js o frontend, Node.js Express o backend, va SQL Server lam co so du lieu. Ngoai cac chuc nang co ban, he thong con co admin panel, trust score, report moderation, AI chatbot, SEO va khung phap ly."

## 5. Demo kien truc va trien khai

### 5.1. Mo source code

Chi nhanh:

- `fe/`
- `be/`
- `be/sql/`
- `docs/`

Noi mau:

"He thong duoc tach thanh frontend, backend va SQL scripts. Frontend dung App Router, backend theo huong routes, controllers, services, repositories. Database duoc khoi tao tu cac script schema, trigger va seed."

### 5.2. Demo health

- mo `http://localhost:5000/api/health`
- noi:
  - backend dang hoat dong
  - SQL Server da ket noi thanh cong

## 6. Demo buyer flow

### 6.1. Dang nhap buyer

- vao `/login`
- dang nhap `buyer@educart.local / password123`

Noi mau:

"Day la tai khoan buyer seed san de demo giao dich."

### 6.2. Xem danh sach san pham

- vao `/products`
- cuon danh sach
- loc:
  - san pham cho thue
  - tai lieu so
  - mon hoc neu can

Can nhan manh:

- danh muc phong phu
- co sach giay, tai lieu so, dung cu hoc tap

### 6.3. Xem chi tiet san pham

- mo 1 san pham
- chi:
  - hinh anh
  - mo ta
  - gia
  - thong tin seller
  - trust score / risk badge

Noi mau:

"Tai trang chi tiet san pham, nguoi mua khong chi xem noi dung san pham ma con thay duoc trust score va badge uy tin cua nguoi ban."

### 6.4. Them vao gio hang

- bam them vao gio
- vao `/cart`

Noi mau:

"San pham da vao gio hang va du lieu duoc luu trong bang CartItems."

### 6.5. Checkout

- vao `/checkout`
- chi:
  - dia chi mac dinh
  - co the sua dia chi / nhap tay
  - direct pickup freeship
  - COD / online payment ship 10.000d
  - tong tien, phi ship, tam tinh

### 6.6. Tao don va thanh toan

- chon `MoMo Sandbox` hoac `VNPay Sandbox`
- sang `/payment-gateway`
- bam `Mo phong thanh toan thanh cong`

Chi:

- trang thanh toan thanh cong
- 2 nut:
  - xem chi tiet don hang
  - tiep tuc mua sam

Noi mau:

"He thong dang o che do sandbox de demo, nhung backend van xu ly du lieu thanh toan, payment transaction va escrow."

### 6.7. Theo doi don hang buyer

- vao `/orders`
- mo chi tiet don
- chi:
  - progress bar
  - ma don
  - ten sach
  - trang thai

Neu muon demo fail case:

- tao them 1 don moi
- bam `Mo phong thanh toan that bai`
- vao `/orders`
- chi:
  - don van ton tai o `PendingPayment`
  - co the thanh toan lai trong 2 gio

### 6.8. Xac nhan don hang va review

- sau khi seller da giao, buyer vao chi tiet don
- bam `Xac nhan don hang`
- sang trang review
- gui review

Noi mau:

"Sau khi don hoan tat, buyer moi co quyen danh gia."

### 6.9. Profile buyer

- vao `/profile`
- chi:
  - thong tin ca nhan
  - dia chi
  - notifications
  - security
  - settings
  - lich su mua hang
  - coins

Chi them:

- diem danh hang ngay
- thong bao dong
- doi ngon ngu VI/EN neu can

## 7. Demo seller flow

### 7.1. Dang xuat buyer, dang nhap seller

- dang xuat
- dang nhap `seller@educart.local / password123`

### 7.2. Dang san pham moi

- vao `/post-product`
- nhap ten san pham
- mo ta
- gia
- upload anh
- chon cach giao hang
- dang bai

Noi mau:

"Seller co the dang ban hoac cho thue san pham moi. Du lieu duoc luu vao Products va ProductImages."

### 7.3. Theo doi don ban

- vao `/orders`
- mo tab don ban
- mo chi tiet mot don
- seller thao tac:
  - da nhan don
  - da chuyen cho chuyen phat
  - xac nhan da giao hang

Can nhan manh:

- seller chi thay thao tac phia ban
- buyer chi thay thao tac phia mua

## 8. Demo forum va cong dong

### 8.1. Xem forum

- vao `/forum`
- chi 4-5 bai viet co san:
  - xin tai lieu so
  - hoi bai
  - hoi mon hoc

### 8.2. Tao bai moi

- vao trang tao bai
- nhap title + content
- dang bai

### 8.3. Comment va vote

- mo chi tiet bai
- them comment
- vote bai

Noi mau:

"Ngoai san giao dich, EduCart con ho tro cong dong hoc tap va trao doi hoc lieu."

## 9. Demo chat va thong bao

### 9.1. Nhan tin buyer - seller

- vao `/chat`
- gui 1 tin nhan

### 9.2. Notification

- vao `/profile`
- mo muc thong bao
- chi:
  - nhac thanh toan
  - seller da nhan don
  - seller da chuyen phat
  - hang da giao
  - co tin nhan moi

## 10. Demo report scam va trust score

### 10.1. Gui report

- buyer vao chi tiet seller hoac product
- mo form report
- nhap:
  - ly do
  - mo ta
  - bang chung
- gui report

### 10.2. Hien trust score

- mo seller page
- chi:
  - trust score
  - warning badge
  - pop-up/canh bao neu seller co risk

Noi mau:

"Day la co che trust score va report moderation de tang do an toan giao dich."

## 11. Demo admin panel

### 11.1. Dang nhap admin

- dang xuat
- dang nhap `admin@educart.local / password123`
- vao `/admin`

### 11.2. Dashboard

- chi:
  - so user
  - so seller
  - so buyer
  - so san pham
  - so don hang
  - so report
  - escrow
  - phi san
  - payout
  - filter 1 ngay / 7 ngay / 30 ngay / 90 ngay / 365 ngay

### 11.3. Duyet report

- mo report queue
- chon 1 report moi tao
- bam `Canh bao user`

Sau do:

- quay lai trang seller
- refresh
- chi trust score giam

Noi mau:

"Moi lan canh bao hop le, he thong giam trust score va luu warning count. Neu vuot nguong, tai khoan co the bi tam khoa hoac ban."

### 11.4. Kiem duyet dien dan

- an/hien bai viet
- moderation post neu can

## 12. Demo AI chatbot

### 12.1. Mo chatbot

- mo nut chat AI o goc phai duoi

### 12.2. Demo cac cau hoi

Hoi lan luot:

1. `Xin chao`
2. `Don hang cua toi dang o dau?`
3. `Toi muon thanh toan lai don hang`
4. `Trust score duoc tinh nhu the nao?`
5. `Goi y giao trinh Giai tich 1`
6. `Scan giao trinh co duoc ban khong?`

Can nhan manh:

- chatbot ho tro intent thuc
- co goi y san pham
- co hoi dap ve trust score, report, ban quyen

Neu backend AI chua rebuild:

- chatbot van co frontend fallback de demo

## 13. Demo SEO

### 13.1. Robots va sitemap

- mo `/robots.txt`
- mo `/sitemap.xml`

### 13.2. Metadata

- mo `/products`
- mo `/forum`
- mo `/khung-phap-ly`
- inspect title va meta description

Noi mau:

"He thong da co metadata, robots va sitemap de ho tro index va toi uu SEO on-page."

## 14. Demo policy / legal

- vao `/khung-phap-ly`
- chi muc luc sticky ben trai
- cuon cac muc:
  - quy che san
  - chinh sach bao mat
  - thanh toan
  - tranh chap
  - ban quyen
  - trust score policy

Noi mau:

"Day la khung phap ly duoc bo sung de he thong giong voi mot san TMDT thuc te."

## 15. Doi chieu du lieu trong DB

Sau cac buoc tren, mo SQL Server va query:

### 15.1. Users

- user moi dang ky
- trust score seller thay doi sau moderation

### 15.2. Products

- san pham moi vua dang

### 15.3. Orders va PaymentTransactions

- don moi vua tao
- payment transaction vua simulate
- order fees va escrow data

### 15.4. Reviews

- review buyer vua gui

### 15.5. Reports

- report vua tao
- status sau khi admin xu ly

### 15.6. Posts / Comments / Messages

- bai viet forum moi
- comment moi
- tin nhan moi

Noi mau:

"Tat ca cac thao tac tren giao dien deu da duoc ghi xuong CSDL, the hien qua cac bang lien quan."

## 16. Kich ban quay toi uu 10-15 phut

1. mo dau + stack
2. health check
3. buyer login
4. products + filter + detail
5. cart + checkout + payment success
6. orders buyer
7. seller login + process order
8. buyer confirm + review
9. forum + comment
10. chat + notification
11. report seller
12. admin duyet report + dashboard
13. chatbot AI
14. robots + sitemap + metadata
15. policy page
16. doi chieu DB

## 17. Truong hop bonus neu con thoi gian

- demo thanh toan that bai va thanh toan lai
- demo canh bao seller nhieu lan de giam trust score
- demo doi ngon ngu VI/EN
- demo coins diem danh
- demo legal policy trust score

## 18. Nhung loi can tranh khi quay

- quyen dang nhap sai vai tro buyer/seller/admin
- backend Docker chua rebuild nen chatbot hoac admin route chua len
- frontend dang co process `next build` khac chay song song
- khong refresh seller page sau khi admin moderation nen trust score chua doi tren UI

## 19. Ket luan dong video

Noi mau:

"Qua video demo, he thong EduCart da the hien day du luong buyer, seller, admin, thanh toan, theo doi don, report scam, trust score, AI chatbot, SEO va khung phap ly. Toan bo du lieu thao tac deu duoc luu va doi chieu duoc trong CSDL."
