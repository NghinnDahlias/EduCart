# UAT va Automation Testcases EduCart

## 1. Muc dich

Tai lieu nay duoc dung de:

- kiem thu UAT voi giao vien
- doi chieu voi ban hien thuc moi nhat
- chuan bi kich ban quay video
- kiem tra nhanh truoc khi demo

## 2. Automation hien co

Backend da co cac file test:

- `be/src/tests/auth.service.test.js`
- `be/src/tests/product.service.test.js`
- `be/src/tests/order.service.test.js`
- `be/src/tests/payment.service.test.js`

Pham vi:

- auth va password migration
- tao/cap nhat san pham
- don mua, don thue, state transition
- payment sandbox va simulate flow

## 3. Smoke test truoc khi demo

1. `GET /api/health` tra `ok = true`
2. frontend mo duoc `http://localhost:3000`
3. dang nhap duoc bang `buyer@educart.local / password123`
4. `/products` co du lieu
5. `/forum` co bai viet
6. `/admin` mo duoc bang `admin@educart.local / password123`
7. chatbot AI mo duoc o goc phai duoi

## 4. Tai khoan demo

- `admin@educart.local / password123`
- `buyer@educart.local / password123`
- `seller@educart.local / password123`
- `hoangnam@educart.local / password123`

## 5. UAT theo module

### UAT-AUTH-01 Dang nhap thanh cong

- Buoc:
  1. vao `/login`
  2. nhap `buyer@educart.local / password123`
  3. bam dang nhap
- Mong doi:
  - vao duoc trang chu
  - co `educart_token` trong localStorage

### UAT-AUTH-02 Dang ky tai khoan moi

- Buoc:
  1. vao `/register`
  2. nhap day du thong tin
  3. chon truong/khoa
  4. gui form
- Mong doi:
  - tao user moi thanh cong
  - user moi duoc luu trong `Users`

### UAT-PROD-01 Xem danh sach san pham

- Buoc:
  1. vao `/products`
- Mong doi:
  - co san pham mua
  - co san pham cho thue
  - co tai lieu so

### UAT-PROD-02 Loc san pham cho thue

- Buoc:
  1. chon filter thue
- Mong doi:
  - chi con listing `IsForRent = true`

### UAT-PROD-03 Xem chi tiet san pham va trust signal

- Buoc:
  1. mo mot san pham
- Mong doi:
  - thay thong tin seller
  - thay trust score / risk badge
  - co nut report

### UAT-PROD-04 Dang san pham moi

- Tien dieu kien: da dang nhap
- Buoc:
  1. vao `/post-product`
  2. nhap ten, mo ta, gia, chon loai
  3. upload anh
  4. chon thong tin giao hang
  5. dang bai
- Mong doi:
  - san pham xuat hien trong danh sach
  - co du lieu trong `Products` va `ProductImages`

### UAT-CART-01 Them vao gio va xoa khoi gio

- Buoc:
  1. them 1 san pham vao gio
  2. vao `/cart`
  3. xoa san pham
- Mong doi:
  - them/xoa thanh cong
  - `CartItems` cap nhat dung

### UAT-CHECKOUT-01 Hien dia chi mac dinh

- Tien dieu kien: profile da co dia chi
- Buoc:
  1. vao `/checkout`
- Mong doi:
  - hien san dia chi mac dinh
  - co the chon nhap tay dia chi khac

### UAT-CHECKOUT-02 Tinh phi ship

- Buoc:
  1. checkout voi direct pickup
  2. checkout voi online payment hoac COD
- Mong doi:
  - direct pickup ship = 0
  - online/COD ship = 10.000d
  - tong tien va tam tinh hien dung

### UAT-PAY-01 Tao don va thanh toan thanh cong

- Buoc:
  1. checkout
  2. chon `MoMo Sandbox` hoac `VNPay Sandbox`
  3. vao `/payment-gateway`
  4. bam `Mo phong thanh toan thanh cong`
- Mong doi:
  - sang trang thanh toan thanh cong
  - co 2 nut:
    - xem chi tiet don hang
    - tiep tuc mua sam

### UAT-PAY-02 Thanh toan that bai

- Buoc:
  1. tao don moi
  2. bam `Mo phong thanh toan that bai`
- Mong doi:
  - don van ton tai o `PendingPayment`
  - co the thanh toan lai trong 2 gio
  - san pham chua quay lai catalog cong khai

### UAT-PAY-03 Kiem tra escrow

- Cach doi chieu:
  1. tao don va thanh toan thanh cong
  2. chua complete don
  3. vao admin dashboard
- Mong doi:
  - seller chua nhan payout ngay
  - admin thay so lieu escrow dang giu

### UAT-ORDER-01 San pham stock = 1 bien khoi catalog sau khi tao don

- Buoc:
  1. buyer A tao don cho san pham stock 1
  2. quay lai `/products`
- Mong doi:
  - san pham bien mat khoi catalog public

### UAT-ORDER-02 Nguoi mua theo doi va thanh toan lai

- Buoc:
  1. tao don that bai thanh toan
  2. vao `/orders`
  3. mo chi tiet don
- Mong doi:
  - thay nut thanh toan lai trong 2 gio
  - thay nut huy don neu seller chua gui van chuyen

### UAT-ORDER-03 Luong seller

- Dang nhap seller
- Buoc:
  1. vao `/orders`
  2. mo mot don ban
  3. xac nhan:
     - da nhan don
     - da chuyen cho chuyen phat
     - xac nhan da giao hang
- Mong doi:
  - seller chi thay cac thao tac ben ban

### UAT-ORDER-04 Luong buyer sau khi giao hang

- Buoc:
  1. buyer vao chi tiet don da giao
  2. bam `Xac nhan don hang`
- Mong doi:
  - chuyen sang review
  - buyer co the danh gia

### UAT-PROFILE-01 Cap nhat thong tin va dia chi

- Buoc:
  1. vao `/profile`
  2. sua thong tin ca nhan
  3. cap nhat dia chi
- Mong doi:
  - thong tin cu khong bi mat
  - dia chi luu dung

### UAT-PROFILE-02 Coins va diem danh

- Buoc:
  1. vao `/profile`
  2. bam diem danh
  3. tao 1 don da thanh toan
- Mong doi:
  - coins tang khi diem danh
  - coins tang theo quy tac `1.000d = 1 coin`

### UAT-PROFILE-03 Notifications dong

- Buoc:
  1. tao 1 don `PendingPayment`
  2. seller nhan don
  3. seller danh dau da chuyen phat
- Mong doi:
  - profile / notifications co nhac thanh toan
  - co thong bao seller da nhan don
  - co thong bao dang giao

### UAT-FORUM-01 Xem va tao bai viet

- Buoc:
  1. vao `/forum`
  2. xem bai seed
  3. tao bai moi
- Mong doi:
  - bai moi xuat hien
  - du lieu luu vao `Posts`

### UAT-FORUM-02 Binh luan va vote

- Buoc:
  1. mo chi tiet bai
  2. comment
  3. vote
- Mong doi:
  - comment xuat hien
  - vote count thay doi

### UAT-CHAT-01 Nhan tin buyer-seller

- Buoc:
  1. vao `/chat`
  2. gui tin nhan
- Mong doi:
  - tin nhan hien tren UI
  - co du lieu trong `Messages`

### UAT-REPORT-01 Gui report

- Buoc:
  1. vao chi tiet seller hoac product
  2. mo form report
  3. nhap ly do va bang chung
  4. gui report
- Mong doi:
  - tao report thanh cong
  - du lieu luu trong `Reports`

### UAT-ADMIN-01 Dang nhap admin va mo dashboard

- Buoc:
  1. dang nhap `admin@educart.local`
  2. vao `/admin`
- Mong doi:
  - thay dashboard
  - thay thong ke user, product, order, report

### UAT-ADMIN-02 Moderation report

- Buoc:
  1. admin mo report queue
  2. chon `Canh bao user`
- Mong doi:
  - report duoc update
  - trust score seller giam
  - warning count tang

### UAT-ADMIN-03 Theo doi trust score

- Buoc:
  1. canh bao cung 1 seller nhieu lan
- Mong doi:
  - moi lan canh bao tru 5 diem
  - du 10 canh bao thi tam khoa 7 ngay
  - tai pham 3 lan nua co the ban vinh vien

### UAT-AI-01 Chatbot chao hoi

- Buoc:
  1. mo chatbot o goc phai duoi
  2. nhap `xin chao`
- Mong doi:
  - bot tu gioi thieu cac kha nang ho tro

### UAT-AI-02 Chatbot tra cuu don

- Tien dieu kien: user co don
- Buoc:
  1. hoi `don hang cua toi dang o dau`
- Mong doi:
  - bot tra ve don gan nhat va trang thai

### UAT-AI-03 Chatbot goi y san pham

- Buoc:
  1. hoi `goi y giao trinh giai tich 1`
- Mong doi:
  - bot tra ve suggestions
  - bam vao suggestions mo duoc trang san pham

### UAT-AI-04 Chatbot chinh sach trust score

- Buoc:
  1. hoi `trust score duoc tinh nhu the nao`
- Mong doi:
  - bot tra loi dung policy canh bao / tam khoa / ban

### UAT-SEO-01 Kiem tra metadata

- Buoc:
  1. mo `/products`, `/forum`, `/khung-phap-ly`
  2. inspect title va meta description
- Mong doi:
  - co metadata

### UAT-SEO-02 Kiem tra robots va sitemap

- Buoc:
  1. mo `/robots.txt`
  2. mo `/sitemap.xml`
- Mong doi:
  - route tra ve du lieu hop le

## 6. Checklist DB doi chieu khi demo

Sau khi demo, co the doi chieu:

- `Users`
- `Products`
- `ProductImages`
- `Orders`
- `OrderItems`
- `PaymentTransactions`
- `OrderFees`
- `Messages`
- `Posts`
- `Comments`
- `Reviews`
- `Reports`

## 7. Kich ban quay video khuyen nghi

1. dang nhap buyer
2. xem san pham va trust seller
3. them vao gio, checkout, simulate payment
4. vao orders theo doi don
5. dang nhap seller xu ly giao hang
6. buyer xac nhan nhan hang va review
7. gui report seller
8. dang nhap admin duyet report va xem dashboard
9. mo chatbot AI hoi ve don hang va trust score
10. mo `/robots.txt` va `/sitemap.xml`
11. mo SQL Server/API de doi chieu du lieu da luu

## 8. Ghi chu trung thuc

- neu chatbot hien `tam thoi bi loi`, can rebuild backend de mount route `/api/ai/chat`
- neu build frontend bao dang co `next build` khac dang chay, can dung process cu truoc khi build lai
- mot so text cu van con can dọn encoding, nhung khong anh huong nghiep vu chinh
