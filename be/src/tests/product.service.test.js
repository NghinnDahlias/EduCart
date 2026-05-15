const ProductService = require('../services/product.service');

describe('ProductService', () => {
  let repo;
  let svc;

  beforeEach(() => {
    repo = { create: jest.fn(), findById: jest.fn() };
    svc = new ProductService({ productRepository: repo });
  });

  it('rejects > 5 images', async () => {
    await expect(
      svc.createProduct({
        sellerId: 1,
        dto: {
          universityId: 1, facultyId: 1, subjectId: 1,
          title: 'Book', price: 100, isForRent: false,
        },
        imageUrls: ['a', 'b', 'c', 'd', 'e', 'f'],
      }),
    ).rejects.toMatchObject({ statusCode: 400 });
    expect(repo.create).not.toHaveBeenCalled();
  });

  it('passes images through to the repository', async () => {
    repo.create.mockResolvedValue({ ProductID: 7 });
    await svc.createProduct({
      sellerId: 1,
      dto: { universityId: 1, facultyId: 1, subjectId: 1, title: 'Book', price: 100, isForRent: true, stock: 1 },
      imageUrls: ['/uploads/x.jpg'],
    });
    expect(repo.create).toHaveBeenCalledWith(
      expect.objectContaining({ images: ['/uploads/x.jpg'], isForRent: true }),
    );
  });

  it('throws 404 when product is missing', async () => {
    repo.findById.mockResolvedValue(null);
    await expect(svc.getById(123)).rejects.toMatchObject({ statusCode: 404 });
  });
});
