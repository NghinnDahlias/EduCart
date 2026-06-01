# Bao Cao Ky Thuat EduCart

## 1. Tong quan de tai

EduCart la san giao dich hoc lieu theo mo hinh C2C, huong den doi tuong chinh la sinh vien. He thong cho phep nguoi dung dang ky tai khoan, dang ban hoac cho thue hoc lieu, mua hang, thanh toan, theo doi don hang, nhan tin, tham gia dien dan hoc tap, danh gia sau giao dich, bao cao hanh vi gian lan va su dung bo cong cu quan tri noi bo.

Ban hien thuc trong repo nay la:

- Frontend: Next.js App Router + TypeScript
- Backend: Node.js + Express
- CSDL: Microsoft SQL Server
- Trien khai: local hoac Docker Compose

Luu y quan trong: yeu cau mon hoc co neu Postgresql/Node.js "hoac cong nghe phu hop". Ban hien thuc thuc te cua EduCart dang dung SQL Server, vi vay bao cao can mo ta dung stack da code, da demo va da luu du lieu.

## 2. Muc tieu he thong

He thong duoc xay dung de giai quyet cac nhu cau sau:

- mua ban sach hoc, tai lieu so, dung cu hoc tap
- cho thue sach giao trinh va bo kit hoc tap
- quan ly giao dich co trung gian giu tien
- tang do an toan giao dich bang trust score, report va moderation
- ho tro cong dong hoc tap qua dien dan va nhan tin
- cung cap dashboard admin de giam sat van hanh
- bo sung cac module bonus gom AI Chatbot, SEO va khung phap ly san

## 3. Kien truc hien thuc

### 3.1. Kien truc tong the

He thong duoc tach thanh 3 lop:

1. Frontend web trong thu muc `fe/`
2. Backend REST API trong thu muc `be/`
3. SQL Server va cac script khoi tao CSDL trong `be/sql/`

Luong xu ly tong quat:

1. Nguoi dung thao tac tren giao dien
2. Frontend goi API qua helper [fe/src/lib/api.ts](/c:/Users/user/Desktop/EduCart/fe/src/lib/api.ts:1)
3. Backend route nhan request, middleware xu ly auth/validation
4. Controller goi service hoac repository phu hop
5. Service thuc thi business rule
6. Repository truy van SQL Server
7. Du lieu duoc tra ve giao dien hoac ghi xuong database

### 3.2. Kien truc frontend

Frontend su dung Next.js App Router. Cac man hinh chinh nam trong:

- [fe/src/app/page.tsx](/c:/Users/user/Desktop/EduCart/fe/src/app/page.tsx:1)
- [fe/src/app/products/page.tsx](/c:/Users/user/Desktop/EduCart/fe/src/app/products/page.tsx:1)
- [fe/src/app/products/[id]/page.tsx](/c:/Users/user/Desktop/EduCart/fe/src/app/products/%5Bid%5D/page.tsx:1)
- [fe/src/app/cart/page.tsx](/c:/Users/user/Desktop/EduCart/fe/src/app/cart/page.tsx:1)
- [fe/src/app/checkout/page.tsx](/c:/Users/user/Desktop/EduCart/fe/src/app/checkout/page.tsx:1)
- [fe/src/app/orders/page.tsx](/c:/Users/user/Desktop/EduCart/fe/src/app/orders/page.tsx:1)
- [fe/src/app/profile/page.tsx](/c:/Users/user/Desktop/EduCart/fe/src/app/profile/page.tsx:1)
- [fe/src/app/forum/page.tsx](/c:/Users/user/Desktop/EduCart/fe/src/app/forum/page.tsx:1)
- [fe/src/app/chat/page.tsx](/c:/Users/user/Desktop/EduCart/fe/src/app/chat/page.tsx:1)
- [fe/src/app/admin/page.tsx](/c:/Users/user/Desktop/EduCart/fe/src/app/admin/page.tsx:1)

Thanh phan dung chung:

- [fe/src/components/HomeNavbar.tsx](/c:/Users/user/Desktop/EduCart/fe/src/components/HomeNavbar.tsx:1)
- [fe/src/components/HomeFooter.tsx](/c:/Users/user/Desktop/EduCart/fe/src/components/HomeFooter.tsx:1)
- [fe/src/components/locale-provider.tsx](/c:/Users/user/Desktop/EduCart/fe/src/components/locale-provider.tsx:1)
- [fe/src/components/SupportChatbot.tsx](/c:/Users/user/Desktop/EduCart/fe/src/components/SupportChatbot.tsx:1)

Dac diem frontend:

- App Router theo file-based routing
- client component cho cac trang nghiep vu can tuong tac
- JWT va user cache luu trong `localStorage`
- ho tro doi ngon ngu VI/EN o mot so man hinh chinh
- metadata, robots va sitemap phuc vu SEO

### 3.3. Kien truc backend

Backend duoc to chuc theo huong:

- `routes -> controllers -> services -> repositories`

File quan trong:

- [be/src/server.js](/c:/Users/user/Desktop/EduCart/be/src/server.js:1)
- [be/src/routes/index.js](/c:/Users/user/Desktop/EduCart/be/src/routes/index.js:1)
- [be/src/container.js](/c:/Users/user/Desktop/EduCart/be/src/container.js:1)
- [be/src/config/db.js](/c:/Users/user/Desktop/EduCart/be/src/config/db.js:1)

Lop backend gom:

- `routes`: khai bao endpoint
- `controllers`: nhan request, validate, tra response
- `services`: xu ly luat nghiep vu
- `repositories`: truy cap du lieu va transaction
- `middlewares`: auth, admin, upload, error handler
- `patterns`: cac design pattern cho order/payment/observer

### 3.4. Design patterns da su dung

EduCart khong chi dung CRUD don thuan ma co ap dung cac mau thiet ke:

- Factory Pattern
  - tao `BuyOrder` va `RentOrder`
- State Pattern
  - quan ly vong doi don hang
- Strategy Pattern
  - chuyen doi giua MoMo sandbox va VNPay sandbox
- Observer Pattern
  - lang nghe su kien thanh toan, release escrow, inventory, order state

Thu muc lien quan:

- [be/src/patterns/factory](/c:/Users/user/Desktop/EduCart/be/src/patterns/factory)
- [be/src/patterns/state](/c:/Users/user/Desktop/EduCart/be/src/patterns/state)
- [be/src/patterns/strategy](/c:/Users/user/Desktop/EduCart/be/src/patterns/strategy)
- [be/src/patterns/observer](/c:/Users/user/Desktop/EduCart/be/src/patterns/observer)

## 4. Cach trien khai he thong

### 4.1. Moi truong can chuan bi

- Node.js 18+
- npm
- Docker Desktop
- Microsoft SQL Server Express neu chay local khong dung Docker

### 4.2. Cau truc repo

```text
EduCart/
|-- be/      # Backend + docker-compose + SQL scripts
|-- fe/      # Frontend Next.js
|-- docs/    # Bao cao, testcase, demo notes
`-- README.md
```

### 4.3. Chay frontend local

```bash
cd fe
npm install
npm run dev
```

Mac dinh frontend chay tai:

```text
http://localhost:3000
```

### 4.4. Chay backend local

```bash
cd be
npm install
npm run dev
```

Health check:

```text
http://localhost:5000/api/health
```

### 4.5. Chay bang Docker

Tat ca lenh Docker duoc chay trong thu muc `be/`:

```bash
cd be
docker compose down -v
docker compose up --build
```

He thong gom:

- `db`: SQL Server
- `db-init`: chay schema, trigger, seed
- `api`: backend Express

### 4.6. Bien moi truong

Backend:

- `PORT`
- `DB_PASSWORD`
- `JWT_SECRET`

Frontend:

- `NEXT_PUBLIC_API_BASE_URL`

Neu thay doi `.env`, can restart service tuong ung.

## 5. Ban hien thuc CSDL

### 5.1. He quan tri CSDL

EduCart dung:

- Microsoft SQL Server

Driver ket noi:

- `mssql`

File cau hinh:

- [be/src/config/db.js](/c:/Users/user/Desktop/EduCart/be/src/config/db.js:1)

### 5.2. Script khoi tao

Cac file SQL chinh:

- [be/sql/educart_schema.sql](/c:/Users/user/Desktop/EduCart/be/sql/educart_schema.sql:1)
- [be/sql/triggers.sql](/c:/Users/user/Desktop/EduCart/be/sql/triggers.sql:1)
- [be/sql/stored_procedures.sql](/c:/Users/user/Desktop/EduCart/be/sql/stored_procedures.sql:1)
- [be/sql/seed_data.sql](/c:/Users/user/Desktop/EduCart/be/sql/seed_data.sql:1)
- [be/sql/init-db.sh](/c:/Users/user/Desktop/EduCart/be/sql/init-db.sh:1)

### 5.3. Nhom bang chinh

#### A. Nhom nguoi dung va hoc tap

- `Users`
- `Universities`
- `Faculties`
- `Subjects`
- `UserUniversity`

Y nghia:

- luu thong tin tai khoan
- vai tro buyer/seller/admin
- lien ket truong, khoa, mon hoc
- trust score, canh bao, moderation status

#### B. Nhom san pham va danh muc

- `Products`
- `ProductImages`
- `CartItems`

Y nghia:

- san pham mua, cho thue, hoc lieu so, dung cu hoc tap
- luu hinh anh
- gio hang nguoi dung

#### C. Nhom giao dich

- `Orders`
- `OrderItems`
- `PaymentTransactions`
- `OrderFees`
- `Shipments`

Y nghia:

- luu don mua va don thue
- luu escrow, phi san, payout seller
- quan ly giao hang va vong doi don

#### D. Nhom cong dong

- `Messages`
- `Posts`
- `Comments`
- `PostVotes`
- `Reviews`
- `Reports`

Y nghia:

- nhan tin giua buyer/seller
- dien dan hoc tap
- danh gia sau giao dich
- bao cao scam, vi pham, ban quyen

### 5.4. Nghiep vu CSDL noi bat

- reserve san pham ngay khi tao don de tranh oversell
- pending payment co han 2 gio
- escrow giu tien o he thong truoc khi seller duoc release payout
- trust score, warning count, suspended until duoc luu tren `Users`
- report moderation luu bang chung, xu ly va ghi chu admin

## 6. Cac chuc nang da hien thuc

### 6.1. Xac thuc va tai khoan

- dang ky
- dang nhap
- JWT authentication
- cap nhat profile
- dia chi giao hang
- doi mat khau trong profile
- security section, settings, notifications, purchase history
- diem danh hang ngay va coin reward

### 6.2. San pham

- dang san pham mua/cho thue
- upload anh
- filter theo truong/khoa/mon hoc
- filter mua, thue, tai lieu so
- chi tiet san pham
- xem trust signal cua seller
- report seller/san pham

### 6.3. Gio hang va checkout

- them/xoa gio hang
- checkout tu gio hang hoac tu 1 san pham
- hien san thong tin giao hang
- direct pickup freeship
- COD / online payment co ship dong gia 10.000d
- tinh tien tam tinh, phi ship, tong tien

### 6.4. Don hang

- tao don mua va don thue
- nguoi mua theo doi don
- thanh toan lai don trong 2 gio neu `PendingPayment`
- huy don neu seller chua ban giao cho van chuyen
- buyer xac nhan da nhan
- buyer danh gia sau khi hoan tat
- seller thao tac theo dung vai tro:
  - da nhan don
  - da chuyen cho chuyen phat
  - xac nhan da giao hang

### 6.5. Thanh toan va escrow

- MoMo sandbox
- VNPay sandbox
- simulate thanh cong / that bai
- app giu tien truoc
- chi release cho seller khi don hoan tat
- phi san 9%
  - 2% service fee
  - 7% commission

### 6.6. Dien dan va cong dong

- tao bai viet
- binh luan
- vote
- hoi bai, xin tai lieu, trao doi mon hoc

### 6.7. Chat va thong bao

- nhan tin buyer/seller
- notification dong trong profile
- nhac thanh toan, da nhan don, da giao, hang sap toi, co tin nhan moi

### 6.8. Admin panel

Trang:

- [fe/src/app/admin/page.tsx](/c:/Users/user/Desktop/EduCart/fe/src/app/admin/page.tsx:1)

Chuc nang:

- dashboard theo 1 ngay, 7 ngay, 30 ngay, 90 ngay, 365 ngay
- thong ke user, buyer, seller, product, order, report
- thong ke don giao thanh cong, don huy, escrow, platform fee
- moderation report
- canh bao, tam khoa, ban user
- an/hien bai viet dien dan
- trust score va risk badge

### 6.9. Policy va khung phap ly

Trang:

- [fe/src/app/khung-phap-ly/page.tsx](/c:/Users/user/Desktop/EduCart/fe/src/app/khung-phap-ly/page.tsx:1)

Noi dung:

- quy che hoat dong san TMDT
- chinh sach bao mat
- chinh sach thanh toan
- chinh sach khiu nai, tranh chap
- chinh sach hoc lieu va ban quyen
- trust score policy
- nghia vu seller va to chuc

### 6.10. AI Chatbot

Files chinh:

- [be/src/controllers/ai.controller.js](/c:/Users/user/Desktop/EduCart/be/src/controllers/ai.controller.js:1)
- [be/src/routes/ai.routes.js](/c:/Users/user/Desktop/EduCart/be/src/routes/ai.routes.js:1)
- [fe/src/components/SupportChatbot.tsx](/c:/Users/user/Desktop/EduCart/fe/src/components/SupportChatbot.tsx:1)

Tinh nang:

- hoi ve don hang, thanh toan, trust score, report, ban quyen
- goi y hoc lieu tu kho san pham hien co
- doc ngu canh don hang gan day neu user dang dang nhap

### 6.11. SEO & localization

SEO:

- metadata toan site
- metadata cho cac route chinh
- `robots.txt`
- `sitemap.xml`

Files:

- [fe/src/lib/seo.ts](/c:/Users/user/Desktop/EduCart/fe/src/lib/seo.ts:1)
- [fe/src/app/robots.ts](/c:/Users/user/Desktop/EduCart/fe/src/app/robots.ts:1)
- [fe/src/app/sitemap.ts](/c:/Users/user/Desktop/EduCart/fe/src/app/sitemap.ts:1)

Localization:

- shared locale VI/EN
- navbar/footer/profile/orders/login/register/cart da co doi ngon ngu

## 7. Bao mat va quan tri rui ro

- JWT auth
- bcrypt hash mat khau
- requireAuth va requireAdmin
- report scam va moderation workflow
- trust score giam theo vi pham
- 10 canh bao hop le hoac score <= 50 co the dan toi tam khoa 7 ngay
- tai pham sau giai doan do co the ban vinh vien
- co risk badge hien cho buyer tren trang seller/san pham

## 8. Cach trien khai va du lieu demo

### 8.1. Du lieu seed

Seed du lieu phuc vu demo da bo sung:

- nhieu san pham cho thue
- nhieu tai lieu so
- nhieu bai dien dan mau
- tai khoan admin
- trust/report seed support

Tai khoan de demo:

- `admin@educart.local / password123`
- `buyer@educart.local / password123`
- `seller@educart.local / password123`
- `hoangnam@educart.local / password123`

### 8.2. Luong quay video de xac nhan thay doi trong DB

1. dang nhap buyer
2. xem san pham, them gio, checkout
3. simulate thanh toan
4. vao orders theo doi trang thai
5. seller xu ly giao hang
6. buyer xac nhan da nhan, gui review
7. vao admin dashboard va report moderation
8. mo SQL Server hoac API de doi chieu du lieu trong `Orders`, `PaymentTransactions`, `Reports`, `Reviews`

## 9. Kiem thu va chat luong

### 9.1. Automation

Backend da co cac nhom test:

- `auth.service.test.js`
- `product.service.test.js`
- `order.service.test.js`
- `payment.service.test.js`

Noi dung:

- auth va migration plaintext -> bcrypt
- product validation
- order lifecycle
- payment sandbox / simulate flow

### 9.2. UAT

Tai lieu UAT cap nhat nam tai:

- [docs/uat-automation-testcases.md](/c:/Users/user/Desktop/EduCart/docs/uat-automation-testcases.md:1)

UAT bao phu:

- auth
- product
- cart
- checkout
- payment
- orders
- profile
- forum
- messages
- admin
- trust/report
- AI chatbot
- SEO

## 10. Danh sach file quan trong

| File | Vai tro |
|---|---|
| [be/src/server.js](/c:/Users/user/Desktop/EduCart/be/src/server.js:1) | khoi tao backend |
| [be/src/routes/index.js](/c:/Users/user/Desktop/EduCart/be/src/routes/index.js:1) | mount cac route API |
| [be/src/config/db.js](/c:/Users/user/Desktop/EduCart/be/src/config/db.js:1) | ket noi SQL Server |
| [be/sql/educart_schema.sql](/c:/Users/user/Desktop/EduCart/be/sql/educart_schema.sql:1) | schema CSDL |
| [be/sql/seed_data.sql](/c:/Users/user/Desktop/EduCart/be/sql/seed_data.sql:1) | du lieu demo |
| [fe/src/lib/api.ts](/c:/Users/user/Desktop/EduCart/fe/src/lib/api.ts:1) | client API |
| [fe/src/app/layout.tsx](/c:/Users/user/Desktop/EduCart/fe/src/app/layout.tsx:1) | layout toan site, locale, chatbot |
| [fe/src/app/admin/page.tsx](/c:/Users/user/Desktop/EduCart/fe/src/app/admin/page.tsx:1) | admin panel |
| [fe/src/app/khung-phap-ly/page.tsx](/c:/Users/user/Desktop/EduCart/fe/src/app/khung-phap-ly/page.tsx:1) | khung phap ly |

## 11. Han che hien tai

- mot so man hinh cu van con text encoding chua dep hoan toan
- chatbot hien tai la rule-based, chua dung LLM ben ngoai
- frontend build can tranh chay song song nhieu `next build`
- `stored_procedures.sql` can tiep tuc doi chieu neu muon dua vao nghiep vu nang hon

## 12. Ket luan

EduCart da duoc hien thuc thanh mot he thong web TMDT hoc lieu co day du luong co ban va cac module bonus noi bat. He thong khong chi co frontend, backend va CSDL, ma con co trust score, report moderation, admin panel, policy/legal package, SEO va AI chatbot. Day la mot ban hien thuc co tinh thuc te va co the demo ro su thay doi du lieu trong CSDL.
