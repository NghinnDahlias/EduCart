USE EduCart;
GO

-- ============================================================================
-- Seed users (sellers/chat demo)
-- Password: password123 (plain for demo, use bcrypt in production)
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

IF NOT EXISTS (SELECT 1 FROM dbo.Users WHERE UserEmail = 'admin@educart.local')
BEGIN
    INSERT INTO dbo.Users
        (UserEmail, FName, LName, Password, Role, Status, IsStudentVerified, EducationLevel, StudentYear)
    VALUES
        ('admin@educart.local', N'EduCart', N'Admin', 'password123', 'Admin', 'Active', 0, NULL, NULL);
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

-- ============================================================================
-- Additional seed data for richer demo scenarios
--   - More rental-focused products
--   - More digital materials
--   - Forum posts for digital resources, homework help, and course Q&A
-- ============================================================================
DECLARE @DemoSellerId INT = (SELECT TOP 1 UserID FROM dbo.Users WHERE UserEmail = 'seller@educart.local');
DECLARE @DemoBuyerId INT = (SELECT TOP 1 UserID FROM dbo.Users WHERE UserEmail = 'buyer@educart.local');
DECLARE @DemoHoangId INT = (SELECT TOP 1 UserID FROM dbo.Users WHERE UserEmail = 'hoangnam@educart.local');
DECLARE @DemoMinhId INT = (SELECT TOP 1 UserID FROM dbo.Users WHERE UserEmail = 'minhanh@educart.local');
DECLARE @DemoKhoaId INT = (SELECT TOP 1 UserID FROM dbo.Users WHERE UserEmail = 'khoa@educart.local');
DECLARE @DemoLinhId INT = (SELECT TOP 1 UserID FROM dbo.Users WHERE UserEmail = 'phuonglinh@educart.local');

;WITH ExtraProductSeeds AS (
    SELECT
        N'Calculus: Early Transcendentals' AS BaseTitle,
        N'Bộ note Giải tích 1 PDF có lời giải chi tiết' AS Title,
        N'CLB Học thuật Bách Khoa' AS Author,
        N'Digital Notes' AS Category,
        N'PDF / Tài liệu số' AS Format,
        N'Theo kỳ' AS TermLabel,
        N'File PDF tổng hợp lý thuyết, công thức quan trọng và 50 bài tập có lời giải cho Giải tích 1. Phù hợp ôn giữa kỳ và cuối kỳ.' AS Description,
        49000 AS Price,
        99000 AS OriginalPrice,
        N'-50%' AS DiscountLabel,
        NULL AS RentalPrice,
        N'Vietnamese' AS Language,
        120 AS Pages,
        N'EduCart Digital' AS Publisher,
        2026 AS PublishYear,
        N'DIGI-CAL1-2026' AS ISBN,
        98 AS [Condition],
        0 AS IsForRent,
        15 AS Stock
    UNION ALL
    SELECT
        N'Introduction to Algorithms',
        N'Thuê giáo trình Thuật toán + sổ tay complexity theo tuần',
        N'Thư viện học nhóm CNTT',
        N'Computer Science',
        N'Sách cứng',
        N'Theo tuần',
        N'Cho thuê combo giáo trình CLRS bản tiếng Anh và sổ tay complexity. Phù hợp cho môn Cấu trúc dữ liệu và Giải thuật.',
        250000,
        420000,
        N'-40%',
        35000,
        N'English',
        1312,
        N'MIT Press',
        2022,
        N'RENT-ALGO-CLRS',
        88,
        1,
        2
    UNION ALL
    SELECT
        N'Vật lý đại cương A1',
        N'Thuê máy tính Casio fx-580VN X kèm sổ công thức Vật lý 1',
        N'Nhóm hỗ trợ Vật lý đại cương',
        N'Learning Tools',
        N'Dụng cụ học tập',
        N'Theo tuần',
        N'Cho thuê máy tính cầm tay dùng tốt, pin mới, tặng kèm sổ công thức Vật lý đại cương A1 để làm bài tập và thi giữa kỳ.',
        180000,
        320000,
        N'-44%',
        25000,
        N'Vietnamese',
        40,
        N'Casio Việt Nam',
        2025,
        N'RENT-CASIO-PHY1',
        93,
        1,
        3
    UNION ALL
    SELECT
        N'Nguyên lý Kinh tế học',
        N'Bộ slide Kinh tế vi mô file PPT + đề ôn tập',
        N'UEH Sharing Hub',
        N'Digital Slides',
        N'PPT / PDF',
        N'Theo kỳ',
        N'Gói tài liệu số gồm slide tóm tắt 12 chương, mindmap và bộ đề ôn tập có đáp án cho Kinh tế vi mô.',
        59000,
        119000,
        N'-50%',
        NULL,
        N'Vietnamese',
        85,
        N'EduCart Digital',
        2026,
        N'DIGI-ECON-2026',
        100,
        0,
        20
    UNION ALL
    SELECT
        N'Lập trình Web với React',
        N'Thuê tài khoản khoá học React 30 ngày + source code mẫu',
        N'Frontend Study Group',
        N'Computer Science',
        N'Tài khoản học online',
        N'30 ngày',
        N'Cho thuê quyền truy cập khoá học React trong 30 ngày, kèm source code mini project về cart, auth và dashboard.',
        199000,
        399000,
        N'-50%',
        45000,
        N'English',
        60,
        N'EduCart Digital',
        2026,
        N'RENT-REACT-30D',
        100,
        1,
        5
    UNION ALL
    SELECT
        N'Linear Algebra and Its Applications',
        N'Bộ đề giữa kỳ Đại số tuyến tính có lời giải scan rõ nét',
        N'Cộng đồng Toán - Tin',
        N'Exam Prep',
        N'PDF / Scan',
        N'Giữa kỳ',
        N'Bộ đề tổng hợp 5 năm gần đây, có lời giải viết tay rõ ràng và phân loại theo dạng bài thường gặp.',
        39000,
        79000,
        N'-51%',
        NULL,
        N'Vietnamese',
        68,
        N'EduCart Digital',
        2026,
        N'DIGI-LA-MIDTERM',
        99,
        0,
        30
    UNION ALL
    SELECT
        N'Cơ học chất lỏng',
        N'Bộ dụng cụ vẽ kỹ thuật gồm compa, thước chữ T và êke',
        N'Studio Cơ khí ứng dụng',
        N'Dụng cụ vẽ kỹ thuật',
        N'Dụng cụ vẽ kỹ thuật',
        N'Dài hạn',
        N'Bộ dụng cụ dùng cho các môn vẽ kỹ thuật và đồ án cơ khí, phù hợp sinh viên năm nhất và năm hai.',
        145000,
        260000,
        N'-44%',
        NULL,
        N'Vietnamese',
        12,
        N'EduCart Supplies',
        2026,
        N'TOOL-DRAW-SET',
        95,
        0,
        8
    UNION ALL
    SELECT
        N'Kỹ thuật mạch điện',
        N'Bộ kit Arduino Uno + breadboard + cảm biến cơ bản',
        N'Maker Lab Campus',
        N'Bộ kit / Board mạch',
        N'Bộ kit / Board mạch',
        N'Theo kỳ',
        N'Bộ kit thực hành gồm Arduino Uno, breadboard, LED, điện trở và một số cảm biến cơ bản cho môn kỹ thuật mạch điện và vi điều khiển.',
        289000,
        420000,
        N'-31%',
        55000,
        N'English',
        24,
        N'EduCart Supplies',
        2026,
        N'KIT-ARDUINO-UNO',
        96,
        1,
        4
    UNION ALL
    SELECT
        N'Bào chế dược phẩm',
        N'Bộ flashcard Dược lý PDF + sơ đồ nhóm thuốc',
        N'Pharmacy Notes Club',
        N'Flashcard học tập',
        N'PDF / Tài liệu số',
        N'Theo kỳ',
        N'Bộ flashcard phục vụ ôn tập dược lý, chia nhóm thuốc, cơ chế tác dụng, chỉ định và tác dụng phụ.',
        69000,
        129000,
        N'-47%',
        NULL,
        N'Vietnamese',
        96,
        N'EduCart Digital',
        2026,
        N'DIGI-PHARMA-CARDS',
        100,
        0,
        25
    UNION ALL
    SELECT
        N'Hình họa căn bản',
        N'Bộ họa cụ sketch cơ bản cho sinh viên mỹ thuật',
        N'Art Corner Student',
        N'Họa cụ mỹ thuật',
        N'Họa cụ mỹ thuật',
        N'Theo kỳ',
        N'Gồm bút chì than, tẩy kneaded, giấy sketch A4 và bảng kê mini. Phù hợp cho môn hình họa và bố cục.',
        175000,
        290000,
        N'-40%',
        30000,
        N'Vietnamese',
        18,
        N'Art Corner',
        2026,
        N'ART-SKETCH-KIT',
        97,
        1,
        6
    UNION ALL
    SELECT
        N'Kỹ năng truyền thông đa phương tiện',
        N'Combo micro thu âm mini + tripod quay bài thuyết trình',
        N'Media Lab Sharing',
        N'Thiết bị media',
        N'Thiết bị media',
        N'Theo tuần',
        N'Phù hợp cho sinh viên làm podcast, bài tập quay video, thuyết trình và sản xuất nội dung cơ bản.',
        210000,
        360000,
        N'-42%',
        40000,
        N'Vietnamese',
        10,
        N'EduCart Supplies',
        2026,
        N'MEDIA-MIC-TRIPOD',
        94,
        1,
        3
)
INSERT INTO dbo.Products (
    SellerID, UniversityID, FacultyID, SubjectID,
    Title, Author, Category, Format, TermLabel,
    Description, Price, OriginalPrice, DiscountLabel, RentalPrice,
    Language, Pages, Publisher, PublishYear, ISBN,
    Condition, IsForRent, Stock, Status, ViewCount
)
SELECT
    @DemoSellerId,
    base.UniversityID,
    base.FacultyID,
    base.SubjectID,
    s.Title,
    s.Author,
    s.Category,
    s.Format,
    s.TermLabel,
    s.Description,
    s.Price,
    s.OriginalPrice,
    s.DiscountLabel,
    s.RentalPrice,
    s.Language,
    s.Pages,
    s.Publisher,
    s.PublishYear,
    s.ISBN,
    s.Condition,
    s.IsForRent,
    s.Stock,
    N'Available',
    0
FROM ExtraProductSeeds s
JOIN dbo.Products base ON base.Title = s.BaseTitle
WHERE @DemoSellerId IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM dbo.Products p WHERE p.Title = s.Title);
GO

;WITH ExtraImageSeeds AS (
    SELECT N'Bộ note Giải tích 1 PDF có lời giải chi tiết' AS Title, N'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80' AS ImageURL, 0 AS SortOrder UNION ALL
    SELECT N'Thuê giáo trình Thuật toán + sổ tay complexity theo tuần', N'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=900&q=80', 0 UNION ALL
    SELECT N'Thuê máy tính Casio fx-580VN X kèm sổ công thức Vật lý 1', N'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=900&q=80', 0 UNION ALL
    SELECT N'Bộ slide Kinh tế vi mô file PPT + đề ôn tập', N'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80', 0 UNION ALL
    SELECT N'Thuê tài khoản khoá học React 30 ngày + source code mẫu', N'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80', 0 UNION ALL
    SELECT N'Bộ đề giữa kỳ Đại số tuyến tính có lời giải scan rõ nét', N'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=900&q=80', 0 UNION ALL
    SELECT N'Bộ dụng cụ vẽ kỹ thuật gồm compa, thước chữ T và êke', N'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80', 0 UNION ALL
    SELECT N'Bộ kit Arduino Uno + breadboard + cảm biến cơ bản', N'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80', 0 UNION ALL
    SELECT N'Bộ flashcard Dược lý PDF + sơ đồ nhóm thuốc', N'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=900&q=80', 0 UNION ALL
    SELECT N'Bộ họa cụ sketch cơ bản cho sinh viên mỹ thuật', N'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80', 0 UNION ALL
    SELECT N'Combo micro thu âm mini + tripod quay bài thuyết trình', N'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80', 0
)
INSERT INTO dbo.ProductImages (ProductID, ImageURL, SortOrder)
SELECT p.ProductID, s.ImageURL, s.SortOrder
FROM ExtraImageSeeds s
JOIN dbo.Products p ON p.Title = s.Title
WHERE NOT EXISTS (
    SELECT 1
    FROM dbo.ProductImages pi
    WHERE pi.ProductID = p.ProductID AND pi.ImageURL = s.ImageURL
);
GO

DECLARE @ForumBuyerId INT = (SELECT TOP 1 UserID FROM dbo.Users WHERE UserEmail = 'buyer@educart.local');
DECLARE @ForumHoangId INT = (SELECT TOP 1 UserID FROM dbo.Users WHERE UserEmail = 'hoangnam@educart.local');
DECLARE @ForumMinhId INT = (SELECT TOP 1 UserID FROM dbo.Users WHERE UserEmail = 'minhanh@educart.local');
DECLARE @ForumKhoaId INT = (SELECT TOP 1 UserID FROM dbo.Users WHERE UserEmail = 'khoa@educart.local');
DECLARE @ForumLinhId INT = (SELECT TOP 1 UserID FROM dbo.Users WHERE UserEmail = 'phuonglinh@educart.local');

;WITH ForumPostSeeds AS (
    SELECT
        N'Xin bộ tài liệu số Giải tích 1 để ôn thi giữa kỳ' AS Title,
        N'Mọi người ai có file PDF note Giải tích 1, đặc biệt phần tích phân từng phần và ứng dụng của đạo hàm thì cho mình xin với. Nếu có luôn bộ bài tập mức cơ bản đến trung bình càng tốt.' AS Content,
        N'digital-material,calculus,midterm' AS Tags,
        1 AS IsPinned,
        14 AS VotesCount,
        120 AS ViewCount,
        @ForumHoangId AS AuthorID,
        (SELECT TOP 1 SubjectID FROM dbo.Products WHERE Title = N'Calculus: Early Transcendentals') AS SubjectID
    UNION ALL
    SELECT
        N'Hỏi bài Cấu trúc dữ liệu: vì sao heap sort không stable?' ,
        N'Mình đang làm slide thuyết trình về các thuật toán sắp xếp. Có thể giải thích ngắn gọn giúp mình vì sao heap sort không stable và có ví dụ trực quan nào dễ trình bày trên lớp không?' ,
        N'homework,algorithms,data-structures' ,
        0 ,
        11 ,
        86 ,
        @ForumMinhId ,
        (SELECT TOP 1 SubjectID FROM dbo.Products WHERE Title = N'Introduction to Algorithms')
    UNION ALL
    SELECT
        N'Môn Kinh tế vi mô học thầy nào dễ theo và có tài liệu tốt?' ,
        N'Mình sắp đăng ký môn Kinh tế vi mô. Bạn nào đã học rồi cho mình xin review giảng viên, cách tính điểm và tài liệu nào nên đọc trước để đỡ ngợp với đồ thị cung cầu.' ,
        N'course-advice,economics,study-plan' ,
        0 ,
        9 ,
        74 ,
        @ForumLinhId ,
        (SELECT TOP 1 SubjectID FROM dbo.Products WHERE Title = N'Nguyên lý Kinh tế học')
    UNION ALL
    SELECT
        N'Có ai cần chia sẻ tài liệu số React cho môn Phát triển ứng dụng Web không?' ,
        N'Mình đang có bộ source code React gồm login, cart, forum mini và dashboard. Nếu mọi người cần mình có thể up demo lên diễn đàn hoặc chia sẻ theo từng phần để cùng học.' ,
        N'react,web-dev,digital-material' ,
        0 ,
        17 ,
        98 ,
        @ForumKhoaId ,
        (SELECT TOP 1 SubjectID FROM dbo.Products WHERE Title = N'Lập trình Web với React')
    UNION ALL
    SELECT
        N'Hỏi môn Vật lý 1: nên thuê máy tính hay mua luôn?' ,
        N'Mình học Vật lý đại cương A1 trong 1 học kỳ thôi. Theo mọi người thì nên thuê máy tính Casio vài tuần trước kỳ thi hay mua luôn một chiếc mới để dùng lâu dài?' ,
        N'physics,study-tools,rental' ,
        0 ,
        8 ,
        65 ,
        @ForumBuyerId ,
        (SELECT TOP 1 SubjectID FROM dbo.Products WHERE Title = N'Vật lý đại cương A1')
)
INSERT INTO dbo.Posts (
    AuthorID, SubjectID, Title, Content, Tags,
    VotesCount, CommentsCount, ViewCount, IsActive, IsPinned, CreatedAt
)
SELECT
    s.AuthorID,
    s.SubjectID,
    s.Title,
    s.Content,
    s.Tags,
    s.VotesCount,
    0,
    s.ViewCount,
    1,
    s.IsPinned,
    DATEADD(hour, -ROW_NUMBER() OVER (ORDER BY s.Title) * 9, GETDATE())
FROM ForumPostSeeds s
WHERE s.AuthorID IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM dbo.Posts p WHERE p.Title = s.Title);
GO

DECLARE @CommentSellerId INT = (SELECT TOP 1 UserID FROM dbo.Users WHERE UserEmail = 'seller@educart.local');
DECLARE @CommentBuyerId INT = (SELECT TOP 1 UserID FROM dbo.Users WHERE UserEmail = 'buyer@educart.local');
DECLARE @CommentHoangId INT = (SELECT TOP 1 UserID FROM dbo.Users WHERE UserEmail = 'hoangnam@educart.local');
DECLARE @CommentMinhId INT = (SELECT TOP 1 UserID FROM dbo.Users WHERE UserEmail = 'minhanh@educart.local');
DECLARE @CommentKhoaId INT = (SELECT TOP 1 UserID FROM dbo.Users WHERE UserEmail = 'khoa@educart.local');
DECLARE @CommentLinhId INT = (SELECT TOP 1 UserID FROM dbo.Users WHERE UserEmail = 'phuonglinh@educart.local');

DECLARE @PostCalc INT = (SELECT TOP 1 PostID FROM dbo.Posts WHERE Title = N'Xin bộ tài liệu số Giải tích 1 để ôn thi giữa kỳ');
DECLARE @PostAlgo INT = (SELECT TOP 1 PostID FROM dbo.Posts WHERE Title = N'Hỏi bài Cấu trúc dữ liệu: vì sao heap sort không stable?');
DECLARE @PostEcon INT = (SELECT TOP 1 PostID FROM dbo.Posts WHERE Title = N'Môn Kinh tế vi mô học thầy nào dễ theo và có tài liệu tốt?');
DECLARE @PostReact INT = (SELECT TOP 1 PostID FROM dbo.Posts WHERE Title = N'Có ai cần chia sẻ tài liệu số React cho môn Phát triển ứng dụng Web không?');
DECLARE @PostPhysics INT = (SELECT TOP 1 PostID FROM dbo.Posts WHERE Title = N'Hỏi môn Vật lý 1: nên thuê máy tính hay mua luôn?');

IF @PostCalc IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM dbo.Comments WHERE PostID = @PostCalc AND Content = N'Mình vừa up một bộ PDF note khá ổn, bạn check phần sản phẩm tài liệu số mới trên chợ nhé.')
        INSERT INTO dbo.Comments (PostID, AuthorID, Content, VotesCount, CreatedAt)
        VALUES (@PostCalc, @CommentSellerId, N'Mình vừa up một bộ PDF note khá ổn, bạn check phần sản phẩm tài liệu số mới trên chợ nhé.', 4, DATEADD(hour, -3, GETDATE()));

    IF NOT EXISTS (SELECT 1 FROM dbo.Comments WHERE PostID = @PostCalc AND Content = N'Mình cần thêm phần bài tập ứng dụng đạo hàm, nếu ai có file scan đề cũ thì cho mình xin luôn với.')
        INSERT INTO dbo.Comments (PostID, AuthorID, Content, VotesCount, CreatedAt)
        VALUES (@PostCalc, @CommentBuyerId, N'Mình cần thêm phần bài tập ứng dụng đạo hàm, nếu ai có file scan đề cũ thì cho mình xin luôn với.', 2, DATEADD(hour, -2, GETDATE()));
END

IF @PostAlgo IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM dbo.Comments WHERE PostID = @PostAlgo AND Content = N'Vì heap sort có bước swap phần tử gốc với phần tử cuối nên thứ tự tương đối của các phần tử bằng nhau có thể bị đảo.')
        INSERT INTO dbo.Comments (PostID, AuthorID, Content, VotesCount, CreatedAt)
        VALUES (@PostAlgo, @CommentKhoaId, N'Vì heap sort có bước swap phần tử gốc với phần tử cuối nên thứ tự tương đối của các phần tử bằng nhau có thể bị đảo.', 6, DATEADD(hour, -4, GETDATE()));
END

IF @PostEcon IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM dbo.Comments WHERE PostID = @PostEcon AND Content = N'Nếu bạn mới học thì nên chọn lớp có slide rõ ràng và chịu khó làm bài tập đồ thị hằng tuần.')
        INSERT INTO dbo.Comments (PostID, AuthorID, Content, VotesCount, CreatedAt)
        VALUES (@PostEcon, @CommentMinhId, N'Nếu bạn mới học thì nên chọn lớp có slide rõ ràng và chịu khó làm bài tập đồ thị hằng tuần.', 3, DATEADD(hour, -5, GETDATE()));
END

IF @PostReact IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM dbo.Comments WHERE PostID = @PostReact AND Content = N'Bạn up giúp phần auth và quản lý state giỏ hàng trước đi, nhóm mình đang cần đúng 2 phần đó.')
        INSERT INTO dbo.Comments (PostID, AuthorID, Content, VotesCount, CreatedAt)
        VALUES (@PostReact, @CommentHoangId, N'Bạn up giúp phần auth và quản lý state giỏ hàng trước đi, nhóm mình đang cần đúng 2 phần đó.', 5, DATEADD(hour, -6, GETDATE()));
END

IF @PostPhysics IS NOT NULL
BEGIN
    IF NOT EXISTS (SELECT 1 FROM dbo.Comments WHERE PostID = @PostPhysics AND Content = N'Nếu bạn chỉ học 1 học kỳ thì thuê sẽ tiết kiệm hơn, nhất là giai đoạn cận thi mới dùng nhiều.')
        INSERT INTO dbo.Comments (PostID, AuthorID, Content, VotesCount, CreatedAt)
        VALUES (@PostPhysics, @CommentLinhId, N'Nếu bạn chỉ học 1 học kỳ thì thuê sẽ tiết kiệm hơn, nhất là giai đoạn cận thi mới dùng nhiều.', 4, DATEADD(hour, -1, GETDATE()));
END

UPDATE p
SET CommentsCount = c.CommentCount
FROM dbo.Posts p
JOIN (
    SELECT PostID, COUNT(*) AS CommentCount
    FROM dbo.Comments
    WHERE IsActive = 1
    GROUP BY PostID
) c ON c.PostID = p.PostID
WHERE p.PostID IN (@PostCalc, @PostAlgo, @PostEcon, @PostReact, @PostPhysics);
GO

-- ============================================================================
-- Fallback forum seeds for demo stability
-- ============================================================================
DECLARE @FsBuyerId INT = (SELECT TOP 1 UserID FROM dbo.Users WHERE UserEmail = 'buyer@educart.local');
DECLARE @FsSellerId INT = (SELECT TOP 1 UserID FROM dbo.Users WHERE UserEmail = 'seller@educart.local');
DECLARE @FsHoangId INT = (SELECT TOP 1 UserID FROM dbo.Users WHERE UserEmail = 'hoangnam@educart.local');
DECLARE @FsMinhId INT = (SELECT TOP 1 UserID FROM dbo.Users WHERE UserEmail = 'minhanh@educart.local');
DECLARE @FsKhoaId INT = (SELECT TOP 1 UserID FROM dbo.Users WHERE UserEmail = 'khoa@educart.local');
DECLARE @FsLinhId INT = (SELECT TOP 1 UserID FROM dbo.Users WHERE UserEmail = 'phuonglinh@educart.local');

DECLARE @FsCalcSubjectId INT = (SELECT TOP 1 SubjectID FROM dbo.Products WHERE Title = N'Calculus: Early Transcendentals');
DECLARE @FsAlgoSubjectId INT = (SELECT TOP 1 SubjectID FROM dbo.Products WHERE Title = N'Introduction to Algorithms');
DECLARE @FsEconSubjectId INT = (SELECT TOP 1 SubjectID FROM dbo.Products WHERE Title = N'Nguyên lý Kinh tế học');
DECLARE @FsReactSubjectId INT = (SELECT TOP 1 SubjectID FROM dbo.Products WHERE Title = N'Lập trình Web với React');
DECLARE @FsPhysicsSubjectId INT = (SELECT TOP 1 SubjectID FROM dbo.Products WHERE Title = N'Vật lý đại cương A1');

IF NOT EXISTS (SELECT 1 FROM dbo.Posts WHERE Title = N'Xin bộ tài liệu số Giải tích 1 để ôn thi giữa kỳ')
    INSERT INTO dbo.Posts (AuthorID, SubjectID, Title, Content, Tags, VotesCount, CommentsCount, ViewCount, IsActive, IsPinned, CreatedAt)
    VALUES (@FsHoangId, @FsCalcSubjectId, N'Xin bộ tài liệu số Giải tích 1 để ôn thi giữa kỳ',
        N'Mọi người ai có file PDF note Giải tích 1, đặc biệt phần tích phân từng phần và ứng dụng của đạo hàm thì cho mình xin với. Nếu có luôn bộ bài tập mức cơ bản đến trung bình càng tốt.',
        N'digital-material,calculus,midterm', 14, 0, 120, 1, 1, DATEADD(hour, -45, GETDATE()));

IF NOT EXISTS (SELECT 1 FROM dbo.Posts WHERE Title = N'Hỏi bài Cấu trúc dữ liệu: vì sao heap sort không stable?')
    INSERT INTO dbo.Posts (AuthorID, SubjectID, Title, Content, Tags, VotesCount, CommentsCount, ViewCount, IsActive, IsPinned, CreatedAt)
    VALUES (@FsMinhId, @FsAlgoSubjectId, N'Hỏi bài Cấu trúc dữ liệu: vì sao heap sort không stable?',
        N'Mình đang làm slide thuyết trình về các thuật toán sắp xếp. Có thể giải thích ngắn gọn giúp mình vì sao heap sort không stable và có ví dụ trực quan nào dễ trình bày trên lớp không?',
        N'homework,algorithms,data-structures', 11, 0, 86, 1, 0, DATEADD(hour, -36, GETDATE()));

IF NOT EXISTS (SELECT 1 FROM dbo.Posts WHERE Title = N'Môn Kinh tế vi mô học thầy nào dễ theo và có tài liệu tốt?')
    INSERT INTO dbo.Posts (AuthorID, SubjectID, Title, Content, Tags, VotesCount, CommentsCount, ViewCount, IsActive, IsPinned, CreatedAt)
    VALUES (@FsLinhId, @FsEconSubjectId, N'Môn Kinh tế vi mô học thầy nào dễ theo và có tài liệu tốt?',
        N'Mình sắp đăng ký môn Kinh tế vi mô. Bạn nào đã học rồi cho mình xin review giảng viên, cách tính điểm và tài liệu nào nên đọc trước để đỡ ngợp với đồ thị cung cầu.',
        N'course-advice,economics,study-plan', 9, 0, 74, 1, 0, DATEADD(hour, -27, GETDATE()));

IF NOT EXISTS (SELECT 1 FROM dbo.Posts WHERE Title = N'Có ai cần chia sẻ tài liệu số React cho môn Phát triển ứng dụng Web không?')
    INSERT INTO dbo.Posts (AuthorID, SubjectID, Title, Content, Tags, VotesCount, CommentsCount, ViewCount, IsActive, IsPinned, CreatedAt)
    VALUES (@FsKhoaId, @FsReactSubjectId, N'Có ai cần chia sẻ tài liệu số React cho môn Phát triển ứng dụng Web không?',
        N'Mình đang có bộ source code React gồm login, cart, forum mini và dashboard. Nếu mọi người cần mình có thể up demo lên diễn đàn hoặc chia sẻ theo từng phần để cùng học.',
        N'react,web-dev,digital-material', 17, 0, 98, 1, 0, DATEADD(hour, -18, GETDATE()));

IF NOT EXISTS (SELECT 1 FROM dbo.Posts WHERE Title = N'Hỏi môn Vật lý 1: nên thuê máy tính hay mua luôn?')
    INSERT INTO dbo.Posts (AuthorID, SubjectID, Title, Content, Tags, VotesCount, CommentsCount, ViewCount, IsActive, IsPinned, CreatedAt)
    VALUES (@FsBuyerId, @FsPhysicsSubjectId, N'Hỏi môn Vật lý 1: nên thuê máy tính hay mua luôn?',
        N'Mình học Vật lý đại cương A1 trong 1 học kỳ thôi. Theo mọi người thì nên thuê máy tính Casio vài tuần trước kỳ thi hay mua luôn một chiếc mới để dùng lâu dài?',
        N'physics,study-tools,rental', 8, 0, 65, 1, 0, DATEADD(hour, -9, GETDATE()));
GO

DECLARE @FPostCalc INT = (SELECT TOP 1 PostID FROM dbo.Posts WHERE Title = N'Xin bộ tài liệu số Giải tích 1 để ôn thi giữa kỳ');
DECLARE @FPostAlgo INT = (SELECT TOP 1 PostID FROM dbo.Posts WHERE Title = N'Hỏi bài Cấu trúc dữ liệu: vì sao heap sort không stable?');
DECLARE @FPostEcon INT = (SELECT TOP 1 PostID FROM dbo.Posts WHERE Title = N'Môn Kinh tế vi mô học thầy nào dễ theo và có tài liệu tốt?');
DECLARE @FPostReact INT = (SELECT TOP 1 PostID FROM dbo.Posts WHERE Title = N'Có ai cần chia sẻ tài liệu số React cho môn Phát triển ứng dụng Web không?');
DECLARE @FPostPhysics INT = (SELECT TOP 1 PostID FROM dbo.Posts WHERE Title = N'Hỏi môn Vật lý 1: nên thuê máy tính hay mua luôn?');

IF NOT EXISTS (SELECT 1 FROM dbo.Comments WHERE PostID = @FPostCalc AND Content = N'Mình vừa up một bộ PDF note khá ổn, bạn check phần sản phẩm tài liệu số mới trên chợ nhé.')
    INSERT INTO dbo.Comments (PostID, AuthorID, Content, VotesCount, CreatedAt)
    VALUES (@FPostCalc, (SELECT TOP 1 UserID FROM dbo.Users WHERE UserEmail = 'seller@educart.local'),
        N'Mình vừa up một bộ PDF note khá ổn, bạn check phần sản phẩm tài liệu số mới trên chợ nhé.', 4, DATEADD(hour, -3, GETDATE()));

IF NOT EXISTS (SELECT 1 FROM dbo.Comments WHERE PostID = @FPostCalc AND Content = N'Mình cần thêm phần bài tập ứng dụng đạo hàm, nếu ai có file scan đề cũ thì cho mình xin luôn với.')
    INSERT INTO dbo.Comments (PostID, AuthorID, Content, VotesCount, CreatedAt)
    VALUES (@FPostCalc, (SELECT TOP 1 UserID FROM dbo.Users WHERE UserEmail = 'buyer@educart.local'),
        N'Mình cần thêm phần bài tập ứng dụng đạo hàm, nếu ai có file scan đề cũ thì cho mình xin luôn với.', 2, DATEADD(hour, -2, GETDATE()));

IF NOT EXISTS (SELECT 1 FROM dbo.Comments WHERE PostID = @FPostAlgo AND Content = N'Vì heap sort có bước swap phần tử gốc với phần tử cuối nên thứ tự tương đối của các phần tử bằng nhau có thể bị đảo.')
    INSERT INTO dbo.Comments (PostID, AuthorID, Content, VotesCount, CreatedAt)
    VALUES (@FPostAlgo, (SELECT TOP 1 UserID FROM dbo.Users WHERE UserEmail = 'khoa@educart.local'),
        N'Vì heap sort có bước swap phần tử gốc với phần tử cuối nên thứ tự tương đối của các phần tử bằng nhau có thể bị đảo.', 6, DATEADD(hour, -4, GETDATE()));

IF NOT EXISTS (SELECT 1 FROM dbo.Comments WHERE PostID = @FPostEcon AND Content = N'Nếu bạn mới học thì nên chọn lớp có slide rõ ràng và chịu khó làm bài tập đồ thị hằng tuần.')
    INSERT INTO dbo.Comments (PostID, AuthorID, Content, VotesCount, CreatedAt)
    VALUES (@FPostEcon, (SELECT TOP 1 UserID FROM dbo.Users WHERE UserEmail = 'minhanh@educart.local'),
        N'Nếu bạn mới học thì nên chọn lớp có slide rõ ràng và chịu khó làm bài tập đồ thị hằng tuần.', 3, DATEADD(hour, -5, GETDATE()));

IF NOT EXISTS (SELECT 1 FROM dbo.Comments WHERE PostID = @FPostReact AND Content = N'Bạn up giúp phần auth và quản lý state giỏ hàng trước đi, nhóm mình đang cần đúng 2 phần đó.')
    INSERT INTO dbo.Comments (PostID, AuthorID, Content, VotesCount, CreatedAt)
    VALUES (@FPostReact, (SELECT TOP 1 UserID FROM dbo.Users WHERE UserEmail = 'hoangnam@educart.local'),
        N'Bạn up giúp phần auth và quản lý state giỏ hàng trước đi, nhóm mình đang cần đúng 2 phần đó.', 5, DATEADD(hour, -6, GETDATE()));

IF NOT EXISTS (SELECT 1 FROM dbo.Comments WHERE PostID = @FPostPhysics AND Content = N'Nếu bạn chỉ học 1 học kỳ thì thuê sẽ tiết kiệm hơn, nhất là giai đoạn cận thi mới dùng nhiều.')
    INSERT INTO dbo.Comments (PostID, AuthorID, Content, VotesCount, CreatedAt)
    VALUES (@FPostPhysics, (SELECT TOP 1 UserID FROM dbo.Users WHERE UserEmail = 'phuonglinh@educart.local'),
        N'Nếu bạn chỉ học 1 học kỳ thì thuê sẽ tiết kiệm hơn, nhất là giai đoạn cận thi mới dùng nhiều.', 4, DATEADD(hour, -1, GETDATE()));

UPDATE p
SET CommentsCount = ISNULL(c.CommentCount, 0)
FROM dbo.Posts p
LEFT JOIN (
    SELECT PostID, COUNT(*) AS CommentCount
    FROM dbo.Comments
    WHERE IsActive = 1
    GROUP BY PostID
) c ON c.PostID = p.PostID
WHERE p.PostID IN (@FPostCalc, @FPostAlgo, @FPostEcon, @FPostReact, @FPostPhysics);
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
-- Seed faculties
-- ============================================================================
;WITH FacultySeeds AS (
    SELECT N'Đại Học Bách Khoa TP.HCM' AS UniversityName, N'Khoa Khoa học Ứng dụng' AS FacultyName UNION ALL
    SELECT N'Đại Học Bách Khoa TP.HCM', N'Khoa Khoa học & Kỹ thuật Máy tính' UNION ALL
    SELECT N'Đại Học Bách Khoa TP.HCM', N'Khoa Kỹ thuật Hóa học' UNION ALL
    SELECT N'Đại Học Bách Khoa TP.HCM', N'Khoa Kỹ thuật Giao thông' UNION ALL
    SELECT N'Đại Học Bách Khoa TP.HCM', N'Khoa Cơ khí' UNION ALL
    SELECT N'Đại Học Bách Khoa TP.HCM', N'Khoa Điện - Điện tử' UNION ALL
    SELECT N'Đại Học Bách Khoa TP.HCM', N'Khoa Kiến trúc & Thiết kế' UNION ALL

    SELECT N'ĐH Kinh tế TP.HCM', N'Khoa Kinh tế' UNION ALL
    SELECT N'ĐH Kinh tế TP.HCM', N'Khoa Quản trị' UNION ALL
    SELECT N'ĐH Kinh tế TP.HCM', N'Khoa Marketing' UNION ALL
    SELECT N'ĐH Kinh tế TP.HCM', N'Khoa Tài chính' UNION ALL

    SELECT N'ĐH Khoa học Tự nhiên', N'Khoa Hóa học' UNION ALL
    SELECT N'ĐH Khoa học Tự nhiên', N'Khoa Toán - Tin học' UNION ALL
    SELECT N'ĐH Khoa học Tự nhiên', N'Khoa Sinh học' UNION ALL
    SELECT N'ĐH Khoa học Tự nhiên', N'Khoa Vật lý - Vật lý kỹ thuật' UNION ALL

    SELECT N'ĐH Quốc gia TP.HCM', N'Khoa Lý luận Chính trị' UNION ALL

    SELECT N'ĐH Y Dược TP.HCM', N'Khoa Y' UNION ALL
    SELECT N'ĐH Y Dược TP.HCM', N'Khoa Dược' UNION ALL
    SELECT N'ĐH Sư phạm TP.HCM', N'Khoa Tiếng Anh' UNION ALL
    SELECT N'ĐH Sư phạm TP.HCM', N'Khoa Mỹ thuật' UNION ALL

    SELECT N'ĐH KHXH & Nhân văn', N'Khoa Lịch sử' UNION ALL
    SELECT N'ĐH KHXH & Nhân văn', N'Khoa Tâm lý học' UNION ALL
    SELECT N'ĐH KHXH & Nhân văn', N'Khoa Truyền thông' UNION ALL

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
-- Seed subjects
-- ============================================================================
;WITH SubjectSeeds AS (
    SELECT N'Đại Học Bách Khoa TP.HCM' AS UniversityName, N'Khoa Khoa học Ứng dụng' AS FacultyName, NULL AS SubjectCode, N'All' AS SubjectName UNION ALL
    SELECT N'Đại Học Bách Khoa TP.HCM', N'Khoa Khoa học Ứng dụng', NULL, N'Vật lý 1' UNION ALL
    SELECT N'Đại Học Bách Khoa TP.HCM', N'Khoa Khoa học Ứng dụng', NULL, N'Xác suất thống kê' UNION ALL
    SELECT N'Đại Học Bách Khoa TP.HCM', N'Khoa Khoa học & Kỹ thuật Máy tính', NULL, N'Cấu trúc dữ liệu và Giải thuật' UNION ALL
    SELECT N'Đại Học Bách Khoa TP.HCM', N'Khoa Khoa học & Kỹ thuật Máy tính', NULL, N'Nhập môn Trí tuệ nhân tạo' UNION ALL
    SELECT N'Đại Học Bách Khoa TP.HCM', N'Khoa Khoa học & Kỹ thuật Máy tính', NULL, N'Mạng máy tính' UNION ALL
    SELECT N'Đại Học Bách Khoa TP.HCM', N'Khoa Kỹ thuật Hóa học', NULL, N'Hóa hữu cơ' UNION ALL
    SELECT N'Đại Học Bách Khoa TP.HCM', N'Khoa Kỹ thuật Hóa học', NULL, N'Thí nghiệm hóa phân tích' UNION ALL
    SELECT N'Đại Học Bách Khoa TP.HCM', N'Khoa Kỹ thuật Giao thông', NULL, N'Cơ học chất lỏng' UNION ALL
    SELECT N'Đại Học Bách Khoa TP.HCM', N'Khoa Cơ khí', NULL, N'Vẽ kỹ thuật cơ khí' UNION ALL
    SELECT N'Đại Học Bách Khoa TP.HCM', N'Khoa Cơ khí', NULL, N'Thực hành CAD/CAM' UNION ALL
    SELECT N'Đại Học Bách Khoa TP.HCM', N'Khoa Điện - Điện tử', NULL, N'Kỹ thuật mạch điện' UNION ALL
    SELECT N'Đại Học Bách Khoa TP.HCM', N'Khoa Điện - Điện tử', NULL, N'Vi điều khiển cơ bản' UNION ALL
    SELECT N'Đại Học Bách Khoa TP.HCM', N'Khoa Kiến trúc & Thiết kế', NULL, N'Cơ sở tạo hình' UNION ALL
    SELECT N'Đại Học Bách Khoa TP.HCM', N'Khoa Kiến trúc & Thiết kế', NULL, N'Đồ án thiết kế kỹ thuật' UNION ALL

    SELECT N'ĐH Kinh tế TP.HCM', N'Khoa Kinh tế', NULL, N'Kinh tế vi mô' UNION ALL
    SELECT N'ĐH Kinh tế TP.HCM', N'Khoa Quản trị', NULL, N'Quản trị kinh doanh' UNION ALL
    SELECT N'ĐH Kinh tế TP.HCM', N'Khoa Marketing', NULL, N'Nguyên lý Marketing' UNION ALL
    SELECT N'ĐH Kinh tế TP.HCM', N'Khoa Tài chính', NULL, N'Tài chính doanh nghiệp' UNION ALL

    SELECT N'ĐH Khoa học Tự nhiên', N'Khoa Hóa học', NULL, N'Hóa học đại cương' UNION ALL
    SELECT N'ĐH Khoa học Tự nhiên', N'Khoa Toán - Tin học', NULL, N'Đại số tuyến tính' UNION ALL
    SELECT N'ĐH Khoa học Tự nhiên', N'Khoa Toán - Tin học', NULL, N'Giải tích số' UNION ALL
    SELECT N'ĐH Khoa học Tự nhiên', N'Khoa Sinh học', NULL, N'Sinh học phân tử' UNION ALL
    SELECT N'ĐH Khoa học Tự nhiên', N'Khoa Vật lý - Vật lý kỹ thuật', NULL, N'Quang học ứng dụng' UNION ALL

    SELECT N'ĐH Quốc gia TP.HCM', N'Khoa Lý luận Chính trị', NULL, N'Triết học Mác - Lênin' UNION ALL

    SELECT N'ĐH Y Dược TP.HCM', N'Khoa Y', NULL, N'Sinh học đại cương' UNION ALL
    SELECT N'ĐH Y Dược TP.HCM', N'Khoa Dược', NULL, N'Bào chế dược phẩm' UNION ALL
    SELECT N'ĐH Sư phạm TP.HCM', N'Khoa Tiếng Anh', NULL, N'Anh văn cơ bản' UNION ALL
    SELECT N'ĐH Sư phạm TP.HCM', N'Khoa Mỹ thuật', NULL, N'Hình họa căn bản' UNION ALL
    SELECT N'ĐH Sư phạm TP.HCM', N'Khoa Mỹ thuật', NULL, N'Màu sắc và bố cục' UNION ALL

    SELECT N'ĐH KHXH & Nhân văn', N'Khoa Lịch sử', NULL, N'Lịch sử Việt Nam' UNION ALL
    SELECT N'ĐH KHXH & Nhân văn', N'Khoa Tâm lý học', NULL, N'Tâm lý học đại cương' UNION ALL
    SELECT N'ĐH KHXH & Nhân văn', N'Khoa Truyền thông', NULL, N'Kỹ năng truyền thông đa phương tiện' UNION ALL

    SELECT N'ĐH Công nghệ Thông tin', N'Khoa Khoa học Dữ liệu', NULL, N'Nhập môn Khoa học Dữ liệu' UNION ALL
    SELECT N'ĐH Công nghệ Thông tin', N'Khoa Kỹ thuật Phần mềm', NULL, N'Phát triển ứng dụng Web' UNION ALL
    SELECT N'ĐH Công nghệ Thông tin', N'Khoa Kỹ thuật Phần mềm', NULL, N'Kiểm thử phần mềm' UNION ALL

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
-- Seed products
-- ============================================================================
;WITH ProductSeeds AS (
    SELECT 1 AS ProductId, N'Calculus: Early Transcendentals' AS Title, N'James Stewart' AS Author,
        N'Calculus' AS Category, N'Sách cứng' AS Format, N'Theo kỳ' AS TermLabel,
        125000 AS Price, 250000 AS OriginalPrice, N'-50%' AS DiscountLabel, NULL AS RentalPrice,
        N'English' AS Language, 1200 AS Pages, N'Cengage Learning' AS Publisher,
        2023 AS PublishYear, N'978-0357700013' AS ISBN,
        4.5 AS Rating, 128 AS ReviewsCount,
        95 AS Condition, 0 AS IsForRent,
        N'Đại Học Bách Khoa TP.HCM' AS UniversityName, N'Khoa Khoa học Ứng dụng' AS FacultyName, N'All' AS SubjectName,
        N'https://covers.openlibrary.org/b/isbn/9781285741550-L.jpg' AS ImageUrl
    UNION ALL
    SELECT 2, N'Nguyên lý Kinh tế học', N'N. Gregory Mankiw',
        N'Economics', N'E-book', N'Theo kỳ',
        25000, 50000, N'-50%', 25000,
        N'Vietnamese', 850, N'NXB Khoa học Xã hội',
        2022, N'978-8014652741',
        4.8, 95,
        100, 1,
        N'ĐH Kinh tế TP.HCM', N'Khoa Kinh tế', N'Kinh tế vi mô',
        N'https://covers.openlibrary.org/b/isbn/9781305585126-L.jpg'
    UNION ALL
    SELECT 3, N'Chemistry: A Molecular Approach', N'Nivaldo Jr. Tro',
        N'Chemistry', N'Sách cứng', N'Theo kỳ',
        180000, 360000, N'-50%', NULL,
        N'English', 1050, N'Pearson',
        2023, N'978-0135204771',
        4.6, 112,
        90, 0,
        N'ĐH Khoa học Tự nhiên', N'Khoa Hóa học', N'Hóa học đại cương',
        N'https://covers.openlibrary.org/b/isbn/9780321809247-L.jpg'
    UNION ALL
    SELECT 4, N'Triết học Mác - Lênin', N'NXB Lao động',
        N'Philosophy', N'Sách mềm', N'Theo kỳ',
        15000, 30000, N'-50%', 15000,
        N'Vietnamese', 620, N'NXB Lao động',
        2021, N'978-8016284721',
        4.2, 67,
        85, 1,
        N'ĐH Quốc gia TP.HCM', N'Khoa Lý luận Chính trị', N'Triết học Mác - Lênin',
        N'https://covers.openlibrary.org/b/isbn/9780717804405-L.jpg'
    UNION ALL
    SELECT 5, N'Introduction to Algorithms', N'Thomas H. Cormen',
        N'Computer Science', N'E-book', N'Dài hạn',
        220000, 440000, N'-50%', NULL,
        N'English', 1312, N'MIT Press',
        2022, N'978-0262046305',
        4.9, 256,
        100, 0,
        N'Đại Học Bách Khoa TP.HCM', N'Khoa Khoa học & Kỹ thuật Máy tính', N'Cấu trúc dữ liệu và Giải thuật',
        N'https://covers.openlibrary.org/b/isbn/9780262033848-L.jpg'
    UNION ALL
    SELECT 6, N'Vật lý đại cương A1', N'TS. Lê Công C',
        N'Physics', N'Sách cứng', N'Theo kỳ',
        110000, 220000, N'-50%', NULL,
        N'Vietnamese', 780, N'NXB Giáo dục Việt Nam',
        2022, N'978-8016548392',
        4.4, 89,
        90, 0,
        N'Đại Học Bách Khoa TP.HCM', N'Khoa Khoa học Ứng dụng', N'Vật lý 1',
        N'https://covers.openlibrary.org/b/isbn/9781305952195-L.jpg'
    UNION ALL
    SELECT 7, N'Linear Algebra and Its Applications', N'David C. Lay',
        N'Mathematics', N'Sách cứng', N'Theo kỳ',
        195000, 250000, N'-50%', NULL,
        N'English', 560, N'Pearson',
        2023, N'978-0136871591',
        4.7, 143,
        92, 0,
        N'ĐH Khoa học Tự nhiên', N'Khoa Toán - Tin học', N'Đại số tuyến tính',
        N'https://covers.openlibrary.org/b/isbn/9780321982384-L.jpg'
    UNION ALL
    SELECT 8, N'Sinh học phân tử', N'James D. Watson',
        N'Biology', N'E-book', N'Dài hạn',
        240000, 480000, N'-50%', NULL,
        N'English', 950, N'Garland Science',
        2023, N'978-0815345176',
        4.8, 178,
        100, 0,
        N'ĐH Y Dược TP.HCM', N'Khoa Y', N'Sinh học đại cương',
        N'https://covers.openlibrary.org/b/isbn/9780321762436-L.jpg'
    UNION ALL
    SELECT 9, N'Tiếng Anh giao tiếp cơ bản', N'Oxford English',
        N'Language', N'Sách cứng', N'Theo kỳ',
        85000, 170000, N'-50%', 85000,
        N'English', 320, N'Oxford',
        2021, N'978-0194579858',
        4.5, 203,
        80, 1,
        N'ĐH Sư phạm TP.HCM', N'Khoa Tiếng Anh', N'Anh văn cơ bản',
        N'https://covers.openlibrary.org/b/isbn/9780194579858-L.jpg'
    UNION ALL
    SELECT 10, N'Lịch sử Việt Nam hiện đại', N'TS. Trần Văn Giàu',
        N'History', N'Sách cứng', N'Dài hạn',
        65000, 130000, N'-50%', NULL,
        N'Vietnamese', 540, N'NXB Lịch sử',
        2020, N'978-0313341960',
        4.3, 66,
        88, 0,
        N'ĐH KHXH & Nhân văn', N'Khoa Lịch sử', N'Lịch sử Việt Nam',
        N'https://covers.openlibrary.org/b/isbn/9780313341960-L.jpg'
    UNION ALL
    SELECT 11, N'Data Science Handbook', N'Jake VanderPlas',
        N'Computer Science', N'E-book', N'Dài hạn',
        210000, 420000, N'-50%', NULL,
        N'English', 548, N'O''Reilly',
        2016, N'978-1491912058',
        4.6, 120,
        100, 0,
        N'ĐH Công nghệ Thông tin', N'Khoa Khoa học Dữ liệu', N'Nhập môn Khoa học Dữ liệu',
        N'https://covers.openlibrary.org/b/isbn/9781491912058-L.jpg'
    UNION ALL
    SELECT 12, N'Quản trị Kinh doanh', N'Stephen P. Robbins',
        N'Business', N'Sách cứng', N'Theo kỳ',
        175000, 350000, N'-50%', 175000,
        N'English', 720, N'Pearson',
        2019, N'978-0133910292',
        4.4, 80,
        90, 1,
        N'ĐH Kinh tế TP.HCM', N'Khoa Quản trị', N'Quản trị kinh doanh',
        N'https://covers.openlibrary.org/b/isbn/9780133910292-L.jpg'
    UNION ALL
    SELECT 13, N'Hóa học hữu cơ nâng cao', N'Jonathan Clayden',
        N'Chemistry', N'E-book', N'Theo kỳ',
        245000, 490000, N'-50%', NULL,
        N'English', 1240, N'Oxford',
        2021, N'978-0199270293',
        4.5, 70,
        100, 0,
        N'Đại Học Bách Khoa TP.HCM', N'Khoa Kỹ thuật Hóa học', N'Hóa hữu cơ',
        N'https://covers.openlibrary.org/b/isbn/9780199270293-L.jpg'
    UNION ALL
    SELECT 14, N'Tâm lý học nhân cách', N'Carl Rogers',
        N'Psychology', N'Sách cứng', N'Theo kỳ',
        120000, 240000, N'-50%', 120000,
        N'Vietnamese', 480, N'NXB Tâm lý',
        2018, N'978-0395755310',
        4.1, 55,
        85, 1,
        N'ĐH KHXH & Nhân văn', N'Khoa Tâm lý học', N'Tâm lý học đại cương',
        N'https://covers.openlibrary.org/b/isbn/9780395755310-L.jpg'
    UNION ALL
    SELECT 15, N'Cơ học chất lỏng', N'Frank M. White',
        N'Physics', N'Sách cứng', N'Theo kỳ',
        200000, 400000, N'-50%', NULL,
        N'English', 880, N'McGraw-Hill',
        2016, N'978-0073398273',
        4.2, 60,
        93, 0,
        N'Đại Học Bách Khoa TP.HCM', N'Khoa Kỹ thuật Giao thông', N'Cơ học chất lỏng',
        N'https://covers.openlibrary.org/b/isbn/9780073398273-L.jpg'
    UNION ALL
    SELECT 16, N'Lập trình Web với React', N'Kyle Simpson',
        N'Computer Science', N'E-book', N'Dài hạn',
        185000, 370000, N'-50%', NULL,
        N'English', 520, N'O''Reilly',
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

-- 4. Reviews
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
