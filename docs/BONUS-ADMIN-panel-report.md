# BONUS Admin Panel Report

## 1. Muc tieu module

Admin Panel duoc xay dung de giai quyet bai toan van hanh noi bo cho san EduCart. Module nay giup quan tri vien:

- theo doi tinh hinh hoat dong cua nen tang
- quan sat so lieu user, seller, buyer, product, order, report
- kiem duyet report scam va vi pham
- quan ly trust score va risk badge cua nguoi dung
- kiem soat noi dung dien dan
- giam sat luong tien escrow, payout va phi san

Khac voi giao dien nguoi dung cuoi, admin panel dong vai tro la lop dieu hanh va quan tri rui ro.

## 2. Co so ly thuyet

### 2.1. Internal administration dashboard

Trong cac san TMDT thuc te, admin panel la thanh phan bat buoc de:

- theo doi KPI van hanh
- xu ly tranh chap
- moderation noi dung
- phat hien gian lan
- quan ly tai khoan vi pham

Do an EduCart ap dung huong nay de mo phong mot san giao dich thuc te, khong chi gom buyer va seller ma con co vai tro van hanh noi bo.

### 2.2. Moderation va trust governance

Admin panel khong chi hien thi dashboard ma con la noi xu ly moderation:

- review report
- canh bao user
- tam khoa
- ban vinh vien
- cap nhat trust score

Day la su ket hop giua:

- governance dashboard
- moderation tool
- risk management module

## 3. Kien truc hien thuc

### 3.1. Frontend

Trang admin nam tai:

- [fe/src/app/admin/page.tsx](/c:/Users/user/Desktop/EduCart/fe/src/app/admin/page.tsx:1)

Man hinh nay thuc hien:

- fetch snapshot dashboard
- fetch timeline theo khoang thoi gian
- fetch queue report
- fetch danh sach user moderation
- fetch danh sach bai viet forum moderation

### 3.2. Backend

File chinh:

- [be/src/controllers/admin.controller.js](/c:/Users/user/Desktop/EduCart/be/src/controllers/admin.controller.js:1)
- [be/src/routes/admin.routes.js](/c:/Users/user/Desktop/EduCart/be/src/routes/admin.routes.js:1)
- [be/src/middlewares/requireAdmin.js](/c:/Users/user/Desktop/EduCart/be/src/middlewares/requireAdmin.js:1)
- [be/src/repositories/analytics.repository.js](/c:/Users/user/Desktop/EduCart/be/src/repositories/analytics.repository.js:1)

Route admin chi cho phep:

- user da dang nhap
- co role `Admin`

### 3.3. Rang buoc truy cap

Admin panel duoc bao ve 2 lop:

1. frontend chi hien nut `Admin` cho tai khoan admin tren navbar
2. backend dung `requireAuth` + `requireAdmin` de chan truy cap trai phep

## 4. Cac chuc nang da hien thuc

### 4.1. Dashboard tong quan

Admin xem duoc:

- tong so user
- tong so buyer
- tong so seller
- tong so product
- tong so order
- tong so report
- tong so don giao thanh cong
- tong so don huy
- escrow dang giu
- tong payout da tra seller
- tong phi san thu duoc

### 4.2. Bo loc theo thoi gian

Dashboard co cac khoang:

- 1 ngay
- 7 ngay
- 30 ngay
- 90 ngay
- 365 ngay

Y nghia:

- giup quan tri vien theo doi su thay doi theo tung giai doan
- phuc vu bao cao van hanh

### 4.3. Moderation report

Admin co the:

- xem report dang cho xu ly
- doc ly do report
- doc bang chung / evidence
- chon cach xu ly

Hanh dong moderation:

- canh bao user
- tam khoa user
- ban user
- bo qua report

### 4.4. Quan ly trust score

Khi admin xu ly report hop le:

- trust score giam
- warning count tang
- risk badge thay doi

Rule hien tai:

- moi lan canh bao hop le tru 5 diem
- du 10 canh bao hop le hoac trust score <= 50 co the tam khoa 7 ngay
- tai pham them 3 lan nua co the bi ban vinh vien

### 4.5. Quan ly nguoi dung

Admin xem duoc:

- email
- role
- trust score
- warning count
- risk badge
- status

Tu do co the:

- canh bao
- tam khoa
- ban
- mo lai tai khoan neu can

### 4.6. Moderation dien dan

Admin co the:

- an bai viet
- hien lai bai viet
- ghim hoac bo ghim bai viet

Tinh nang nay giup kiem soat noi dung khong phu hop tren cong dong hoc tap.

## 5. Thiet ke du lieu lien quan

Module admin su dung du lieu tu:

- `Users`
- `Products`
- `Orders`
- `PaymentTransactions`
- `OrderFees`
- `Reports`
- `Posts`
- `Comments`

Mot so cot phu tro moderation:

- `Users.WarningCount`
- `Users.TrustScore`
- `Users.RiskBadge`
- `Users.LifetimeStrikeCount`
- `Users.SuspendedUntil`
- `Reports.EvidenceSummary`
- `Reports.ResolutionAction`
- `Reports.AdminNote`

## 6. Luong xu ly report moderation

```text
Buyer gui report
    ->
Report duoc luu vao DB voi Status = Pending
    ->
Admin mo panel moderation
    ->
Admin doc report va bang chung
    ->
Admin chon canh bao / tam khoa / ban / bo qua
    ->
System cap nhat report, user status, trust score, warning count
    ->
Buyer ve sau thay trust badge cua seller thay doi
```

## 7. Kiem thu module

### 7.1. UAT de xuat

#### TC-ADMIN-01 Dang nhap admin

- Dang nhap `admin@educart.local / password123`
- Mo `/admin`
- Mong doi: vao duoc dashboard

#### TC-ADMIN-02 Xem dashboard theo thoi gian

- Chuyen range 1d, 7d, 30d
- Mong doi: snapshot va timeline doi theo range

#### TC-ADMIN-03 Duyet report va canh bao user

- Chon 1 report pending
- Bam `Canh bao user`
- Mong doi:
  - report cap nhat
  - trust score seller giam
  - warning count tang

#### TC-ADMIN-04 Tam khoa user

- Chon user can moderation
- Bam `Tam khoa`
- Mong doi:
  - status user = Suspended
  - co `SuspendedUntil`

#### TC-ADMIN-05 Ban user

- Bam `Ban user`
- Mong doi:
  - status user = Banned
  - risk badge chuyen sang trang thai nguy co cao

#### TC-ADMIN-06 Moderation bai viet forum

- An 1 bai viet
- Mong doi:
  - bai viet khong con hien cong khai

## 8. Uu diem cua module

- tang tinh thuc te cua do an
- the hien nhom hieu nghiep vu van hanh san TMDT
- co moderation, trust score va risk governance
- co dashboard de demo KPI ro rang
- lien ket tot voi report scam va escrow

## 9. Han che hien tai

- chua tach thanh cac tab rieng biet nhu Users, Orders, Finance, Reports o muc UI sau
- mot so bieu do dang o muc snapshot/timeline don gian
- chua co export file bao cao
- chua co cron tu dong mo khoa user sau 7 ngay, hien tai luu moc thoi gian trong DB

## 10. Ket luan

Admin Panel cua EduCart da duoc hien thuc nhu mot module quan tri noi bo dung nghia, bao gom dashboard van hanh, moderation report, trust score governance va kiem soat noi dung dien dan. Day la mot phan bonus gia tri cao vi chung minh he thong khong chi phuc vu nguoi dung cuoi ma con co nang luc van hanh nhu mot san TMDT thuc te.
