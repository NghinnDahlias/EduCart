USE EduCart;
GO

-- ============================================================================
-- Seed users (sellers/chat demo)
-- ============================================================================
IF NOT EXISTS (SELECT 1 FROM dbo.Users WHERE UserEmail = 'seller@educart.local')
BEGIN
    INSERT INTO dbo.Users (
        UserEmail, FName, LName, Password, Role, Status,
        IsStudentVerified, EducationLevel, StudentYear
    )
    VALUES (
        'seller@educart.local', N'EduCart', N'Official', 'password123', 'Student', 'Active',
        1, 'Undergraduate', 3
    );
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Users WHERE UserEmail = 'hoangnam@educart.local')
BEGIN
    INSERT INTO dbo.Users (
        UserEmail, FName, LName, Password, Role, Status,
        IsStudentVerified, EducationLevel, StudentYear
    )
    VALUES ('hoangnam@educart.local', N'Hoàng', N'Nam', 'password123', 'Student', 'Active', 1, 'Undergraduate', 3);
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Users WHERE UserEmail = 'minhanh@educart.local')
BEGIN
    INSERT INTO dbo.Users (
        UserEmail, FName, LName, Password, Role, Status,
        IsStudentVerified, EducationLevel, StudentYear
    )
    VALUES ('minhanh@educart.local', N'Minh', N'Anh', 'password123', 'Student', 'Active', 1, 'Undergraduate', 2);
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Users WHERE UserEmail = 'khoa@educart.local')
BEGIN
    INSERT INTO dbo.Users (
        UserEmail, FName, LName, Password, Role, Status,
        IsStudentVerified, EducationLevel, StudentYear
    )
    VALUES ('khoa@educart.local', N'Trần', N'Văn Khoa', 'password123', 'Student', 'Active', 1, 'Undergraduate', 4);
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Users WHERE UserEmail = 'phuonglinh@educart.local')
BEGIN
    INSERT INTO dbo.Users (
        UserEmail, FName, LName, Password, Role, Status,
        IsStudentVerified, EducationLevel, StudentYear
    )
    VALUES ('phuonglinh@educart.local', N'Phương', N'Linh', 'password123', 'Student', 'Active', 1, 'Undergraduate', 3);
END
GO

IF NOT EXISTS (SELECT 1 FROM dbo.Users WHERE UserEmail = 'buyer@educart.local')
BEGIN
    INSERT INTO dbo.Users (
        UserEmail, FName, LName, Password, Role, Status,
        IsStudentVerified, EducationLevel, StudentYear
    )
    VALUES ('buyer@educart.local', N'Ngọc', N'Lan', 'password123', 'Student', 'Active', 1, 'Undergraduate', 2);
END
GO

UPDATE dbo.Users
SET AvatarURL = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hoang'
WHERE UserEmail = 'hoangnam@educart.local';
UPDATE dbo.Users
SET AvatarURL = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Minh'
WHERE UserEmail = 'minhanh@educart.local';
UPDATE dbo.Users
SET AvatarURL = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Khoa'
WHERE UserEmail = 'khoa@educart.local';
UPDATE dbo.Users
SET AvatarURL = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Linh'
WHERE UserEmail = 'phuonglinh@educart.local';
UPDATE dbo.Users
SET AvatarURL = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Buyer'
WHERE UserEmail = 'buyer@educart.local';
GO

-- ============================================================================
-- Seed universities
-- ============================================================================
;WITH UniSeeds AS (
    SELECT N'Đại Học Bách Khoa Hà Nội' AS UName UNION ALL
    SELECT N'Đại Học Quốc Gia Hà Nội' UNION ALL
    SELECT N'Đại Học Kinh Tế Quốc Dân' UNION ALL
    SELECT N'Đại Học Ngoại Thương' UNION ALL
    SELECT N'Đại Học Khoa Học Tự Nhiên' UNION ALL
    SELECT N'Đại Học Công Nghệ' UNION ALL
    SELECT N'Đại Học Sài Gòn' UNION ALL
    SELECT N'Đại Học Bách Khoa TP.HCM' UNION ALL
    
    SELECT N'ĐH Kinh tế TP.HCM' UNION ALL
    SELECT N'ĐH Khoa học Tự nhiên' UNION ALL
    SELECT N'ĐH Quốc gia TP.HCM' UNION ALL
    SELECT N'ĐH Y Dược TP.HCM' UNION ALL
    SELECT N'ĐH Sư phạm TP.HCM' UNION ALL
    SELECT N'ĐH KHXH & Nhân văn' UNION ALL
    SELECT N'ĐH Công nghệ Thông tin'
)
INSERT INTO dbo.Universities (UName)
SELECT s.UName
FROM UniSeeds s
WHERE NOT EXISTS (
    SELECT 1 FROM dbo.Universities u WHERE u.UName = s.UName
);
GO

-- ============================================================================
-- Seed faculties (Đã sửa đổi sang tên trường chuẩn)
-- ============================================================================
;WITH FacultySeeds AS (
    SELECT N'Đại Học Bách Khoa TP.HCM' AS UniversityName, N'Khoa Khoa học Ứng dụng' AS FacultyName UNION ALL
    SELECT N'Đại Học Bách Khoa TP.HCM', N'Khoa Khoa học & Kỹ thuật Máy tính' UNION ALL
    SELECT N'Đại Học Bách Khoa TP.HCM', N'Khoa Kỹ thuật Hóa học' UNION ALL
    SELECT N'Đại Học Bách Khoa TP.HCM', N'Khoa Kỹ thuật Giao thông' UNION ALL

    SELECT N'ĐH Kinh tế TP.HCM', N'Khoa Kinh tế' UNION ALL
    SELECT N'ĐH Kinh tế TP.HCM', N'Khoa Quản trị' UNION ALL

    SELECT N'ĐH Khoa học Tự nhiên', N'Khoa Hóa học' UNION ALL
    SELECT N'ĐH Khoa học Tự nhiên', N'Khoa Toán - Tin học' UNION ALL

    SELECT N'ĐH Quốc gia TP.HCM', N'Khoa Lý luận Chính trị' UNION ALL

    SELECT N'ĐH Y Dược TP.HCM', N'Khoa Y' UNION ALL
    SELECT N'ĐH Sư phạm TP.HCM', N'Khoa Tiếng Anh' UNION ALL

    SELECT N'ĐH KHXH & Nhân văn', N'Khoa Lịch sử' UNION ALL
    SELECT N'ĐH KHXH & Nhân văn', N'Khoa Tâm lý học' UNION ALL

    SELECT N'ĐH Công nghệ Thông tin', N'Khoa Khoa học Dữ liệu' UNION ALL
    SELECT N'ĐH Công nghệ Thông tin', N'Khoa Kỹ thuật Phần mềm' UNION ALL

    SELECT N'Đại Học Bách Khoa TP.HCM', N'Khoa Tổng hợp'
)
INSERT INTO dbo.Faculties (UniversityID, FacultyName)
SELECT u.UniversityID, s.FacultyName
FROM FacultySeeds s
JOIN dbo.Universities u ON u.UName = s.UniversityName
WHERE NOT EXISTS (
    SELECT 1 FROM dbo.Faculties f
    WHERE f.UniversityID = u.UniversityID AND f.FacultyName = s.FacultyName
);
GO

-- ============================================================================
-- Seed subjects (Đã sửa đổi sang tên trường chuẩn)
-- ============================================================================
;WITH SubjectSeeds AS (
    SELECT N'Đại Học Bách Khoa TP.HCM' AS UniversityName, N'Khoa Khoa học Ứng dụng' AS FacultyName, NULL AS SubjectCode, N'All' AS SubjectName UNION ALL
    SELECT N'Đại Học Bách Khoa TP.HCM', N'Khoa Khoa học Ứng dụng', NULL, N'Vật lý 1' UNION ALL
    SELECT N'Đại Học Bách Khoa TP.HCM', N'Khoa Khoa học & Kỹ thuật Máy tính', NULL, N'Cấu trúc dữ liệu và Giải thuật' UNION ALL
    SELECT N'Đại Học Bách Khoa TP.HCM', N'Khoa Kỹ thuật Hóa học', NULL, N'Hóa hữu cơ' UNION ALL
    SELECT N'Đại Học Bách Khoa TP.HCM', N'Khoa Kỹ thuật Giao thông', NULL, N'Cơ học chất lỏng' UNION ALL

    SELECT N'ĐH Kinh tế TP.HCM', N'Khoa Kinh tế', NULL, N'Kinh tế vi mô' UNION ALL
    SELECT N'ĐH Kinh tế TP.HCM', N'Khoa Quản trị', NULL, N'Quản trị kinh doanh' UNION ALL

    SELECT N'ĐH Khoa học Tự nhiên', N'Khoa Hóa học', NULL, N'Hóa học đại cương' UNION ALL
    SELECT N'ĐH Khoa học Tự nhiên', N'Khoa Toán - Tin học', NULL, N'Đại số tuyến tính' UNION ALL

    SELECT N'ĐH Quốc gia TP.HCM', N'Khoa Lý luận Chính trị', NULL, N'Triết học Mác - Lênin' UNION ALL

    SELECT N'ĐH Y Dược TP.HCM', N'Khoa Y', NULL, N'Sinh học đại cương' UNION ALL
    SELECT N'ĐH Sư phạm TP.HCM', N'Khoa Tiếng Anh', NULL, N'Anh văn cơ bản' UNION ALL

    SELECT N'ĐH KHXH & Nhân văn', N'Khoa Lịch sử', NULL, N'Lịch sử Việt Nam' UNION ALL
    SELECT N'ĐH KHXH & Nhân văn', N'Khoa Tâm lý học', NULL, N'Tâm lý học đại cương' UNION ALL

    SELECT N'ĐH Công nghệ Thông tin', N'Khoa Khoa học Dữ liệu', NULL, N'Nhập môn Khoa học Dữ liệu' UNION ALL
    SELECT N'ĐH Công nghệ Thông tin', N'Khoa Kỹ thuật Phần mềm', NULL, N'Phát triển ứng dụng Web' UNION ALL

    -- Register majors mapped to a generic faculty
    SELECT N'Đại Học Bách Khoa TP.HCM', N'Khoa Tổng hợp', NULL, N'Khoa học Máy tính' UNION ALL
    SELECT N'Đại Học Bách Khoa TP.HCM', N'Khoa Tổng hợp', NULL, N'Kỹ thuật Máy tính' UNION ALL
    SELECT N'Đại Học Bách Khoa TP.HCM', N'Khoa Tổng hợp', NULL, N'Kỹ Thuật Phần Mềm' UNION ALL
    SELECT N'Đại Học Bách Khoa TP.HCM', N'Khoa Tổng hợp', NULL, N'Công Nghệ Thông Tin' UNION ALL
    SELECT N'Đại Học Bách Khoa TP.HCM', N'Khoa Tổng hợp', NULL, N'Kinh Tế' UNION ALL
    SELECT N'Đại Học Bách Khoa TP.HCM', N'Khoa Tổng hợp', NULL, N'Quản Lý Kinh Doanh' UNION ALL
    SELECT N'Đại Học Bách Khoa TP.HCM', N'Khoa Tổng hợp', NULL, N'Kỹ Thuật Cơ Khí' UNION ALL
    SELECT N'Đại Học Bách Khoa TP.HCM', N'Khoa Tổng hợp', NULL, N'Kỹ Thuật Điện' UNION ALL
    SELECT N'Đại Học Bách Khoa TP.HCM', N'Khoa Tổng hợp', NULL, N'Luật'
)
INSERT INTO dbo.Subjects (FacultyID, SubjectCode, SubjectName)
SELECT f.FacultyID, s.SubjectCode, s.SubjectName
FROM SubjectSeeds s
JOIN dbo.Universities u ON u.UName = s.UniversityName
JOIN dbo.Faculties f ON f.UniversityID = u.UniversityID AND f.FacultyName = s.FacultyName
WHERE NOT EXISTS (
    SELECT 1 FROM dbo.Subjects sub
    WHERE sub.FacultyID = f.FacultyID AND sub.SubjectName = s.SubjectName
);
GO

-- ============================================================================
-- Seed products (Đã sửa đổi sang tên trường chuẩn)
-- ============================================================================
;WITH ProductSeeds AS (
    SELECT 1 AS ProductId, N'Calculus: Early Transcendentals' AS Title, N'James Stewart' AS Author,
        N'Calculus' AS Category, N'Sách cứng' AS Format, N'Theo kỳ' AS TermLabel,
        125000 AS Price, 250000 AS OriginalPrice, N'-50%' AS DiscountLabel, NULL AS RentalPrice,
        N'English' AS Language, N'1200 trang' AS Pages, N'Cengage Learning' AS Publisher,
        2023 AS PublishYear, N'978-0357700013' AS ISBN,
        4.5 AS Rating, 128 AS ReviewsCount,
        95 AS Condition, 0 AS IsForRent,
        N'Đại Học Bách Khoa TP.HCM' AS UniversityName, N'Khoa Khoa học Ứng dụng' AS FacultyName, N'All' AS SubjectName,
        N'https://covers.openlibrary.org/b/isbn/9781285741550-L.jpg' AS ImageUrl
    UNION ALL
    SELECT 2, N'Nguyên lý Kinh tế học', N'N. Gregory Mankiw',
        N'Economics', N'E-book', N'Theo kỳ',
        25000, 50000, N'-50%', 25000,
        N'Vietnamese', N'850 trang', N'NXB Khoa học Xã hội',
        2022, N'978-8014652741',
        4.8, 95,
        100, 1,
        N'ĐH Kinh tế TP.HCM', N'Khoa Kinh tế', N'Kinh tế vi mô',
        N'https://covers.openlibrary.org/b/isbn/9781305585126-L.jpg'
    UNION ALL
    SELECT 3, N'Chemistry: A Molecular Approach', N'Nivaldo Jr. Tro',
        N'Chemistry', N'Sách cứng', N'Theo kỳ',
        180000, 360000, N'-50%', NULL,
        N'English', N'1050 trang', N'Pearson',
        2023, N'978-0135204771',
        4.6, 112,
        90, 0,
        N'ĐH Khoa học Tự nhiên', N'Khoa Hóa học', N'Hóa học đại cương',
        N'https://covers.openlibrary.org/b/isbn/9780321809247-L.jpg'
    UNION ALL
    SELECT 4, N'Triết học Mác - Lênin', N'NXB Lao động',
        N'Philosophy', N'Sách mềm', N'Theo kỳ',
        15000, 30000, N'-50%', 15000,
        N'Vietnamese', N'620 trang', N'NXB Lao động',
        2021, N'978-8016284721',
        4.2, 67,
        85, 1,
        N'ĐH Quốc gia TP.HCM', N'Khoa Lý luận Chính trị', N'Triết học Mác - Lênin',
        N'https://covers.openlibrary.org/b/isbn/9780717804405-L.jpg'
    UNION ALL
    SELECT 5, N'Introduction to Algorithms', N'Thomas H. Cormen',
        N'Computer Science', N'E-book', N'Dài hạn',
        220000, 440000, N'-50%', NULL,
        N'English', N'1312 trang', N'MIT Press',
        2022, N'978-0262046305',
        4.9, 256,
        100, 0,
        N'Đại Học Bách Khoa TP.HCM' AS UniversityName, N'Khoa Khoa học & Kỹ thuật Máy tính' AS FacultyName, N'Cấu trúc dữ liệu và Giải thuật' AS SubjectName,
        N'https://covers.openlibrary.org/b/isbn/9780262033848-L.jpg'
    UNION ALL
    SELECT 6, N'Vật lý đại cương A1', N'TS. Lê Công C',
        N'Physics', N'Sách cứng', N'Theo kỳ',
        110000, 220000, N'-50%', NULL,
        N'Vietnamese', N'780 trang', N'NXB Giáo dục Việt Nam',
        2022, N'978-8016548392',
        4.4, 89,
        90, 0,
        N'Đại Học Bách Khoa TP.HCM' AS UniversityName, N'Khoa Khoa học Ứng dụng' AS FacultyName, N'Vật lý 1' AS SubjectName,
        N'https://covers.openlibrary.org/b/isbn/9781305952195-L.jpg'
    UNION ALL
    SELECT 7, N'Linear Algebra and Its Applications', N'David C. Lay',
        N'Mathematics', N'Sách cứng', N'Theo kỳ',
        195000, 250000, N'-50%', NULL,
        N'English', N'560 trang', N'Pearson',
        2023, N'978-0136871591',
        4.7, 143,
        92, 0,
        N'ĐH Khoa học Tự nhiên', N'Khoa Toán - Tin học', N'Đại số tuyến tính',
        N'https://covers.openlibrary.org/b/isbn/9780321982384-L.jpg'
    UNION ALL
    SELECT 8, N'Sinh học phân tử', N'James D. Watson',
        N'Biology', N'E-book', N'Dài hạn',
        240000, 480000, N'-50%', NULL,
        N'English', N'950 trang', N'Garland Science',
        2023, N'978-0815345176',
        4.8, 178,
        100, 0,
        N'ĐH Y Dược TP.HCM', N'Khoa Y', N'Sinh học đại cương',
        N'https://covers.openlibrary.org/b/isbn/9780321762436-L.jpg'
    UNION ALL
    SELECT 9, N'Tiếng Anh giao tiếp cơ bản', N'Oxford English',
        N'Language', N'Sách cứng', N'Theo kỳ',
        85000, 170000, N'-50%', 85000,
        N'English', N'320 trang', N'Oxford',
        2021, N'978-0194579858',
        4.5, 203,
        80, 1,
        N'ĐH Sư phạm TP.HCM', N'Khoa Tiếng Anh', N'Anh văn cơ bản',
        N'https://covers.openlibrary.org/b/isbn/9780194579858-L.jpg'
    UNION ALL
    SELECT 10, N'Lịch sử Việt Nam hiện đại', N'TS. Trần Văn Giàu',
        N'History', N'Sách cứng', N'Dài hạn',
        65000, 130000, N'-50%', NULL,
        N'Vietnamese', N'540 trang', N'NXB Lịch sử',
        2020, N'978-0313341960',
        4.3, 66,
        88, 0,
        N'ĐH KHXH & Nhân văn', N'Khoa Lịch sử', N'Lịch sử Việt Nam',
        N'https://covers.openlibrary.org/b/isbn/9780313341960-L.jpg'
    UNION ALL
    SELECT 11, N'Data Science Handbook', N'Jake VanderPlas',
        N'Computer Science', N'E-book', N'Dài hạn',
        210000, 420000, N'-50%', NULL,
        N'English', N'548 trang', N'O''Reilly',
        2016, N'978-1491912058',
        4.6, 120,
        100, 0,
        N'ĐH Công nghệ Thông tin', N'Khoa Khoa học Dữ liệu', N'Nhập môn Khoa học Dữ liệu',
        N'https://covers.openlibrary.org/b/isbn/9781491912058-L.jpg'
    UNION ALL
    SELECT 12, N'Quản trị Kinh doanh', N'Stephen P. Robbins',
        N'Business', N'Sách cứng', N'Theo kỳ',
        175000, 350000, N'-50%', 175000,
        N'English', N'720 trang', N'Pearson',
        2019, N'978-0133910292',
        4.4, 80,
        90, 1,
        N'ĐH Kinh tế TP.HCM', N'Khoa Quản trị', N'Quản trị kinh doanh',
        N'https://covers.openlibrary.org/b/isbn/9780133910292-L.jpg'
    UNION ALL
    SELECT 13, N'Hóa học hữu cơ nâng cao', N'Jonathan Clayden',
        N'Chemistry', N'E-book', N'Theo kỳ',
        245000, 490000, N'-50%', NULL,
        N'English', N'1240 trang', N'Oxford',
        2021, N'978-0199270293',
        4.5, 70,
        100, 0,
        N'Đại Học Bách Khoa TP.HCM' AS UniversityName, N'Khoa Kỹ thuật Hóa học' AS FacultyName, N'Hóa hữu cơ' AS SubjectName,
        N'https://covers.openlibrary.org/b/isbn/9780199270293-L.jpg'
    UNION ALL
    SELECT 14, N'Tâm lý học nhân cách', N'Carl Rogers',
        N'Psychology', N'Sách cứng', N'Theo kỳ',
        120000, 240000, N'-50%', 120000,
        N'Vietnamese', N'480 trang', N'NXB Tâm lý',
        2018, N'978-0395755310',
        4.1, 55,
        85, 1,
        N'ĐH KHXH & Nhân văn', N'Khoa Tâm lý học', N'Tâm lý học đại cương',
        N'https://covers.openlibrary.org/b/isbn/9780395755310-L.jpg'
    UNION ALL
    SELECT 15, N'Cơ học chất lỏng', N'Frank M. White',
        N'Physics', N'Sách cứng', N'Theo kỳ',
        200000, 400000, N'-50%', NULL,
        N'English', N'880 trang', N'McGraw-Hill',
        2016, N'978-0073398273',
        4.2, 60,
        93, 0,
        N'Đại Học Bách Khoa TP.HCM' AS UniversityName, N'Khoa Kỹ thuật Giao thông' AS FacultyName, N'Cơ học chất lỏng' AS SubjectName,
        N'https://covers.openlibrary.org/b/isbn/9780073398273-L.jpg'
    UNION ALL
    SELECT 16, N'Lập trình Web với React', N'Kyle Simpson',
        N'Computer Science', N'E-book', N'Dài hạn',
        185000, 370000, N'-50%', NULL,
        N'English', N'520 trang', N'O''Reilly',
        2020, N'978-1492051725',
        4.6, 90,
        100, 0,
        N'ĐH Công nghệ Thông tin', N'Khoa Kỹ thuật Phần mềm', N'Phát triển ứng dụng Web',
        N'https://covers.openlibrary.org/b/isbn/9781492051725-L.jpg'
)
INSERT INTO dbo.Products (
    SellerID, UniversityID, FacultyID, SubjectID,
    Title, Author, Category, Format, TermLabel,
    Description, Price, OriginalPrice, DiscountLabel, RentalPrice,
    Language, Pages, Publisher, PublishYear, ISBN,
    Rating, ReviewsCount,
    Condition, IsForRent, Status, ViewCount
)
SELECT
    (SELECT TOP 1 UserID FROM dbo.Users WHERE UserEmail = 'seller@educart.local'),
    u.UniversityID,
    f.FacultyID,
    sub.SubjectID,
    p.Title,
    p.Author,
    p.Category,
    p.Format,
    p.TermLabel,
    N'Tác giả: ' + p.Author,
    p.Price,
    p.OriginalPrice,
    p.DiscountLabel,
    p.RentalPrice,
    p.Language,
    p.Pages,
    p.Publisher,
    p.PublishYear,
    p.ISBN,
    p.Rating,
    p.ReviewsCount,
    p.Condition,
    p.IsForRent,
    N'Available',
    0
FROM ProductSeeds p
JOIN dbo.Universities u ON u.UName = p.UniversityName
JOIN dbo.Faculties f ON f.UniversityID = u.UniversityID AND f.FacultyName = p.FacultyName
JOIN dbo.Subjects sub ON sub.FacultyID = f.FacultyID AND sub.SubjectName = p.SubjectName
WHERE NOT EXISTS (
    SELECT 1 FROM dbo.Products prod WHERE prod.Title = p.Title
);
GO

-- ============================================================================
-- Seed product images
-- ============================================================================
;WITH ImageSeeds AS (
    SELECT N'Calculus: Early Transcendentals' AS Title, N'https://covers.openlibrary.org/b/isbn/9781285741550-L.jpg' AS ImageUrl, 0 AS SortOrder UNION ALL
    SELECT N'Calculus: Early Transcendentals', N'https://covers.openlibrary.org/b/isbn/9780538497817-L.jpg', 1 UNION ALL
    SELECT N'Calculus: Early Transcendentals', N'https://covers.openlibrary.org/b/isbn/9780495011668-L.jpg', 2 UNION ALL

    SELECT N'Nguyên lý Kinh tế học', N'https://covers.openlibrary.org/b/isbn/9781305585126-L.jpg', 0 UNION ALL
    SELECT N'Nguyên lý Kinh tế học', N'https://covers.openlibrary.org/b/isbn/9781285165875-L.jpg', 1 UNION ALL
    SELECT N'Nguyên lý Kinh tế học', N'https://covers.openlibrary.org/b/isbn/9781337613040-L.jpg', 2 UNION ALL

    SELECT N'Chemistry: A Molecular Approach', N'https://covers.openlibrary.org/b/isbn/9780321809247-L.jpg', 0 UNION ALL
    SELECT N'Chemistry: A Molecular Approach', N'https://covers.openlibrary.org/b/isbn/9780134874371-L.jpg', 1 UNION ALL
    SELECT N'Chemistry: A Molecular Approach', N'https://covers.openlibrary.org/b/isbn/9780321706461-L.jpg', 2 UNION ALL

    SELECT N'Triết học Mác - Lênin', N'https://covers.openlibrary.org/b/isbn/9780717804405-L.jpg', 0 UNION ALL
    SELECT N'Triết học Mác - Lênin', N'https://covers.openlibrary.org/b/isbn/9780717800377-L.jpg', 1 UNION ALL
    SELECT N'Triết học Mác - Lênin', N'https://covers.openlibrary.org/b/isbn/9780717805167-L.jpg', 2 UNION ALL

    SELECT N'Introduction to Algorithms', N'https://covers.openlibrary.org/b/isbn/9780262033848-L.jpg', 0 UNION ALL
    SELECT N'Introduction to Algorithms', N'https://covers.openlibrary.org/b/isbn/9780262046305-L.jpg', 1 UNION ALL
    SELECT N'Introduction to Algorithms', N'https://covers.openlibrary.org/b/isbn/9780262531962-L.jpg', 2 UNION ALL

    SELECT N'Vật lý đại cương A1', N'https://covers.openlibrary.org/b/isbn/9781305952195-L.jpg', 0 UNION ALL
    SELECT N'Vật lý đại cương A1', N'https://covers.openlibrary.org/b/isbn/9781337553292-L.jpg', 1 UNION ALL
    SELECT N'Vật lý đại cương A1', N'https://covers.openlibrary.org/b/isbn/9781285737027-L.jpg', 2 UNION ALL

    SELECT N'Linear Algebra and Its Applications', N'https://covers.openlibrary.org/b/isbn/9780321982384-L.jpg', 0 UNION ALL
    SELECT N'Linear Algebra and Its Applications', N'https://covers.openlibrary.org/b/isbn/9780136871583-L.jpg', 1 UNION ALL
    SELECT N'Linear Algebra and Its Applications', N'https://covers.openlibrary.org/b/isbn/9780201709704-L.jpg', 2 UNION ALL

    SELECT N'Sinh học phân tử', N'https://covers.openlibrary.org/b/isbn/9780321762436-L.jpg', 0 UNION ALL
    SELECT N'Sinh học phân tử', N'https://covers.openlibrary.org/b/isbn/9780321948472-L.jpg', 1 UNION ALL
    SELECT N'Sinh học phân tử', N'https://covers.openlibrary.org/b/isbn/9780805368444-L.jpg', 2 UNION ALL

    SELECT N'Tiếng Anh giao tiếp cơ bản', N'https://covers.openlibrary.org/b/isbn/9780194579858-L.jpg', 0 UNION ALL
    SELECT N'Tiếng Anh giao tiếp cơ bản', N'https://covers.openlibrary.org/b/isbn/9780194373562-L.jpg', 1 UNION ALL
    SELECT N'Tiếng Anh giao tiếp cơ bản', N'https://covers.openlibrary.org/b/isbn/9780194366090-L.jpg', 2 UNION ALL

    SELECT N'Lịch sử Việt Nam hiện đại', N'https://covers.openlibrary.org/b/isbn/9780313341960-L.jpg', 0 UNION ALL
    SELECT N'Data Science Handbook', N'https://covers.openlibrary.org/b/isbn/9781491912058-L.jpg', 0 UNION ALL
    SELECT N'Quản trị Kinh doanh', N'https://covers.openlibrary.org/b/isbn/9780133910292-L.jpg', 0 UNION ALL
    SELECT N'Hóa học hữu cơ nâng cao', N'https://covers.openlibrary.org/b/isbn/9780199270293-L.jpg', 0 UNION ALL
    SELECT N'Tâm lý học nhân cách', N'https://covers.openlibrary.org/b/isbn/9780395755310-L.jpg', 0 UNION ALL
    SELECT N'Cơ học chất lỏng', N'https://covers.openlibrary.org/b/isbn/9780073398273-L.jpg', 0 UNION ALL
    SELECT N'Lập trình Web với React', N'https://covers.openlibrary.org/b/isbn/9781492051725-L.jpg', 0
)
INSERT INTO dbo.ProductImages (ProductID, ImageURL, SortOrder)
SELECT p.ProductID, s.ImageUrl, s.SortOrder
FROM ImageSeeds s
JOIN dbo.Products p ON p.Title = s.Title
WHERE NOT EXISTS (
    SELECT 1 FROM dbo.ProductImages pi
    WHERE pi.ProductID = p.ProductID AND pi.ImageURL = s.ImageUrl
);
GO

-- ============================================================================
-- Seed transactional data (Cart, Orders, Messages, Reviews)
-- ============================================================================
DECLARE @BuyerId INT = (SELECT TOP 1 UserID FROM dbo.Users WHERE UserEmail = 'buyer@educart.local');
DECLARE @SellerId INT = (SELECT TOP 1 UserID FROM dbo.Users WHERE UserEmail = 'seller@educart.local');

DECLARE @CalcId INT = (SELECT TOP 1 ProductID FROM dbo.Products WHERE Title = N'Calculus: Early Transcendentals');
DECLARE @EconId INT = (SELECT TOP 1 ProductID FROM dbo.Products WHERE Title = N'Nguyên lý Kinh tế học');
DECLARE @AlgoId INT = (SELECT TOP 1 ProductID FROM dbo.Products WHERE Title = N'Introduction to Algorithms');
DECLARE @PhysicsId INT = (SELECT TOP 1 ProductID FROM dbo.Products WHERE Title = N'Vật lý đại cương A1');
DECLARE @PhilosophyId INT = (SELECT TOP 1 ProductID FROM dbo.Products WHERE Title = N'Triết học Mác - Lênin');

DECLARE @HoangId INT = (SELECT TOP 1 UserID FROM dbo.Users WHERE UserEmail = 'hoangnam@educart.local');
DECLARE @MinhId INT = (SELECT TOP 1 UserID FROM dbo.Users WHERE UserEmail = 'minhanh@educart.local');
DECLARE @KhoaId INT = (SELECT TOP 1 UserID FROM dbo.Users WHERE UserEmail = 'khoa@educart.local');
DECLARE @LinhId INT = (SELECT TOP 1 UserID FROM dbo.Users WHERE UserEmail = 'phuonglinh@educart.local');

-- 1. Cart Items
IF @BuyerId IS NOT NULL AND @CalcId IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM dbo.CartItems WHERE UserID = @BuyerId AND ProductID = @CalcId)
        INSERT INTO dbo.CartItems (UserID, ProductID, SavedForLater) VALUES (@BuyerId, @CalcId, 0);
END

IF @BuyerId IS NOT NULL AND @EconId IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM dbo.CartItems WHERE UserID = @BuyerId AND ProductID = @EconId)
        INSERT INTO dbo.CartItems (UserID, ProductID, SavedForLater) VALUES (@BuyerId, @EconId, 0);
END

-- 2. Orders
IF @BuyerId IS NOT NULL AND @SellerId IS NOT NULL AND @EconId IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM dbo.Orders WHERE Note = N'seed-order-rent-1')
    BEGIN
        INSERT INTO dbo.Orders (
            BuyerID, SellerID, OrderType, LifecycleState, Status, Note,
            RentStartDate, RentEndDate, RentDays, DailyRate, Deposit, CreatedAt
        )
        VALUES (
            @BuyerId, @SellerId, 'Rent', 'ActiveRental', 'Confirmed', N'seed-order-rent-1',
            DATEADD(day, -3, GETDATE()), DATEADD(day, 27, GETDATE()), 30, 25000, 100000, DATEADD(day, -4, GETDATE())
        );

        DECLARE @OrderRentId INT = SCOPE_IDENTITY();
        INSERT INTO dbo.OrderItems (OrderID, ProductID, Quantity, UnitPrice) VALUES (@OrderRentId, @EconId, 1, 25000);
    END
END

IF @BuyerId IS NOT NULL AND @SellerId IS NOT NULL AND @AlgoId IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM dbo.Orders WHERE Note = N'seed-order-buy-1')
    BEGIN
        INSERT INTO dbo.Orders (
            BuyerID, SellerID, OrderType, LifecycleState, Status, Note, CreatedAt
        )
        VALUES (
            @BuyerId, @SellerId, 'Buy', 'Completed', 'Completed', N'seed-order-buy-1', DATEADD(day, -10, GETDATE())
        );

        DECLARE @OrderBuyId INT = SCOPE_IDENTITY();
        INSERT INTO dbo.OrderItems (OrderID, ProductID, Quantity, UnitPrice) VALUES (@OrderBuyId, @AlgoId, 1, 220000);
    END
END

IF @BuyerId IS NOT NULL AND @SellerId IS NOT NULL AND @PhysicsId IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM dbo.Orders WHERE Note = N'seed-order-buy-2')
    BEGIN
        INSERT INTO dbo.Orders (
            BuyerID, SellerID, OrderType, LifecycleState, Status, Note, CreatedAt
        )
        VALUES (
            @BuyerId, @SellerId, 'Buy', 'PendingPayment', 'Pending', N'seed-order-buy-2', DATEADD(day, -1, GETDATE())
        );

        DECLARE @OrderBuy2Id INT = SCOPE_IDENTITY();
        INSERT INTO dbo.OrderItems (OrderID, ProductID, Quantity, UnitPrice) VALUES (@OrderBuy2Id, @PhysicsId, 1, 110000);
    END
END

IF @BuyerId IS NOT NULL AND @SellerId IS NOT NULL AND @PhilosophyId IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM dbo.Orders WHERE Note = N'seed-order-rent-2')
    BEGIN
        INSERT INTO dbo.Orders (
            BuyerID, SellerID, OrderType, LifecycleState, Status, Note,
            RentStartDate, RentEndDate, RentDays, DailyRate, Deposit, CreatedAt
        )
        VALUES (
            @BuyerId, @SellerId, 'Rent', 'DepositRefunded', 'Completed', N'seed-order-rent-2',
            DATEADD(day, -15, GETDATE()), DATEADD(day, -5, GETDATE()), 10, 15000, 50000, DATEADD(day, -16, GETDATE())
        );

        DECLARE @OrderRent2Id INT = SCOPE_IDENTITY();
        INSERT INTO dbo.OrderItems (OrderID, ProductID, Quantity, UnitPrice) VALUES (@OrderRent2Id, @PhilosophyId, 1, 15000);
    END
END

-- 3. Chat Messages
IF @BuyerId IS NOT NULL AND @HoangId IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM dbo.Messages WHERE SenderID = @HoangId AND ReceiverID = @BuyerId AND Content = N'Bạn có sách Giải tích 1 của James Stewart không?')
        INSERT INTO dbo.Messages (SenderID, ReceiverID, Content, SentAt) VALUES (@HoangId, @BuyerId, N'Bạn có sách Giải tích 1 của James Stewart không?', DATEADD(minute, -12, GETDATE()));

    IF NOT EXISTS (SELECT 1 FROM dbo.Messages WHERE SenderID = @BuyerId AND ReceiverID = @HoangId AND Content = N'Có chứ, còn 2 cuốn, tình trạng rất tốt')
        INSERT INTO dbo.Messages (SenderID, ReceiverID, Content, SentAt) VALUES (@BuyerId, @HoangId, N'Có chứ, còn 2 cuốn, tình trạng rất tốt', DATEADD(minute, -10, GETDATE()));
END

IF @BuyerId IS NOT NULL AND @MinhId IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM dbo.Messages WHERE SenderID = @MinhId AND ReceiverID = @BuyerId AND Content = N'Cảm ơn bạn, sách rất tuyệt vời!')
        INSERT INTO dbo.Messages (SenderID, ReceiverID, Content, SentAt) VALUES (@MinhId, @BuyerId, N'Cảm ơn bạn, sách rất tuyệt vời!', DATEADD(hour, -1, GETDATE()));
END

IF @BuyerId IS NOT NULL AND @KhoaId IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM dbo.Messages WHERE SenderID = @KhoaId AND ReceiverID = @BuyerId AND Content = N'Bạn có còn sách này không?')
        INSERT INTO dbo.Messages (SenderID, ReceiverID, Content, SentAt) VALUES (@KhoaId, @BuyerId, N'Bạn có còn sách này không?', DATEADD(hour, -3, GETDATE()));
END

IF @BuyerId IS NOT NULL AND @LinhId IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM dbo.Messages WHERE SenderID = @LinhId AND ReceiverID = @BuyerId AND Content = N'Mình đã nhận được sách, cảm ơn bạn!')
        INSERT INTO dbo.Messages (SenderID, ReceiverID, Content, SentAt) VALUES (@LinhId, @BuyerId, N'Mình đã nhận được sách, cảm ơn bạn!', DATEADD(day, -1, GETDATE()));
END

-- 4. Reviews (Đã tối ưu hóa luồng biến chạy mượt mà)
IF @BuyerId IS NOT NULL AND @AlgoId IS NOT NULL
BEGIN
    DECLARE @RevOrderId INT = (SELECT TOP 1 OrderID FROM dbo.Orders WHERE Note = N'seed-order-buy-1');
    IF @RevOrderId IS NOT NULL
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM dbo.Reviews WHERE OrderID = @RevOrderId AND ProductID = @AlgoId)
        BEGIN
            INSERT INTO dbo.Reviews (ReviewerID, ProductID, OrderID, Rating, Comment, CreatedAt)
            VALUES (
                @BuyerId, 
                @AlgoId, 
                @RevOrderId, 
                5, 
                N'Sách Calculus và Thuật toán chất lượng cực kỳ tốt, chủ shop bọc lót cẩn thận, rất đáng tiền nha mọi người!', 
                GETDATE()
            );
        END
    END
END
GO