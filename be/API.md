# EduCart API Documentation

Base URL: `http://localhost:3001/api`

All protected endpoints require:
```
Authorization: Bearer <jwt_token>
```

---

## Auth

### POST /auth/register
Register a new user.

**Body**
```json
{
  "email": "user@example.com",
  "password": "secret",
  "firstName": "Nguyễn",
  "lastName": "Văn A",
  "mssv": "21120001",
  "role": "Buyer",
  "eduLevel": "Undergraduate",
  "year": 2
}
```

**Response 201**
```json
{ "ok": true, "token": "<jwt>", "user": { "UserID": 1, "Email": "...", ... } }
```

---

### POST /auth/login
Authenticate and receive a JWT.

**Body**
```json
{ "email": "user@example.com", "password": "secret" }
```

**Response 200**
```json
{ "ok": true, "token": "<jwt>", "user": { "UserID": 1, "Email": "...", ... } }
```

---

## Products

### GET /products
List products with optional filters and pagination.

**Query params**

| Param | Type | Description |
|---|---|---|
| `search` | string | Full-text search on Title / Author |
| `universityId` | number | Filter by university |
| `facultyId` | number | Filter by faculty |
| `subjectId` | number | Filter by subject |
| `forRent` | `true`/`false` | Filter by buy vs. rent |
| `status` | string | Product status (e.g. `Available`) |
| `page` | number | Page number (default 1) |
| `limit` | number | Items per page (default 20) |

**Response 200**
```json
{
  "ok": true,
  "products": [
    {
      "ProductID": 1,
      "Title": "Calculus: Early Transcendentals",
      "Author": "James Stewart",
      "Price": 125000,
      "OriginalPrice": 250000,
      "DiscountLabel": "-50%",
      "RentalPrice": null,
      "Condition": 95,
      "IsForRent": false,
      "Status": "Available",
      "Rating": 4.5,
      "ReviewsCount": 12,
      "ThumbnailURL": "https://...",
      "SellerName": "Nguyễn Văn A",
      "Category": "Calculus",
      "Format": "Sách cứng",
      "TermLabel": "Theo kỳ",
      "Stock": 2
    }
  ],
  "total": 42
}
```

---

### GET /products/:id
Get a single product with full details and image gallery.

**Response 200**
```json
{
  "ok": true,
  "product": {
    "ProductID": 1,
    "Title": "...",
    "Author": "...",
    "Price": 125000,
    "OriginalPrice": null,
    "DiscountLabel": null,
    "RentalPrice": null,
    "IsForRent": false,
    "Status": "Available",
    "Rating": 4.5,
    "ReviewsCount": 12,
    "Description": "...",
    "Language": "English",
    "Pages": 1200,
    "Publisher": "Cengage Learning",
    "PublishYear": 2023,
    "ISBN": "978-0357700013",
    "Condition": 95,
    "SellerName": "Nguyễn Văn A",
    "SellerAvatarURL": null,
    "SellerRating": 4.8,
    "Stock": 2,
    "images": [
      { "ImageID": 1, "ImageURL": "https://...", "SortOrder": 0 }
    ]
  }
}
```

---

### POST /products `[Auth required]`
Create a new product listing.

**Body**
```json
{
  "title": "Calculus: Early Transcendentals",
  "author": "James Stewart",
  "description": "A comprehensive calculus textbook.",
  "price": 125000,
  "isForRent": false,
  "rentalPrice": null,
  "condition": 95,
  "stock": 1,
  "category": "Calculus",
  "format": "Sách cứng",
  "termLabel": "Theo kỳ",
  "originalPrice": 250000,
  "discountLabel": "-50%",
  "language": "English",
  "pages": 1200,
  "publisher": "Cengage Learning",
  "publishYear": 2023,
  "isbn": "978-0357700013",
  "universityId": 1,
  "facultyId": 2,
  "subjectId": 3,
  "images": ["https://..."]
}
```

**Response 201**
```json
{ "ok": true, "product": { "ProductID": 42, ... } }
```

---

### PUT /products/:id `[Auth required]`
Update an existing product listing. Only the seller who created the product can update it.
Products with status `Sold` or `Renting` cannot be updated.

**Body** (all fields optional, `multipart/form-data`)
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "price": 150000,
  "stock": 3,
  "condition": 90,
  "author": "Author Name",
  "category": "Category",
  "format": "Sách mềm",
  "termLabel": "Theo kỳ",
  "originalPrice": 300000,
  "discountLabel": "-50%",
  "rentalPrice": 10000,
  "language": "Vietnamese",
  "pages": 500,
  "publisher": "NXB Giáo Dục",
  "publishYear": 2024,
  "isbn": "978-0000000000"
}
```

**Response 200**
```json
{ "ok": true, "product": { "ProductID": 1, ... } }
```

**Error Responses**
- `403` — Not the product owner
- `400` — Product is sold or renting
- `404` — Product not found

---

### DELETE /products/:id `[Auth required]`
Delete a product listing. Only the seller who created the product can delete it.
Products with status `Sold` or `Renting` cannot be deleted.

**Response 200**
```json
{ "ok": true, "message": "Product deleted successfully" }
```

**Error Responses**
- `403` — Not the product owner
- `400` — Product is sold or renting
- `404` — Product not found

---

## Orders

### GET /orders `[Auth required]`
List orders for the current user.

**Query params**

| Param | Values | Description |
|---|---|---|
| `role` | `buyer` (default) / `seller` | View as buyer or seller |

**Response 200**
```json
{
  "ok": true,
  "orders": [
    {
      "OrderID": 1,
      "OrderType": "Buy",
      "LifecycleState": "Pending",
      "TotalAmount": 125000,
      "CreatedAt": "2025-04-21T08:00:00Z",
      "BuyerName": "Nguyễn Văn A",
      "SellerName": "Trần Thị B"
    }
  ]
}
```

---

### GET /orders/:id `[Auth required]`
Get a single order with line items.

**Response 200**
```json
{
  "ok": true,
  "order": {
    "OrderID": 1,
    "OrderType": "Buy",
    "LifecycleState": "Pending",
    "TotalAmount": 125000,
    "BuyerName": "Nguyễn Văn A",
    "SellerName": "Trần Thị B",
    "items": [
      {
        "ProductID": 1,
        "Title": "Calculus",
        "Author": "James Stewart",
        "Quantity": 1,
        "UnitPrice": 125000,
        "ThumbnailURL": "https://..."
      }
    ]
  }
}
```

---

### POST /orders `[Auth required]`
Create a new order (Buy or Rent).

**Body — Buy order**
```json
{
  "type": "Buy",
  "note": "Giao hàng buổi chiều",
  "items": [
    { "productId": 1, "quantity": 1 }
  ]
}
```

**Body — Rent order**
```json
{
  "type": "Rent",
  "items": [{ "productId": 2, "quantity": 1 }],
  "rentStartDate": "2025-05-01",
  "rentEndDate": "2025-05-31",
  "dailyRate": 5000
}
```

**Response 201**
```json
{ "ok": true, "order": { "OrderID": 5, ... } }
```

---

### POST /orders/:id/transitions `[Auth required]`
Advance an order through its lifecycle state machine.

**Body**
```json
{ "event": "onShip" }
```

Valid events: `onShip` → `onDeliver` → `onComplete` → `onRefundDeposit` → `onCancel`

**Response 200**
```json
{ "ok": true, "lifecycleState": "Shipped" }
```

---

## Cart

### GET /cart `[Auth required]`
Get the current user's cart.

**Response 200**
```json
{
  "ok": true,
  "items": [
    {
      "CartItemID": 1,
      "ProductID": 1,
      "Title": "Calculus",
      "Author": "James Stewart",
      "Price": 125000,
      "RentalPrice": null,
      "IsForRent": false,
      "Status": "Available",
      "Stock": 2,
      "ThumbnailURL": "https://..."
    }
  ]
}
```

---

### POST /cart `[Auth required]`
Add a product to cart (idempotent — ignores duplicates).

**Body**
```json
{ "productId": 1 }
```

**Response 200**
```json
{ "ok": true, "item": { "CartItemID": 1, "ProductID": 1, ... } }
```

---

### DELETE /cart/:productId `[Auth required]`
Remove a product from cart.

**Response 200**
```json
{ "ok": true }
```

---

## Users

### GET /users/me `[Auth required]`
Get the current user's profile.

**Response 200**
```json
{
  "ok": true,
  "user": {
    "UserID": 1,
    "Email": "user@example.com",
    "FName": "Nguyễn",
    "LName": "Văn A",
    "MSSV": "21120001",
    "Role": "Buyer",
    "PhoneNumber": "0912345678",
    "Bio": null,
    "AvatarURL": null,
    "Address": null,
    "Rating": 4.8,
    "Balance": 0,
    "CoinBalance": 0
  }
}
```

---

### PUT /users/me `[Auth required]`
Update the current user's profile.

**Body** (all fields optional)
```json
{
  "firstName": "Nguyễn",
  "lastName": "Văn B",
  "phoneNumber": "0901234567",
  "bio": "Sinh viên năm 3",
  "avatarURL": "https://...",
  "address": "123 Lê Lợi, Q.1, TP.HCM"
}
```

**Response 200**
```json
{ "ok": true }
```

---

## Lookups (Public)

### GET /universities
List all universities.

**Response 200**
```json
{ "ok": true, "universities": [{ "UniversityID": 1, "UName": "ĐH Bách Khoa TP.HCM" }] }
```

---

### GET /universities/:universityId/faculties
List faculties for a university.

**Response 200**
```json
{ "ok": true, "faculties": [{ "FacultyID": 1, "FacultyName": "Khoa KHMT" }] }
```

---

### GET /faculties/:facultyId/subjects
List subjects for a faculty.

**Response 200**
```json
{ "ok": true, "subjects": [{ "SubjectID": 1, "SubjectCode": "CS101", "SubjectName": "Nhập môn CNTT" }] }
```

---

## Messages

### GET /messages/conversations `[Auth required]`
List all conversations for the current user (latest message per conversation).

**Response 200**
```json
{
  "ok": true,
  "conversations": [
    {
      "OtherUserID": 2,
      "LastMessage": "Ok tôi sẽ gửi sách",
      "LastSentAt": "2025-04-21T10:42:00Z",
      "IsRead": false,
      "FName": "Trần",
      "LName": "Thị B",
      "AvatarURL": null
    }
  ]
}
```

---

### GET /messages `[Auth required]`
Get the message thread with another user. Also marks received messages as read.

**Query params**

| Param | Type | Description |
|---|---|---|
| `with` | number | The other user's UserID |

**Response 200**
```json
{
  "ok": true,
  "messages": [
    {
      "MessageID": 1,
      "SenderID": 1,
      "ReceiverID": 2,
      "Content": "Bạn có sách này không?",
      "IsRead": true,
      "SentAt": "2025-04-21T10:30:00Z",
      "ProductID": null
    }
  ]
}
```

---

### POST /messages `[Auth required]`
Send a message.

**Body**
```json
{
  "receiverId": 2,
  "content": "Tôi muốn mua cuốn sách này",
  "productId": 1
}
```

**Response 201**
```json
{
  "ok": true,
  "message": {
    "MessageID": 5,
    "SenderID": 1,
    "ReceiverID": 2,
    "Content": "Tôi muốn mua cuốn sách này",
    "IsRead": false,
    "SentAt": "2025-04-21T11:00:00Z",
    "ProductID": 1
  }
}
```

---

## Payments

### GET /payments
List payments for the current user.

### POST /payments
Initiate a payment (MoMo / VNPay / Coin).

---

## Health

### GET /health
Service liveness check.

**Response 200**
```json
{ "ok": true, "uptime": 12345.6 }
```

---

## Error Format

All errors return:
```json
{ "ok": false, "error": "Human-readable message" }
```

Common HTTP status codes:
- `400` — Validation error
- `401` — Missing or invalid JWT
- `403` — Forbidden (e.g. wrong user)
- `404` — Resource not found
- `500` — Internal server error
