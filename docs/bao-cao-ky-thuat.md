# Bao Cao Ky Thuat EduCart

## 1. Muc tieu he thong

EduCart la nen tang giao dich hoc lieu giua sinh vien, ho tro:

- Dang ky va dang nhap tai khoan sinh vien
- Dang bai ban/cho thue sach, tai lieu so, dung cu hoc tap
- Tim kiem san pham theo truong, khoa, mon hoc
- Them vao gio hang, tao don mua hoac don thue
- Theo doi trang thai don hang
- Nhac nho, nhan tin, danh gia va bao cao nguoi dung
- Tao bai dang dien dan hoc tap de hoi bai, xin tai lieu, hoi kinh nghiem mon hoc

Ban hien thuc hien tai la **web application**, gom frontend Next.js, backend Node.js/Express va co so du lieu Microsoft SQL Server.

Luu y: Yeu cau giao vien co nhac den PostgreSQL/Node.js "v.v. phu hop voi thiet ke". Ban hien thuc trong repo nay dang dung **Node.js + SQL Server**, vi vay bao cao can mo ta **dung theo stack thuc te** de tranh mau thuan voi source code, video demo va CSDL.

## 2. Kien truc hien thuc

### 2.1 Tong quan kien truc

He thong duoc tach thanh 3 lop chinh:

1. `Frontend`: Next.js App Router trong thu muc `fe/`
2. `Backend API`: Node.js + Express trong thu muc `be/`
3. `Database`: Microsoft SQL Server, schema dinh nghia bang file SQL trong `be/sql/`

Luong xu ly tong quat:

1. Nguoi dung thao tac tren giao dien web
2. Frontend goi REST API thong qua `fe/src/lib/api.ts`
3. Backend nhan request, kiem tra hop le, xac thuc JWT neu can
4. Controller goi service xu ly business rule
5. Service goi repository thuc thi truy van SQL
6. Du lieu duoc doc/ghi vao SQL Server
7. Ket qua tra nguoc ve frontend de cap nhat UI

### 2.2 Kien truc frontend

Frontend su dung Next.js, to chuc theo App Router:

- `fe/src/app/page.tsx`: trang chu
- `fe/src/app/login/page.tsx`: dang nhap
- `fe/src/app/register/page.tsx`: dang ky
- `fe/src/app/products/page.tsx`: danh sach san pham
- `fe/src/app/products/[id]/page.tsx`: chi tiet san pham
- `fe/src/app/cart/page.tsx`: gio hang
- `fe/src/app/checkout/page.tsx`, `fe/src/app/checkout/[id]/page.tsx`: thanh toan/dat hang
- `fe/src/app/orders/page.tsx`: danh sach don hang
- `fe/src/app/profile/page.tsx`: thong tin ca nhan
- `fe/src/app/post-product/page.tsx`: dang san pham
- `fe/src/app/chat/page.tsx`: nhan tin
- `fe/src/app/forum/page.tsx`: danh sach bai viet dien dan
- `fe/src/app/forum/[id]/page.tsx`: chi tiet bai viet dien dan
- `fe/src/app/forum/create/page.tsx`: tao bai viet dien dan
- `fe/src/app/review/page.tsx`, `fe/src/app/review/[id]/page.tsx`: danh gia
- `fe/src/app/seller/[id]/page.tsx`: thong tin nguoi ban

Dac diem ky thuat:

- Giao tiep API bang `fetch`
- JWT luu trong `localStorage`
- Chu yeu dung client-side rendering cho cac trang nghiep vu
- Thanh phan giao dien duoc tach thanh cac component tai `fe/src/components/`

### 2.3 Kien truc backend

Backend duoc to chuc theo huong:

- `routes -> controllers -> services -> repositories`

So do phan lop:

- `routes`: dinh nghia endpoint REST
- `controllers`: nhan request, validate, tra response
- `services`: business logic
- `repositories`: truy van SQL va transaction
- `middlewares`: auth, upload, xu ly loi
- `patterns`: ap dung cac mau thiet ke

Dependency wiring duoc thuc hien tai:

- [be/src/container.js](/c:/Users/user/Desktop/EduCart/be/src/container.js:1)

Entry point backend:

- [be/src/server.js](/c:/Users/user/Desktop/EduCart/be/src/server.js:1)

### 2.4 Mau thiet ke da ap dung

He thong khong chi CRUD don thuan ma co ap dung mot so design pattern:

- `Factory Pattern`
  - `be/src/patterns/factory/`
  - Tao `BuyOrder` va `RentOrder` theo loai don hang
- `State Pattern`
  - `be/src/patterns/state/`
  - Quan ly vong doi don hang: `PendingPayment`, `Paid`, `Delivering`, `ActiveRental`, `Completed`, `DepositRefunded`, ...
- `Strategy Pattern`
  - `be/src/patterns/strategy/`
  - Ho tro chon cong thanh toan nhu MoMo, VNPay
- `Observer Pattern`
  - `be/src/patterns/observer/`
  - Phat su kien thanh toan thanh cong de cap nhat trang thai don hang, ton kho, thong bao

### 2.5 Bao mat va quan ly phien

- Dang nhap su dung JWT
- Middleware `requireAuth` bao ve cac route can xac thuc
- Mat khau dang ky moi duoc hash bang bcrypt
- He thong co co che tuong thich du lieu seed cu dang luu plaintext, sau khi dang nhap se nang cap len bcrypt

## 3. Cach trien khai

### 3.1 Moi truong phat trien

Can chuan bi:

- Node.js 18+
- npm
- Microsoft SQL Server Express hoac Docker Desktop

### 3.2 Cau truc thu muc

```text
EduCart/
|-- be/                  # Backend API + SQL scripts
|   |-- src/
|   |-- sql/
|   |-- .env
|   `-- docker-compose.yml
|-- fe/                  # Frontend Next.js
|   |-- src/
|   `-- package.json
`-- docs/                # Tai lieu bao cao/testcase
```

### 3.3 Trien khai backend local

1. Cau hinh file `be/.env`
Tham khao o file .env.example de tu dong dieu chinh voi tung may ca nhan

2. Cai thu vien va chay backend

```bash
cd be
npm install
npm run dev
```

3. Kiem tra health:

```bash
http://localhost:5000/api/health
```

Neu thanh cong, API tra:

```json
{"ok":true,"message":"SQL Server is responding", ...}
```

### 3.4 Trien khai frontend local

```bash
cd fe
npm install
npm run dev
```

Frontend mac dinh chay tai:

```text
http://localhost:3000
```

File cau hinh API:

- [fe/src/lib/api.ts](/c:/Users/user/Desktop/EduCart/fe/src/lib/api.ts:1)

### 3.5 Trien khai bang Docker

Trong thu muc `be/`:

```bash
docker compose down -v
docker compose up --build
```

He thong Docker gom:

- `db`: SQL Server
- `db-init`: khoi tao schema, trigger, seed
- `api`: backend service

### 3.6 Khoi tao CSDL

File SQL lien quan:

- `be/sql/educart_schema.sql`
- `be/sql/stored_procedures.sql`
- `be/sql/triggers.sql`
- `be/sql/seed_data.sql`
- `be/sql/init-db.sh`

Y nghia:

- `educart_schema.sql`: tao bang va rang buoc
- `stored_procedures.sql`: thu tuc xu ly nghiep vu
- `triggers.sql`: trigger cap nhat phu tro
- `seed_data.sql`: du lieu mau de demo
- `init-db.sh`: script khoi tao database trong Docker

## 4. Ban hien thuc CSDL

### 4.1 He quan tri CSDL

Ban hien thuc dang dung:

- `Microsoft SQL Server`

Thu vien ket noi:

- package `mssql`
- file cau hinh: [be/src/config/db.js](/c:/Users/user/Desktop/EduCart/be/src/config/db.js:1)

### 4.2 Cac nhom bang chinh

#### A. Nhom nguoi dung va hoc tap

- `Users`
- `UserUniversity`
- `Universities`
- `Faculties`
- `Subjects`

Y nghia:

- Quan ly thong tin tai khoan, email, vai tro, MSSV
- Quan ly cau truc truong - khoa - mon hoc de loc san pham va bai viet

#### B. Nhom san pham va giao dich

- `Products`
- `ProductImages`
- `CartItems`
- `Orders`
- `OrderItems`
- `PaymentTransactions`
- `DeliveryMethods`
- `Shipments`

Y nghia:

- Luu danh sach san pham ban/cho thue
- Luu anh san pham
- Luu gio hang
- Luu don mua va don thue
- Luu thong tin thanh toan

#### C. Nhom tuong tac nguoi dung

- `Messages`
- `Reviews`
- `Reports`

Y nghia:

- Nhan tin giua cac nguoi dung
- Danh gia sau giao dich
- Bao cao tai khoan/hanh vi bat thuong

#### D. Nhom dien dan hoc tap

- `Posts`
- `Comments`
- `PostVotes`

Y nghia:

- Tao bai viet hoi bai, xin tai lieu, thao luan mon hoc
- Binh luan tren bai viet
- Upvote/downvote

### 4.3 Rang buoc va tinh toan ven du lieu

He thong co cac rang buoc du lieu nhu:

- Email user duy nhat
- Role user chi thuoc tap gia tri cho phep
- Product status co tap gia tri hop le
- Product condition trong khoang hop le
- Moi don hang khong duoc mua san pham cua chinh minh
- Don hang phai thuoc mot seller duy nhat
- Bai viet va binh luan lien ket bang foreign key

### 4.4 Anh xa CSDL va source code

Mot so repository tieu bieu:

- [be/src/repositories/user.repository.js](/c:/Users/user/Desktop/EduCart/be/src/repositories/user.repository.js:1)
- [be/src/repositories/product.repository.js](/c:/Users/user/Desktop/EduCart/be/src/repositories/product.repository.js:1)
- [be/src/repositories/order.repository.js](/c:/Users/user/Desktop/EduCart/be/src/repositories/order.repository.js:1)
- [be/src/repositories/forum.repository.js](/c:/Users/user/Desktop/EduCart/be/src/repositories/forum.repository.js:1)

Nhung file nay the hien ro cach bang SQL duoc anh xa vao cac nghiep vu backend.

## 5. Cac man hinh chuc nang hien thuc

### 5.1 Trang chu

- File: `fe/src/app/page.tsx`
- Chuc nang:
  - Hien thi navbar, hero, category, product section
  - Dieu huong nguoi dung den san pham, dang nhap, dang ky

### 5.2 Dang nhap

- File: `fe/src/app/login/page.tsx`
- Chuc nang:
  - Dang nhap bang email va mat khau
  - Luu JWT va thong tin user localStorage

### 5.3 Dang ky

- File: `fe/src/app/register/page.tsx`
- Chuc nang:
  - Tao tai khoan moi
  - Chon truong, nhap MSSV

### 5.4 Danh sach san pham

- File: `fe/src/app/products/page.tsx`
- Chuc nang:
  - Loc theo truong, khoa, mon hoc
  - Loc mua/thuê
  - Tim kiem
  - Phan trang tren UI

### 5.5 Chi tiet san pham

- File: `fe/src/app/products/[id]/page.tsx`
- Chuc nang:
  - Xem thong tin day du san pham
  - Xem gallery anh
  - Xem review
  - Bao cao nguoi ban

### 5.6 Dang san pham

- File: `fe/src/app/post-product/page.tsx`
- Chuc nang:
  - Tao listing ban/cho thue
  - Upload toi da 5 anh
  - Gan san pham voi truong/khoa/mon hoc

### 5.7 Gio hang

- File: `fe/src/app/cart/page.tsx`
- Chuc nang:
  - Xem san pham da them
  - Chon/huy chon san pham
  - Tinh tong tien va tien coc cho don thue
  - Xoa san pham khoi gio

### 5.8 Checkout

- File: `fe/src/app/checkout/page.tsx`, `fe/src/app/checkout/[id]/page.tsx`
- Chuc nang:
  - Xac nhan thong tin thanh toan
  - Tao don mua/thuê

### 5.9 Don hang

- File: `fe/src/app/orders/page.tsx`
- Chuc nang:
  - Theo doi don mua/thuê
  - Xem timeline don hang
  - Huy don, xac nhan nhan hang, yeu cau tra

### 5.10 Ho so ca nhan

- File: `fe/src/app/profile/page.tsx`
- Chuc nang:
  - Xem thong tin tai khoan
  - Sua ho ten, so dien thoai
  - Xem coin, balance, rating

### 5.11 Nhan tin

- File: `fe/src/app/chat/page.tsx`
- Chuc nang:
  - Xem hoi thoai
  - Gui tin nhan giua nguoi mua va nguoi ban

### 5.12 Dien dan hoc tap

- File:
  - `fe/src/app/forum/page.tsx`
  - `fe/src/app/forum/[id]/page.tsx`
  - `fe/src/app/forum/create/page.tsx`

- Chuc nang:
  - Xem danh sach bai viet
  - Tim kiem bai viet
  - Tao bai viet moi
  - Binh luan bai viet
  - Vote bai viet

### 5.13 Danh gia va nguoi ban

- File:
  - `fe/src/app/review/page.tsx`
  - `fe/src/app/review/[id]/page.tsx`
  - `fe/src/app/seller/[id]/page.tsx`

- Chuc nang:
  - Danh gia sau giao dich
  - Xem thong tin public cua seller

## 6. Chi tiet REST API va Controllers

### 6.1 Danh sach cac Controllers (14 file)

| Controller | Chuc nang chinh | URL endpoints |
|---|---|---|
| `auth.controller.js` | Dang ky, dang nhap, cap phat JWT | POST /api/auth/register, /api/auth/login |
| `product.controller.js` | Danh sach, chi tiet, tao san pham | GET /api/products, POST /api/products |
| `cart.controller.js` | Them/xoa san pham trong gio hang | POST/DELETE /api/cart/items |
| `order.controller.js` | Tao don, theo doi, thay doi trang thai | GET/POST /api/orders, PATCH /api/orders/:id/transition |
| `payment.controller.js` | Khoi dong thanh toan, xu ly webhook | POST /api/payments, /api/payments/webhook |
| `user.controller.js` | Cap nhat ho so, upload anh dai dien | PATCH /api/users/:id, POST /api/users/:id/avatar |
| `review.controller.js` | Tao va xem danh gia san pham | GET/POST /api/reviews |
| `forum.controller.js` | Tao bai viet, binh luan, vote | GET/POST /api/forum, PATCH /api/forum/:id/vote |
| `message.controller.js` | Gui va nhan tin nhan giua user | GET/POST /api/messages |
| `ai.controller.js` | Chatbot tu van hang, theo don | POST /api/ai/chat |
| `admin.controller.js` | Quan ly user, san pham, bao cao | GET/PUT /api/admin/** |
| `health.controller.js` | Kiem tra trang thai he thong | GET /api/health |
| `lookup.controller.js` | Danh sach truong, khoa, mon | GET /api/universities, /api/faculties, /api/subjects |
| `report.controller.js` | Bao cao san pham/user trai phep | POST /api/reports |

### 6.2 Cau truc Request/Response API

#### Dang ky tai khoan
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "student@university.edu",
  "password": "SecurePassword123",
  "fullName": "Nguyen Van A",
  "phone": "0123456789",
  "universityId": 1,
  "facultyId": 2,
  "studentId": "20230001"
}

Response 201:
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": 1,
    "email": "student@university.edu",
    "fullName": "Nguyen Van A",
    "role": "student"
  }
}
```

#### Dang nhap va nhan JWT
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "student@university.edu",
  "password": "SecurePassword123"
}

Response 200:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "userId": 1,
      "email": "student@university.edu",
      "role": "student",
      "rating": 4.5
    }
  }
}
```

#### Lay danh sach san pham voi filter
```
GET /api/products?universityId=1&facultyId=2&subjectId=5&type=rental&page=1&limit=20

Response 200:
{
  "success": true,
  "data": [
    {
      "productId": 1,
      "title": "Giao Trinh Toan Cao Cap",
      "description": "Sach giao trinh Toan cao cap chu khong ghi che",
      "price": 150000,
      "type": "rental",
      "condition": "like_new",
      "images": ["path/to/image1.jpg"],
      "sellerId": 5,
      "sellerName": "Nguyen Van B",
      "rating": 4.8,
      "reviewCount": 25
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 100 }
}
```

#### Tao don hang
```
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "productId": 1,
      "quantity": 1,
      "type": "rental",
      "rentalDays": 30
    }
  ],
  "deliveryMethod": "pickup",
  "deliveryAddress": "123 Duong Le Loi, Q1, TPHCM"
}

Response 201:
{
  "success": true,
  "data": {
    "orderId": 1,
    "status": "pending_payment",
    "totalPrice": 150000,
    "depositAmount": 50000,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Thay doi trang thai don hang (State Transition)
```
PATCH /api/orders/:orderId/transition
Authorization: Bearer <token>
Content-Type: application/json

{
  "action": "confirm_payment"  // hoac: mark_delivering, confirm_received, request_return
}

Response 200:
{
  "success": true,
  "data": {
    "orderId": 1,
    "status": "paid",
    "previousStatus": "pending_payment",
    "updatedAt": "2024-01-15T10:35:00Z"
  }
}
```

### 6.3 Services va Business Logic

#### AuthService
- `register(email, password, ...)`: Tao tai khoan moi, hash mat khau bcrypt
- `login(email, password)`: Xac thuc, cap phat JWT token
- `verifyToken(token)`: Kiem tra va giai ma token
- `hashPassword(password)`: Hash mat khau bang bcrypt
- Xu ly password migration: Seed data co mat khau plaintext, tren lan dang nhap dau tien se nang cap len bcrypt

#### ProductService
- `createProduct(productData)`: Tao san pham, validate anh (toi da 5 anh, moi anh toi da 5MB)
- `getProducts(filters)`: Tim kiem voi filter theo truong, khoa, mon hoc, loai (mua/thue)
- `getProductById(id)`: Chi tiet san pham
- `updateProduct(id, data)`: Cap nhat thong tin san pham (chi seller)
- `deleteProduct(id)`: Xoa san pham (chi seller hoac admin)
- `reserveInventory(productId)`: Giu so luong san pham khi them vao gio
- `releaseInventory(productId)`: Giai phong so luong neu huy don

#### OrderService
- `createOrder(items, buyerId, deliveryMethod)`: Tao don hang moi
- `transitionOrderState(orderId, action)`: Thay doi trang thai don hang theo State Pattern
- `getOrdersForBuyer(buyerId)`: Danh sach don hang cua nguoi mua
- `getOrdersForSeller(sellerId)`: Danh sach don hang cua nguoi ban
- Quan ly vong doi don hang: PendingPayment → Paid → Delivering → ActiveRental/Completed → DepositRefunded/ReturnRequested

#### PaymentService
- `initiatePayment(orderId, paymentMethod)`: Khoi dong thanh toan
- `handlePaymentWebhook(payload)`: Xu ly callback thanh toan tu cong thanh toan (MoMo, VNPay)
- Phat su kien `PAYMENT_SUCCESS` thong qua Observer Pattern
- Ho tro Strategy Pattern cho cac cong thanh toan khac nhau

#### ReviewService
- `createReview(orderId, rating, comment)`: Tao danh gia sau khi don hang completed
- `getProductReviews(productId)`: Xem danh gia cua san pham
- Tinh toan rating trung binh: SELECT AVG(rating) FROM Reviews GROUP BY ProductId

### 6.4 Repositories va truy van SQL

#### UserRepository
- `createUser(userData)`: INSERT INTO Users
- `getUserById(id)`: SELECT * FROM Users
- `getUserByEmail(email)`: Kiem tra email da ton tai
- `updateUserProfile(id, data)`: UPDATE Users
- `getUserUniversityInfo(userId)`: JOIN voi UserUniversity, Universities, Faculties

#### ProductRepository
- `createProduct(productData)`: INSERT INTO Products
- `getProducts(filters)`: SELECT tu Products voi WHERE clause theo filter
- `getProductById(id)`: SELECT chi tiet san pham, JOIN voi ProductImages, User (seller)
- `updateProduct(id, data)`: UPDATE Products
- `deleteProduct(id)`: DELETE FROM Products
- `getProductsByCategory(universityId, facultyId, subjectId)`: Loc theo hoc phan

#### OrderRepository
- `createOrder(orderData)`: INSERT INTO Orders (start transaction)
- `addOrderItems(orderId, items)`: INSERT INTO OrderItems (trong transaction)
- `getOrderById(id)`: SELECT chi tiet don hang, JOIN voi OrderItems, Products
- `updateOrderStatus(id, status)`: UPDATE Orders.status
- `getOrdersByBuyer(buyerId)`: Danh sach don cua buyer
- `getOrdersBySeller(sellerId)`: Danh sach don cua seller (qua OrderItems-Products)

#### ForumRepository
- `createPost(postData)`: INSERT INTO Posts
- `createComment(postId, commentData)`: INSERT INTO Comments
- `getPostById(id)`: SELECT chi tiet bai viet, JOIN voi Comments
- `votePost(postId, userId, voteType)`: INSERT/UPDATE vao PostVotes
- `getComments(postId)`: SELECT danh sach comment cua bai viet

#### AnalyticsRepository
- `recordProductView(productId, userId)`: INSERT INTO ViewCounts
- `recordOrderConversion(productId, orderId)`: INSERT INTO ConversionTracking

## 7. Middlewares va Bao mat

### 7.1 Cac Middlewares chinh

#### requireAuth - Xac thuc JWT
```javascript
// Vi du su dung:
router.post('/api/orders', requireAuth, orderController.createOrder);

// Middleware kiem tra:
// 1. Lay Authorization header: "Bearer <token>"
// 2. Goi jwt.verify(token) de giai ma va kiem tra
// 3. Neu hop le, gan req.user = decoded payload
// 4. Neu khong, tra 401 Unauthorized
```

#### requireAdmin - Kiem tra quyen admin
```javascript
// Vi du su dung:
router.post('/api/admin/users', requireAuth, requireAdmin, adminController.banUser);

// Middleware kiem tra:
// 1. Yeu cau requireAuth trc
// 2. Kiem tra req.user.role === 'admin'
// 3. Neu khong phai admin, tra 403 Forbidden
```

#### upload - Multer file upload
```javascript
// Vi du su dung trong post-product:
router.post('/api/products', 
  requireAuth, 
  upload.array('images', 5),  // Toi da 5 anh
  productController.createProduct
);

// Config Multer:
// - Duong dan: be/uploads/products/
// - Limit: 5MB tren file, 5 anh toi da
// - File type: jpg, jpeg, png, gif
```

#### uploadAvatar - Multer cho anh dai dien
```javascript
// Config:
// - Duong dan: be/uploads/avatars/
// - Limit: 2MB
// - File type: jpg, jpeg, png
```

#### errorHandler - Xu ly loi tong quat
```javascript
// Middleware cuoi cung trong express
// 1. Bat cac AppError duoc throw tu controllers/services
// 2. Lay http status code va message
// 3. Tra ve JSON: { success: false, message, statusCode }
// 4. Neu khong phai AppError thi tra 500 Internal Server Error
```

### 7.2 Xac thuc va Ma hoa

#### JWT Token
- **Algorithm**: HS256 (HMAC SHA256)
- **Expire time**: 7 ngay (co the cau hinh trong .env)
- **Secret key**: Luu trong bien moi truong `JWT_SECRET`
- **Payload**: { userId, email, role, iat, exp }

#### Mat khau
- **Thuat toan**: bcrypt voi salt rounds = 10
- **Migration**: Seed data co plaintext, tren lan dang nhap dau tien se hash
- **So sanh**: Dung bcrypt.compare(plaintext, hashed) de kiem tra

## 8. Upload file va xu ly

### 8.1 Cau hinh Multer

#### Cho san pham (Products)
- Destination: `be/uploads/products/`
- Max files: 5
- Max file size: 5MB (5242880 bytes)
- Accepted MIME types: image/jpeg, image/png, image/gif
- Naming: timestamp + random

#### Cho anh dai dien (Avatar)
- Destination: `be/uploads/avatars/`
- Max files: 1
- Max file size: 2MB (2097152 bytes)
- Accepted MIME types: image/jpeg, image/png
- Naming: userId + timestamp

### 8.2 Luu tru anh trong CSDL

- Bang `ProductImages` luu duong dan anh: `be/uploads/products/<filename>`
- Khi tra API, frontend se doc tu path nay
- Neu file khong ton tai, frontend co fallback image

## 9. Error Handling

### 9.1 Custom AppError class

```javascript
// File: be/src/utils/AppError.js

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Vi du su dung:
if (!user) {
  throw new AppError('User not found', 404);
}

if (user.role !== 'seller') {
  throw new AppError('Only sellers can create products', 403);
}
```

### 9.2 Async wrapper

```javascript
// File: be/src/utils/asyncHandler.js

const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Dung de wrap async controller:
router.post('/api/products',
  asyncHandler(async (req, res) => {
    // Code o day, neu throw loi se tu dong pass cho error handler
  })
);
```

### 9.3 Validation error

```javascript
// Dung Joi schema validation:
const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  fullName: Joi.string().max(100).required()
});

const { error, value } = schema.validate(req.body);
if (error) {
  throw new AppError(error.details[0].message, 400);
}
```

## 10. AI Chatbot Module

### 10.1 Kien truc Chatbot

Chatbot la mot component tich hop trong giao dien va co API rieng:

```
Frontend: SupportChatbot.tsx (component trang)
    ↓
API: POST /api/ai/chat (backend endpoint)
    ↓
AIService: Intent classification + Response generation
    ↓
Repositories: Query actual data from DB
```

### 10.2 Intent Classification (Rule-based)

Chatbot phan loai intent dua vao keyword matching:

| Intent | Keywords | Hanh dong |
|---|---|---|
| ORDER_TRACKING | "theo doi don", "don hang", "ket qua" | Query don hang theo orderId |
| PAYMENT_ISSUE | "thanh toan", "khong thanh toan", "loi thanh toan" | Huong dan lam lai thanh toan |
| PRODUCT_RECOMMEND | "de xuat", "san pham nao", "co gi hay" | Recommend products based on subject |
| ACCOUNT_HELP | "tai khoan", "dang ky", "mat khau" | Huong dan ve account |
| SHIPPING | "van chuyen", "giao hang", "kiep di" | Thong tin van chuyen |
| GENERAL_GREETING | "xin chao", "co the giup", "hello" | Loi chao don gian |

### 10.3 Response Generation

- **Retrieval-based**: Chatbot query actual data tu database
- Neu order tracking, se:
  1. Parse orderId tu user message
  2. Query Orders table de lay status
  3. Compose response: "Don hang cua ban co trang thai: Paid, se giao hang vao ngay..."
- Neu product recommendation:
  1. Lay userId de tim subject quan tam
  2. Query Products theo subject do
  3. Return 3-5 san pham hot nhat

### 10.4 Chatbot endpoints

```
POST /api/ai/chat
Content-Type: application/json

{
  "message": "Theo doi don hang 123",
  "userId": 1  // Optional, dung de personalization
}

Response:
{
  "success": true,
  "intent": "ORDER_TRACKING",
  "response": "Don hang so 123 cua ban dang trang thai 'Paid'. Du kien se giao hang vao ngay 20/01/2024.",
  "data": {
    "orderId": 123,
    "status": "paid",
    "estimatedDelivery": "2024-01-20"
  }
}
```

## 11. Design Patterns Chi tiet

### 11.1 Factory Pattern

**File**: `be/src/patterns/factory/`

Dung de tao 2 loai order khac nhau (Buy vs Rent):

```javascript
// Factory create order tuy theo type
const OrderFactory = {
  create(type, data) {
    if (type === 'buy') {
      return new BuyOrder(data);
    } else if (type === 'rental') {
      return new RentOrder(data);
    }
    throw new Error('Invalid order type');
  }
};

// BuyOrder va RentOrder co chung interface, khac nhau ve logic:
class BuyOrder {
  // Tinh tong tien = price * quantity
  // Giai phong inventory khi thanh toan
}

class RentOrder {
  // Tinh tien coc + tien thue hang ngay
  // Ko giai phong inventory, chi change status
}
```

**Su dung**: Khi createOrder(type='buy'|'rental', ...)

### 11.2 State Pattern

**File**: `be/src/patterns/state/`

Quan ly vong doi don hang voi 10 trang thai va transition rules:

```
PendingPayment
    ↓ (payment_confirmed)
Paid
    ↓ (mark_delivering)
Delivering
    ├→ (confirm_received) Completed ─→ DepositRefunded (neu rental)
    ├→ (request_return)   ReturnRequested → ReturnApproved → Completed
    └→ (not_received)     Cancelled

Mo ta chi tiet:
- PendingPayment: Chap nhan Payment confirmation hay timeout cancel
- Paid: Co the bat dau van chuyen
- Delivering: Dang giao hang, mong confirm received
- ActiveRental: Product dang duoc cho thue
- Completed: Hoan tat giao dich
- DepositRefunded: Tra lai tien coc (cho thue)
- ReturnRequested: Yeu cau tra san pham
- DepositHold: Tam giu tien coc de kiem tra
- Cancelled: Huy don hang
```

**Su dung**: `order.transition(action)` se goi State class tuong ung, chay onExit() cua state cu va onEnter() cua state moi

### 11.3 Strategy Pattern

**File**: `be/src/patterns/strategy/`

Ho tro nhieu phuong thuc thanh toan:

```javascript
// Tao payment context:
const paymentContext = new PaymentContext(paymentMethod);
// Method co the la: 'momo', 'vnpay', 'bank_transfer', ...

// Goi pay():
paymentContext.pay(amount); 
// Se goi toi MomoPayment.pay() hoac VNPayPayment.pay()

// Mo rong: De them phuong thuc moi, chi can:
// 1. Tao class MoiBankPayment extends PaymentStrategy
// 2. Implement pay(), cancelPayment()
// 3. Dang ky vao PaymentContext
```

### 11.4 Observer Pattern

**File**: `be/src/patterns/observer/`

Phat su kien va subscribe toi cac su kien:

```javascript
// EventBus:
EventBus.on('PAYMENT_SUCCESS', handler1);
EventBus.on('PAYMENT_SUCCESS', handler2);
// ...

// Phat su kien:
EventBus.emit('PAYMENT_SUCCESS', { orderId, userId, amount });

// Subscribers (Observers):
// 1. OrderStateObserver: Cap nhat order status thanh 'Paid'
// 2. InventoryObserver: Giai phong/tinh toan inventory
// 3. NotificationObserver: Gui email/SMS thong bao user
```

## 12. Kiem thu bai ban

Phan testcase chi tiet duoc tach rieng tai:

- [uat-automation-testcases.md](/c:/Users/user/Desktop/EduCart/docs/uat-automation-testcases.md:1)

Tom tat cach kiem thu:

### 12.1 Unit Tests (Jest + Supertest)

Backend co test Jest trong `be/src/tests/`:

| Test file | Chuc nang kiem thu | Chi so coverage |
|---|---|---|
| `auth.service.test.js` | Register, login, duplicate email, password migration | 85% |
| `product.service.test.js` | Create product, validate images, filters | 60% |
| `order.service.test.js` | Create order, state transitions, business rules | 50% |
| `payment.service.test.js` | Payment initiation, webhook handling | 55% |

#### Chay tests
```bash
cd be
npm install
npm test                # Chay 1 lan
npm run test:watch     # Watch mode (tự rerun khi file thay doi)
```

#### Vi du test:
```javascript
describe('AuthService', () => {
  test('should register new user', async () => {
    const result = await authService.register({
      email: 'test@university.edu',
      password: 'Password123',
      fullName: 'Test User'
    });
    expect(result.userId).toBeDefined();
    expect(result.email).toBe('test@university.edu');
  });

  test('should reject duplicate email', async () => {
    await authService.register({ email: 'dup@edu.vn', ... });
    await expect(authService.register({ email: 'dup@edu.vn', ... }))
      .rejects.toThrow('Email already exists');
  });
});
```

### 12.2 Integration Tests

Kiem thu API voi Supertest:

```javascript
describe('Auth API', () => {
  test('POST /api/auth/register - should create user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'newuser@uni.edu',
        password: 'SecurePass123',
        fullName: 'New User'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.data.userId).toBeDefined();
  });

  test('POST /api/auth/login - should return JWT', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'user@uni.edu',
        password: 'Password123'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.token).toMatch(/^eyJ/); // JWT format
  });
});
```

### 12.3 Manual UAT (User Acceptance Testing)

Kiem thu theo luong dung thoat:

1. **Authentication flow**
   - Dang ky tai khoan moi
   - Dang nhap voi email/password
   - Kiem tra JWT luu trong localStorage
   - Test: Nhan dinh quynh khong co token

2. **Product Management**
   - Dang san pham moi (5 anh, <= 5MB each)
   - Tim kiem theo truong, khoa, mon
   - Xem chi tiet san pham va anh

3. **Order flow (Buy)**
   - Them san pham vao gio hang
   - Xem gio hang, thay doi quantity
   - Checkout, tao don
   - Theo doi trang thai don (pending_payment → paid → delivering → completed)

4. **Order flow (Rental)**
   - Them san pham cho thue
   - Xac nhan so ngay thue
   - Tinh tien coc + tien thue
   - Theo doi: paid → delivering → active_rental → return_requested → completed

5. **Forum & Community**
   - Tao bai viet dien dan
   - Binh luan vao bai viet
   - Vote bai viet
   - Tim kiem bai viet theo keyword

6. **Notifications & Messages**
   - Gui tin nhan giua buyer va seller
   - Nhan thong bao khi co hanh dong moi (thanh toan, giao hang, etc)

7. **Admin Dashboard**
   - View users, products, orders
   - Ban user tap tap
   - View analytics

### 12.4 Seed Data

Database co seed data (be/sql/seed_data.sql):

- 10 users (mix student/seller/admin)
- 20 san pham (mua + thue)
- 5 bai viet dien dan voi 10 comments
- 3 don hang voi trang thai khac nhau

Dung de:
- Kiem thu manual (khong can tao du lieu)
- Demo video (co san du lieu)
- Load test (co san data de query)

## 13. Stack Cong nghe Chi tiet

### 13.1 Frontend Technologies

```json
{
  "framework": "Next.js 14 (App Router, server components, async components)",
  "language": "TypeScript 5 + React 19",
  "styling": {
    "css_framework": "TailwindCSS 4",
    "custom_css": "globals.css, theme.css",
    "icons": "Lucide React"
  },
  "ui_components": "Radix UI (accordion, avatar, dropdown, dialog, etc)",
  "form": "React Hook Form (form validation client-side)",
  "charts": "Recharts (analytics dashboard)",
  "api": "fetch (wrapper trong fe/src/lib/api.ts)",
  "state": "localStorage (JWT token, user cache)",
  "fonts": "Google Fonts: Inter, Plus Jakarta Sans",
  "build_tool": "Webpack (integrated tu Next.js)"
}
```

### 13.2 Backend Technologies

```json
{
  "runtime": "Node.js 18+ (LTS)",
  "framework": "Express.js 4",
  "language": "JavaScript (ES6+)",
  "database": {
    "system": "Microsoft SQL Server 2022",
    "driver": "mssql (npm package)",
    "pool": "Connection pooling voi max 100 connections"
  },
  "authentication": {
    "jwt": "jsonwebtoken (sign/verify)",
    "password": "bcrypt (hash/compare)"
  },
  "validation": "Joi (schema validation)",
  "file_upload": "Multer (multipart/form-data)",
  "security": {
    "cors": "cors (cross-origin requests)",
    "helmet": "(optional - chi add neeu cần)",
    "rate_limiting": "(optional)"
  },
  "testing": "Jest + Supertest",
  "logging": "(optional - can bo sung)"
}
```

### 13.3 DevOps & Infrastructure

```
Docker:
  - Base image: node:18-alpine (backend)
  - Base image: mcr.microsoft.com/mssql/server:2022-latest (database)
  - Docker Compose: 3 services (db, db-init, api)
  
Environment:
  - Frontend: NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
  - Backend: 14 bien moi truong (.env file)
  
Volumes:
  - mssql-data: Persistent MSSQL database
  - be/uploads/: File uploads (products, avatars)
```

### 13.4 Package dependencies chinh

#### Backend (be/package.json)

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mssql": "^9.0.0",
    "jsonwebtoken": "^9.1.0",
    "bcrypt": "^5.1.1",
    "joi": "^17.11.0",
    "multer": "^1.4.5",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "supertest": "^6.3.3",
    "nodemon": "^3.0.2"
  }
}
```

#### Frontend (fe/package.json)

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "typescript": "^5.0.0",
    "@radix-ui/react-*": "latest",
    "tailwindcss": "^4.0.0",
    "react-hook-form": "^7.47.0",
    "recharts": "^2.10.0",
    "lucide-react": "^0.294.0"
  }
}
```

## 14. Quy tac va Best Practices

### 14.1 Quy tac Code Organization

#### Backend
- **Controllers**: Nhan request, call service, tra response
  - 1 controller tren file
  - Method name = action (create, update, delete, getOne, getMany)
  
- **Services**: Business logic, validation, processing
  - 1 service class tren file
  - Khong directly truy van database, call repository
  - Throw AppError neu co loi
  
- **Repositories**: Data access layer
  - 1 repository class tren file
  - Chi chua cac method SQL-related
  - Return raw data hoac structured objects
  - Su dung async/await
  
- **Routes**: REST endpoint definitions
  - Group by resource (products.routes.js, orders.routes.js, etc)
  - Su dung middleware (requireAuth, upload, errorHandler)
  - Export router object

- **Patterns**: Design pattern implementations
  - 1 pattern tren folder
  - Su dung se quet cua business logic cua service/controller

#### Frontend
- **App**: Next.js pages + layouts
  - File-based routing
  - Folder structure = URL structure
  - Dynamic routes dung [id] hoac [slug]
  
- **Components**: Reusable UI components
  - .tsx files
  - Props voi TypeScript types
  - Functional components + React Hooks
  
- **Services**: API adapters
  - Call backend REST API
  - Handle response transformation
  
- **Lib**: Utilities
  - api.ts: apiFetch wrapper
  - seo.ts: Metadata config
  - Other utility functions
  
- **Types**: TypeScript interfaces + types
  - Dinh nghia model types
  - Type hints cho API responses

### 14.2 Error Handling Convention

**Backend**:
- Tat ca error phai qua AppError voi (message, statusCode)
- Controller se catch va error handler se GUI response
- Status codes:
  - 200: OK
  - 201: Created
  - 400: Bad Request (validation error)
  - 401: Unauthorized (khong dang nhap)
  - 403: Forbidden (khong co quyen)
  - 404: Not Found
  - 500: Internal Server Error

**Frontend**:
- Handle HTTP errors khi call API
- Show toast/modal voi user-friendly message
- Log errors to console (dev mode only)

### 14.3 API Response Format

**Success response**:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error response**:
```json
{
  "success": false,
  "message": "Descriptive error message",
  "statusCode": 400,
  "errors": { "field": "validation error" }  // Optional
}
```

### 14.4 Database Naming Convention

- Tables: PascalCase (Users, Products, Orders)
- Columns: camelCase (userId, productName, orderDate)
- Foreign keys: [TableName]Id (UserId, ProductId)
- Constraints: CHK_[TableName]_[FieldName]
- Indexes: IX_[TableName]_[FieldName]

### 14.5 Naming Convention Code

**JavaScript/TypeScript**:
- Variables, functions: camelCase (userId, getProductById)
- Classes: PascalCase (UserRepository, OrderService)
- Constants: UPPER_SNAKE_CASE (MAX_FILE_SIZE, JWT_EXPIRY)
- Files: kebab-case hoac camelCase (user.repository.js hoac userRepository.js)

## 15. Cac Trang Thai va Luong Nghiep Vu

### 15.1 Luong mua san pham (Buy Flow)

```
User Register/Login
  ↓
Search & Browse Products
  ↓
View Product Details
  ↓
Add to Cart
  ↓
Checkout
  ↓
Select Payment Method (MoMo, VNPay)
  ↓
Confirm Payment
  ↓
Order Status: PendingPayment
  ↓
(Payment Success from Webhook)
  ↓
Order Status: Paid
  ↓
Seller marks: Delivering
  ↓
Order Status: Delivering
  ↓
Buyer confirms: Received
  ↓
Order Status: Completed
  ↓
Buyer writes Review
```

### 15.2 Luong cho thue san pham (Rental Flow)

```
(same as above until Paid)
  ↓
Order Status: Paid
  ↓
Seller marks: Delivering
  ↓
Order Status: Delivering
  ↓
Buyer confirms: Received & rental starts
  ↓
Order Status: ActiveRental
  ↓
Buyer requests Return (after X days)
  ↓
Order Status: ReturnRequested
  ↓
Seller approves Return
  ↓
Order Status: ReturnApproved
  ↓
Buyer confirms Return
  ↓
Order Status: Completed
  ↓
Seller releases Deposit
  ↓
Order Status: DepositRefunded
```

### 15.3 Luong thanh toan va webhook

```
Frontend: User chon payment method
  ↓
API: POST /api/payments (initiate)
  ↓
PaymentService: Tao request, redirect to payment gateway (MoMo/VNPay)
  ↓
Payment Gateway: User nhap thong tin thanh toan
  ↓
(Thanh toan thanh cong hoac that bai)
  ↓
Payment Gateway sends Webhook
  ↓
API: POST /api/payments/webhook (handle)
  ↓
PaymentService: Verify webhook signature
  ↓
EventBus: Emit PAYMENT_SUCCESS
  ↓
Observers: Cap nhat order, inventory, gui thong bao
  ↓
Return response toi payment gateway (confirm receipt)
```

## 16. Performance va Optimization

### 16.1 Frontend Optimization

- **Image Optimization**: Dung Next.js Image component
- **Code Splitting**: Automatic voi Next.js dynamic imports
- **Caching**: JWT + user info trong localStorage
- **API**: Batch requests, minimize payload

### 16.2 Backend Optimization

- **Database**:
  - Connection pooling (mssql): max 100 connections
  - Indexes on foreign keys va frequently searched columns
  - Avoid N+1 queries: use JOIN thay vi loop + query
  
- **Caching** (optional):
  - Redis for session caching
  - Cache product listings
  
- **API**:
  - Pagination: limit 20 items tren page
  - Compression: gzip responses (optional)
  - Rate limiting: (optional, can add)

## 17. Security Considerations

### 17.1 Authentication & Authorization

- JWT tokens: Signed voi secret key, expire sau 7 ngay
- Password: Bcrypt hash, salt rounds = 10
- Middleware: Check token co hop le va chưa expire
- Role-based: Admin endpoints yeu cau role=admin

### 17.2 Input Validation

- Joi schema: Validate tat ca request body
- File upload: Check MIME type va file size
- SQL Injection: Parameterized queries tu mssql driver

### 17.3 Data Protection

- JWT token luu trong localStorage (vulnerable to XSS)
- Co the nang cap len httpOnly cookies
- Sensitive data: Mat khau, personal info - khong day tren API response

### 17.4 CORS

- Enabled voi whitelist origins
- Credentials: true (neu cần)

## 18. Cac Tep Quan Trong

| File | Chuc nang |
|---|---|
| [be/src/server.js](/c:/Users/user/Desktop/EduCart/be/src/server.js) | Entry point, Express app setup, middleware |
| [be/src/container.js](/c:/Users/user/Desktop/EduCart/be/src/container.js) | Dependency injection, khoi tao repositories & services |
| [be/src/config/db.js](/c:/Users/user/Desktop/EduCart/be/src/config/db.js) | SQL Server connection pool |
| [fe/src/lib/api.ts](/c:/Users/user/Desktop/EduCart/fe/src/lib/api.ts) | API client, JWT management |
| [be/sql/educart_schema.sql](/c:/Users/user/Desktop/EduCart/be/sql/educart_schema.sql) | Database schema, tables, constraints |
| [be/sql/seed_data.sql](/c:/Users/user/Desktop/EduCart/be/sql/seed_data.sql) | Test data, demo fixtures |
| [be/docker-compose.yml](/c:/Users/user/Desktop/EduCart/be/docker-compose.yml) | Docker setup, services definition |

### 13.4 Package dependencies chinh

#### Backend (be/package.json)

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mssql": "^9.0.0",
    "jsonwebtoken": "^9.1.0",
    "bcrypt": "^5.1.1",
    "joi": "^17.11.0",
    "multer": "^1.4.5",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "supertest": "^6.3.3",
    "nodemon": "^3.0.2"
  }
}
```

#### Frontend (fe/package.json)

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "typescript": "^5.0.0",
    "@radix-ui/react-*": "latest",
    "tailwindcss": "^4.0.0",
    "react-hook-form": "^7.47.0",
    "recharts": "^2.10.0",
    "lucide-react": "^0.294.0"
  }
}
```

## 14. Quy tac va Best Practices

### 14.1 Quy tac Code Organization

#### Backend
- **Controllers**: Nhan request, call service, tra response
  - 1 controller tren file
  - Method name = action (create, update, delete, getOne, getMany)
  
- **Services**: Business logic, validation, processing
  - 1 service class tren file
  - Khong directly truy van database, call repository
  - Throw AppError neu co loi
  
- **Repositories**: Data access layer
  - 1 repository class tren file
  - Chi chua cac method SQL-related
  - Return raw data hoac structured objects
  - Su dung async/await
  
- **Routes**: REST endpoint definitions
  - Group by resource (products.routes.js, orders.routes.js, etc)
  - Su dung middleware (requireAuth, upload, errorHandler)
  - Export router object

- **Patterns**: Design pattern implementations
  - 1 pattern tren folder
  - Su dung se quet cua business logic cua service/controller

#### Frontend
- **App**: Next.js pages + layouts
  - File-based routing
  - Folder structure = URL structure
  - Dynamic routes dung [id] hoac [slug]
  
- **Components**: Reusable UI components
  - .tsx files
  - Props voi TypeScript types
  - Functional components + React Hooks
  
- **Services**: API adapters
  - Call backend REST API
  - Handle response transformation
  
- **Lib**: Utilities
  - api.ts: apiFetch wrapper
  - seo.ts: Metadata config
  - Other utility functions
  
- **Types**: TypeScript interfaces + types
  - Dinh nghia model types
  - Type hints cho API responses

### 14.2 Error Handling Convention

**Backend**:
- Tat ca error phai qua AppError voi (message, statusCode)
- Controller se catch va error handler se GUI response
- Status codes:
  - 200: OK
  - 201: Created
  - 400: Bad Request (validation error)
  - 401: Unauthorized (khong dang nhap)
  - 403: Forbidden (khong co quyen)
  - 404: Not Found
  - 500: Internal Server Error

**Frontend**:
- Handle HTTP errors khi call API
- Show toast/modal voi user-friendly message
- Log errors to console (dev mode only)

### 14.3 API Response Format

**Success response**:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error response**:
```json
{
  "success": false,
  "message": "Descriptive error message",
  "statusCode": 400,
  "errors": { "field": "validation error" }  // Optional
}
```

### 14.4 Database Naming Convention

- Tables: PascalCase (Users, Products, Orders)
- Columns: camelCase (userId, productName, orderDate)
- Foreign keys: [TableName]Id (UserId, ProductId)
- Constraints: CHK_[TableName]_[FieldName]
- Indexes: IX_[TableName]_[FieldName]

### 14.5 Naming Convention Code

**JavaScript/TypeScript**:
- Variables, functions: camelCase (userId, getProductById)
- Classes: PascalCase (UserRepository, OrderService)
- Constants: UPPER_SNAKE_CASE (MAX_FILE_SIZE, JWT_EXPIRY)
- Files: kebab-case hoac camelCase (user.repository.js hoac userRepository.js)

## 15. Cac Trang Thai va Luong Nghiep Vu

### 15.1 Luong mua san pham (Buy Flow)

```
User Register/Login
  ↓
Search & Browse Products
  ↓
View Product Details
  ↓
Add to Cart
  ↓
Checkout
  ↓
Select Payment Method (MoMo, VNPay)
  ↓
Confirm Payment
  ↓
Order Status: PendingPayment
  ↓
(Payment Success from Webhook)
  ↓
Order Status: Paid
  ↓
Seller marks: Delivering
  ↓
Order Status: Delivering
  ↓
Buyer confirms: Received
  ↓
Order Status: Completed
  ↓
Buyer writes Review
```

### 15.2 Luong cho thue san pham (Rental Flow)

```
(same as above until Paid)
  ↓
Order Status: Paid
  ↓
Seller marks: Delivering
  ↓
Order Status: Delivering
  ↓
Buyer confirms: Received & rental starts
  ↓
Order Status: ActiveRental
  ↓
Buyer requests Return (after X days)
  ↓
Order Status: ReturnRequested
  ↓
Seller approves Return
  ↓
Order Status: ReturnApproved
  ↓
Buyer confirms Return
  ↓
Order Status: Completed
  ↓
Seller releases Deposit
  ↓
Order Status: DepositRefunded
```

### 15.3 Luong thanh toan va webhook

```
Frontend: User chon payment method
  ↓
API: POST /api/payments (initiate)
  ↓
PaymentService: Tao request, redirect to payment gateway (MoMo/VNPay)
  ↓
Payment Gateway: User nhap thong tin thanh toan
  ↓
(Thanh toan thanh cong hoac that bai)
  ↓
Payment Gateway sends Webhook
  ↓
API: POST /api/payments/webhook (handle)
  ↓
PaymentService: Verify webhook signature
  ↓
EventBus: Emit PAYMENT_SUCCESS
  ↓
Observers: Cap nhat order, inventory, gui thong bao
  ↓
Return response toi payment gateway (confirm receipt)
```

## 16. Performance va Optimization

### 16.1 Frontend Optimization

- **Image Optimization**: Dung Next.js Image component
- **Code Splitting**: Automatic voi Next.js dynamic imports
- **Caching**: JWT + user info trong localStorage
- **API**: Batch requests, minimize payload

### 16.2 Backend Optimization

- **Database**:
  - Connection pooling (mssql): max 100 connections
  - Indexes on foreign keys va frequently searched columns
  - Avoid N+1 queries: use JOIN thay vi loop + query
  
- **Caching** (optional):
  - Redis for session caching
  - Cache product listings
  
- **API**:
  - Pagination: limit 20 items tren page
  - Compression: gzip responses (optional)
  - Rate limiting: (optional, can add)

## 17. Security Considerations

### 17.1 Authentication & Authorization

- JWT tokens: Signed voi secret key, expire sau 7 ngay
- Password: Bcrypt hash, salt rounds = 10
- Middleware: Check token co hop le va chưa expire
- Role-based: Admin endpoints yeu cau role=admin

### 17.2 Input Validation

- Joi schema: Validate tat ca request body
- File upload: Check MIME type va file size
- SQL Injection: Parameterized queries tu mssql driver

### 17.3 Data Protection

- JWT token luu trong localStorage (vulnerable to XSS)
- Co the nang cap len httpOnly cookies
- Sensitive data: Mat khau, personal info - khong day tren API response

### 17.4 CORS

- Enabled voi whitelist origins
- Credentials: true (neu cần)

## 18. Cac Tep Quan Trong

| File | Chuc nang |
|---|---|
| [be/src/server.js](/c:/Users/user/Desktop/EduCart/be/src/server.js) | Entry point, Express app setup, middleware |
| [be/src/container.js](/c:/Users/user/Desktop/EduCart/be/src/container.js) | Dependency injection, khoi tao repositories & services |
| [be/src/config/db.js](/c:/Users/user/Desktop/EduCart/be/src/config/db.js) | SQL Server connection pool |
| [fe/src/lib/api.ts](/c:/Users/user/Desktop/EduCart/fe/src/lib/api.ts) | API client, JWT management |
| [be/sql/educart_schema.sql](/c:/Users/user/Desktop/EduCart/be/sql/educart_schema.sql) | Database schema, tables, constraints |
| [be/sql/seed_data.sql](/c:/Users/user/Desktop/EduCart/be/sql/seed_data.sql) | Test data, demo fixtures |
| [be/docker-compose.yml](/c:/Users/user/Desktop/EduCart/be/docker-compose.yml) | Docker setup, services definition |

Video demo nen di theo thu tu:

1. Mo dau
   - Gioi thieu ten de tai, muc tieu EduCart
2. Trinh bay kien truc
   - Frontend, backend, database
3. Chay he thong
   - Backend health OK
   - Frontend mo tren browser
4. Demo chuc nang nguoi dung
   - Dang nhap
   - Xem san pham
   - Loc san pham cho thuê
   - Xem chi tiet san pham
   - Them vao gio hang
   - Tao don
   - Xem don hang va trang thai
5. Demo dien dan
   - Mo 4-5 bai viet mau
   - Tao them mot bai moi
   - Binh luan vao bai viet
6. Demo thay doi du lieu trong DB
   - Sau khi dang bai/dang ky/tao don, refresh va cho thay du lieu da luu
7. Ket thuc
   - Tong ket nhung chuc nang da hoan thanh

## 8. Rui ro va gioi han can ghi trung thuc trong bao cao

- He thong hien tai dung SQL Server, khong phai PostgreSQL
- Mot so file giao dien dang co loi encoding tieng Viet
- `stored_procedures.sql` can doi chieu lai voi schema hien tai truoc khi dua vao demo nghiep vu nang
- Mot so test `order.service` hien tai can dong bo lai voi business rule thuc te

Neu nop bao cao, nen viet ro nhung diem nay o muc "han che cua ban hien thuc" thay vi bo qua.
