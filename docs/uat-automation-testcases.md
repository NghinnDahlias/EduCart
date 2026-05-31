# UAT va Automation Testcases EduCart

## 1. Pham vi kiem thu

Tai lieu nay dung cho:

- Kiem thu demo voi giao vien
- Kiem thu UAT theo luong nguoi dung cuoi
- Kiem tra nhanh truoc khi quay video
- Doi chieu voi cac unit test backend hien co

## 2. Automation hien co

Backend da co cac file test:

- `be/src/tests/auth.service.test.js`
- `be/src/tests/product.service.test.js`
- `be/src/tests/order.service.test.js`
- `be/src/tests/payment.service.test.js`

Muc dich:

- `auth`: dang ky, dang nhap, duplicate email, account status, migration plaintext -> bcrypt
- `product`: validate so luong anh, tao san pham, lay chi tiet
- `order`: tao don mua/thuê, transition state
- `payment`: initiate payment, webhook success/fail

Luu y:

- Nhom `order.service` hien can dong bo lai ky vong test voi business rule thuc te truoc khi coi la "green suite" hoan chinh.

## 3. Checklist smoke test truoc khi demo

1. Backend `http://localhost:5000/api/health` tra `ok=true`
2. Frontend mo duoc `http://localhost:3000`
3. Dang nhap duoc bang tai khoan seed:
   - `buyer@educart.local / password123`
4. Trang san pham hien ra danh sach
5. Trang dien dan hien ra 5 bai viet seed
6. DB da co du lieu san pham cho thuê

## 4. UAT chi tiet

### TC-AUTH-01 Dang nhap thanh cong

- Muc tieu: Xac nhan dang nhap hoat dong
- Tien dieu kien: backend + frontend dang chay
- Du lieu: `buyer@educart.local / password123`
- Buoc thuc hien:
  1. Mo trang `/login`
  2. Nhap email va mat khau
  3. Bam dang nhap
- Ket qua mong doi:
  - Dang nhap thanh cong
  - Chuyen ve trang chu
  - `educart_token` duoc tao trong localStorage

### TC-AUTH-02 Dang ky tai khoan moi

- Muc tieu: Kiem tra tao user moi va luu DB
- Buoc thuc hien:
  1. Mo `/register`
  2. Nhap day du thong tin
  3. Chon truong
  4. Xac nhan dang ky
- Ket qua mong doi:
  - API tra `201`
  - User moi duoc tao trong bang `Users`
  - Co ban ghi lien ket trong `UserUniversity`

### TC-AUTH-03 Dang nhap sai mat khau

- Buoc:
  1. Vao `/login`
  2. Nhap sai mat khau
- Ket qua mong doi:
  - Hien thong bao loi
  - Khong tao token

### TC-PROD-01 Xem danh sach san pham

- Muc tieu: Kiem tra trang `/products`
- Buoc:
  1. Mo trang danh sach san pham
  2. Cuon danh sach
- Ket qua mong doi:
  - Hien du lieu
  - Co san pham ban va cho thuê
  - Co san pham tai lieu so

### TC-PROD-02 Loc san pham cho thuê

- Buoc:
  1. Mo `/products`
  2. Chon filter "thuê"
- Ket qua mong doi:
  - Chi con san pham `IsForRent = true`
  - Thay cac listing nhu Casio, giao trinh, tai khoan khoa hoc

### TC-PROD-03 Loc theo truong/khoa/mon hoc

- Buoc:
  1. Chon university
  2. Chon faculty
  3. Chon subject
  4. Bam cap nhat
- Ket qua mong doi:
  - Danh sach san pham thay doi theo bo loc

### TC-PROD-04 Xem chi tiet san pham

- Buoc:
  1. Chon 1 san pham bat ky
  2. Mo trang chi tiet
- Ket qua mong doi:
  - Hien title, mo ta, gia, hinh anh, seller, review

### TC-PROD-05 Dang san pham moi

- Tien dieu kien: da dang nhap
- Buoc:
  1. Vao `/post-product`
  2. Nhap thong tin san pham
  3. Chon type mua/thuê
  4. Upload anh
  5. Bam dang
- Ket qua mong doi:
  - San pham moi xuat hien trong `/products`
  - Co du lieu trong bang `Products`
  - Anh co trong `ProductImages`

### TC-CART-01 Them san pham vao gio hang

- Buoc:
  1. Vao chi tiet san pham
  2. Bam them vao gio
  3. Mo `/cart`
- Ket qua mong doi:
  - San pham xuat hien trong gio
  - Co ban ghi trong `CartItems`

### TC-CART-02 Xoa san pham khoi gio

- Buoc:
  1. Vao `/cart`
  2. Bam xoa
- Ket qua mong doi:
  - San pham bien mat khoi gio
  - Ban ghi `CartItems` bi xoa

### TC-ORDER-01 Tao don mua

- Buoc:
  1. Chon san pham mua
  2. Them gio
  3. Checkout
- Ket qua mong doi:
  - Tao `Orders`
  - Tao `OrderItems`
  - Don xuat hien trong `/orders`

### TC-ORDER-02 Tao don thuê

- Buoc:
  1. Chon san pham cho thuê
  2. Them gio
  3. Checkout
- Ket qua mong doi:
  - Don `OrderType = Rent`
  - Tong tien co tinh thanh phan coc/thue

### TC-ORDER-03 Xem timeline don hang

- Buoc:
  1. Mo `/orders`
  2. Xem mot don co san
- Ket qua mong doi:
  - Hien timeline theo `LifecycleState`
  - Don thuê co cac moc khac don mua

### TC-ORDER-04 Huy don

- Tien dieu kien: don dang o `PendingPayment` hoac `Paid`
- Buoc:
  1. Vao `/orders`
  2. Bam huy don
- Ket qua mong doi:
  - Trang thai don thay doi
  - UI cap nhat sau refresh

### TC-MSG-01 Nhan tin nguoi ban

- Buoc:
  1. Tu trang don hang hoac seller, mo chat
  2. Gui 1 tin nhan
- Ket qua mong doi:
  - Tin nhan xuat hien trong UI
  - Co du lieu trong bang `Messages`

### TC-REVIEW-01 Gui danh gia sau giao dich

- Tien dieu kien: co don da hoan thanh
- Buoc:
  1. Vao trang review
  2. Chon so sao va noi dung
  3. Gui danh gia
- Ket qua mong doi:
  - Co ban ghi trong `Reviews`
  - Rating san pham/nguoi ban duoc cap nhat neu co trigger/logic lien quan

### TC-FORUM-01 Xem danh sach bai viet dien dan

- Buoc:
  1. Mo `/forum`
- Ket qua mong doi:
  - Hien 5 bai viet seed
  - Co bai ve tai lieu so, hoi bai, hoi mon hoc

### TC-FORUM-02 Tim kiem bai viet

- Buoc:
  1. Tim voi tu khoa `React` hoac `Giải tích`
- Ket qua mong doi:
  - Danh sach bai viet loc dung

### TC-FORUM-03 Tao bai viet moi

- Tien dieu kien: da dang nhap
- Buoc:
  1. Vao `/forum/create`
  2. Nhap title, content, tags
  3. Dang bai
- Ket qua mong doi:
  - Bai moi xuat hien trong `/forum`
  - Co ban ghi trong `Posts`

### TC-FORUM-04 Binh luan bai viet

- Buoc:
  1. Mo chi tiet 1 bai viet
  2. Nhap comment
  3. Gui comment
- Ket qua mong doi:
  - Comment xuat hien tren UI
  - Co ban ghi trong `Comments`
  - `CommentsCount` cua `Posts` tang len

### TC-FORUM-05 Vote bai viet

- Buoc:
  1. Mo chi tiet bai viet
  2. Upvote/downvote
- Ket qua mong doi:
  - Vote count thay doi tren UI

### TC-REPORT-01 Bao cao nguoi ban

- Buoc:
  1. Vao chi tiet san pham
  2. Mo form report
  3. Gui noi dung bao cao
- Ket qua mong doi:
  - Co request thanh cong
  - Co ban ghi trong `Reports`

## 5. Kich ban demo de quay video

### Kich ban ngan gon, an toan

1. Mo `/login` va dang nhap bang `buyer@educart.local`
2. Mo `/products`
3. Loc san pham cho thuê
4. Mo 1 listing thuê moi seed
5. Them vao gio hang
6. Mo `/cart`
7. Mo `/orders` de xem don seed
8. Mo `/forum`
9. Xem 5 bai viet seed
10. Tao 1 bai moi
11. Comment vao 1 bai co san
12. Mo SQL Server hoac goi API de chung minh du lieu da duoc luu

### Kich ban day du hon

1. Dang ky tai khoan moi
2. Dang nhap bang tai khoan moi
3. Dang san pham tai lieu so
4. Them san pham vao gio
5. Tao don
6. Vao profile sua thong tin
7. Vao forum tao bai hoi bai
8. Dang xuat

## 6. Du lieu demo khuyen nghi

Tai khoan seed:

- `buyer@educart.local / password123`
- `seller@educart.local / password123`
- `hoangnam@educart.local / password123`
- `minhanh@educart.local / password123`
- `khoa@educart.local / password123`
- `phuonglinh@educart.local / password123`

Du lieu moi bo sung de demo:

- San pham cho thuê:
  - giao trinh thuat toan
  - may tinh Casio
  - tai khoan khoa hoc React
- San pham tai lieu so:
  - note Giai tich 1
  - slide Kinh te vi mo
  - bo de Dai so tuyen tinh
- Dien dan:
  - 5 bai viet mau co comment

## 7. Van de can note khi demo

- Nen khoi dong backend truoc va kiem tra `/api/health`
- Neu sua `fe/.env`, phai restart frontend
- Nen dung du lieu seed de tranh loi do du lieu rong
- Khong nen demo phan stored procedure nang neu chua doi chieu xong schema hien tai
