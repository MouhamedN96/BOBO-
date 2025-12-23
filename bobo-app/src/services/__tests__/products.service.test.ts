/**
 * Products Service Tests
 * Testing CRUD operations, SKU generation, search, and upvote functionality
 */

import { ProductsService } from '../products.service'
import { pb } from '../../lib/pocketbase'
import { generateSKU } from '../../utils/validation'

// Mock PocketBase
jest.mock('../../lib/pocketbase', () => ({
  pb: {
    collection: jest.fn(),
  },
}))

// Mock validation utilities
jest.mock('../../utils/validation', () => ({
  validateProductTitle: jest.fn(() => ({ valid: true })),
  validatePrice: jest.fn(() => ({ valid: true })),
  validateStockQuantity: jest.fn(() => ({ valid: true })),
  validateSKU: jest.fn(() => ({ valid: true })),
  generateSKU: jest.fn(() => 'BOBO-TEST-ABC1'),
}))

describe('ProductsService', () => {
  let service: ProductsService
  let mockCollection: jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    service = new ProductsService()
    mockCollection = pb.collection as jest.Mock
  })

  describe('getAll', () => {
    it('should retrieve all active products with pagination', async () => {
      const mockProducts = [
        {
          id: 'prod1',
          title: 'Product 1',
          price: 1000,
          is_active: true,
          stock_quantity: 10,
        },
        {
          id: 'prod2',
          title: 'Product 2',
          price: 2000,
          is_active: true,
          stock_quantity: 5,
        },
      ]

      mockCollection.mockReturnValue({
        getList: jest.fn().mockResolvedValue({
          items: mockProducts,
          totalItems: 2,
          totalPages: 1,
        }),
      })

      const result = await service.getAll(1, 20)

      expect(result.items).toHaveLength(2)
      expect(result.totalItems).toBe(2)
      expect(result.totalPages).toBe(1)
      expect(mockCollection).toHaveBeenCalledWith('products')
    })

    it('should handle pagination parameters', async () => {
      mockCollection.mockReturnValue({
        getList: jest.fn().mockResolvedValue({
          items: [],
          totalItems: 100,
          totalPages: 5,
        }),
      })

      await service.getAll(2, 20)

      const callArgs = mockCollection().getList.mock.calls[0]
      expect(callArgs[0]).toBe(2) // page
      expect(callArgs[1]).toBe(20) // limit
    })

    it('should return empty array on error', async () => {
      mockCollection.mockReturnValue({
        getList: jest.fn().mockRejectedValue(new Error('Network error')),
      })

      const result = await service.getAll()

      expect(result.items).toEqual([])
      expect(result.totalItems).toBe(0)
      expect(result.totalPages).toBe(0)
    })
  })

  describe('getBySeller', () => {
    it('should retrieve products for specific seller', async () => {
      const sellerId = 'seller123'
      const mockProducts = [
        { id: 'prod1', seller_id: sellerId, title: 'Seller Product' },
      ]

      mockCollection.mockReturnValue({
        getList: jest.fn().mockResolvedValue({
          items: mockProducts,
          totalItems: 1,
          totalPages: 1,
        }),
      })

      const result = await service.getBySeller(sellerId)

      expect(result.items).toHaveLength(1)
      expect(result.items[0].seller_id).toBe(sellerId)
    })

    it('should filter by seller_id correctly', async () => {
      const sellerId = 'seller456'
      mockCollection.mockReturnValue({
        getList: jest.fn().mockResolvedValue({
          items: [],
          totalItems: 0,
          totalPages: 0,
        }),
      })

      await service.getBySeller(sellerId)

      const filterArg = mockCollection().getList.mock.calls[0][2]
      expect(filterArg.filter).toContain(sellerId)
    })
  })

  describe('getById', () => {
    it('should retrieve product by ID', async () => {
      const mockProduct = {
        id: 'prod123',
        title: 'Test Product',
        price: 5000,
        expand: { seller_id: { username: 'seller' } },
      }

      mockCollection.mockReturnValue({
        getOne: jest.fn().mockResolvedValue(mockProduct),
      })

      const result = await service.getById('prod123')

      expect(result).toEqual(mockProduct)
      expect(mockCollection).toHaveBeenCalledWith('products')
    })

    it('should return null on error', async () => {
      mockCollection.mockReturnValue({
        getOne: jest.fn().mockRejectedValue(new Error('Product not found')),
      })

      const result = await service.getById('invalid')

      expect(result).toBeNull()
    })

    it('should include seller expansion', async () => {
      mockCollection.mockReturnValue({
        getOne: jest.fn().mockResolvedValue({}),
      })

      await service.getById('prod123')

      const expandArg = mockCollection().getOne.mock.calls[0][1]
      expect(expandArg.expand).toBe('seller_id')
    })
  })

  describe('search', () => {
    it('should search products by title and description', async () => {
      const mockProducts = [
        { id: 'prod1', title: 'Red Dress', description: 'Beautiful red dress' },
      ]

      mockCollection.mockReturnValue({
        getList: jest.fn().mockResolvedValue({
          items: mockProducts,
          totalItems: 1,
          totalPages: 1,
        }),
      })

      const result = await service.search('red', 1, 20)

      expect(result.items).toHaveLength(1)
      expect(result.totalItems).toBe(1)
    })

    it('should include search query in filter', async () => {
      mockCollection.mockReturnValue({
        getList: jest.fn().mockResolvedValue({
          items: [],
          totalItems: 0,
          totalPages: 0,
        }),
      })

      await service.search('test query')

      const filterArg = mockCollection().getList.mock.calls[0][2]
      expect(filterArg.filter).toContain('test query')
    })

    it('should return empty on search error', async () => {
      mockCollection.mockReturnValue({
        getList: jest.fn().mockRejectedValue(new Error('Search failed')),
      })

      const result = await service.search('test')

      expect(result.items).toEqual([])
      expect(result.totalItems).toBe(0)
    })
  })

  describe('create', () => {
    it('should create product with valid data', async () => {
      const mockProduct = {
        id: 'prod123',
        title: 'New Product',
        price: 5000,
        sku: 'BOBO-TEST-ABC1',
      }

      mockCollection.mockReturnValue({
        create: jest.fn().mockResolvedValue(mockProduct),
      })

      const result = await service.create('seller123', {
        title: 'New Product',
        price: 5000,
        stock_quantity: 10,
        category: 'fashion',
        image_uri: 'file:///image.jpg',
      })

      expect(result.success).toBe(true)
      expect(result.product?.id).toBe('prod123')
    })

    it('should generate unique SKU', async () => {
      mockCollection.mockReturnValue({
        create: jest.fn().mockResolvedValue({ id: 'prod123' }),
      })

      await service.create('seller123', {
        title: 'Product',
        price: 1000,
        stock_quantity: 5,
        category: 'electronics',
        image_uri: 'file:///image.jpg',
      })

      expect(generateSKU).toHaveBeenCalledWith('BOBO')
    })

    it('should include optional video upload', async () => {
      mockCollection.mockReturnValue({
        create: jest.fn().mockResolvedValue({ id: 'prod123' }),
      })

      const result = await service.create('seller123', {
        title: 'Video Product',
        price: 5000,
        stock_quantity: 5,
        category: 'fashion',
        image_uri: 'file:///image.jpg',
        video_uri: 'file:///video.mp4',
      })

      expect(result.success).toBe(true)
    })

    it('should handle validation error on invalid title', async () => {
      const mockValidateProductTitle = require('../../utils/validation')
        .validateProductTitle as jest.Mock
      mockValidateProductTitle.mockReturnValue({
        valid: false,
        error: 'Title too short',
      })

      const result = await service.create('seller123', {
        title: 'x',
        price: 5000,
        stock_quantity: 5,
        category: 'fashion',
        image_uri: 'file:///image.jpg',
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain('Title')
    })

    it('should handle validation error on invalid price', async () => {
      const mockValidatePrice = require('../../utils/validation')
        .validatePrice as jest.Mock
      const mockValidateProductTitle = require('../../utils/validation')
        .validateProductTitle as jest.Mock

      mockValidateProductTitle.mockReturnValue({ valid: true })
      mockValidatePrice.mockReturnValue({
        valid: false,
        error: 'Price must be positive',
      })

      const result = await service.create('seller123', {
        title: 'Product',
        price: -100,
        stock_quantity: 5,
        category: 'fashion',
        image_uri: 'file:///image.jpg',
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain('Price')
    })

    it('should require product image', async () => {
      const mockValidateProductTitle = require('../../utils/validation')
        .validateProductTitle as jest.Mock
      const mockValidatePrice = require('../../utils/validation')
        .validatePrice as jest.Mock
      const mockValidateStockQuantity = require('../../utils/validation')
        .validateStockQuantity as jest.Mock

      mockValidateProductTitle.mockReturnValue({ valid: true })
      mockValidatePrice.mockReturnValue({ valid: true })
      mockValidateStockQuantity.mockReturnValue({ valid: true })

      const result = await service.create('seller123', {
        title: 'Product',
        price: 5000,
        stock_quantity: 5,
        category: 'fashion',
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain('image')
    })

    it('should handle creation errors', async () => {
      mockCollection.mockReturnValue({
        create: jest.fn().mockRejectedValue(new Error('Network error')),
      })

      const result = await service.create('seller123', {
        title: 'Product',
        price: 5000,
        stock_quantity: 5,
        category: 'fashion',
        image_uri: 'file:///image.jpg',
      })

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('update', () => {
    it('should update product with valid data', async () => {
      const mockValidateProductTitle = require('../../utils/validation')
        .validateProductTitle as jest.Mock
      const mockValidatePrice = require('../../utils/validation')
        .validatePrice as jest.Mock

      mockValidateProductTitle.mockReturnValue({ valid: true })
      mockValidatePrice.mockReturnValue({ valid: true })

      const mockProduct = {
        id: 'prod123',
        title: 'Updated Product',
        price: 6000,
      }

      mockCollection.mockReturnValue({
        update: jest.fn().mockResolvedValue(mockProduct),
      })

      const result = await service.update('prod123', {
        title: 'Updated Product',
        price: 6000,
      })

      expect(result.success).toBe(true)
      expect(result.product?.title).toBe('Updated Product')
    })

    it('should validate fields before updating', async () => {
      const mockValidatePrice = require('../../utils/validation')
        .validatePrice as jest.Mock
      mockValidatePrice.mockReturnValue({
        valid: false,
        error: 'Invalid price',
      })

      const result = await service.update('prod123', {
        price: -500,
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain('price')
    })

    it('should handle partial updates', async () => {
      mockCollection.mockReturnValue({
        update: jest.fn().mockResolvedValue({ id: 'prod123' }),
      })

      await service.update('prod123', {
        title: 'New Title',
      })

      expect(mockCollection().update).toHaveBeenCalled()
    })
  })

  describe('delete', () => {
    it('should soft delete product', async () => {
      mockCollection.mockReturnValue({
        update: jest.fn().mockResolvedValue({ id: 'prod123', is_active: false }),
      })

      const result = await service.delete('prod123')

      expect(result.success).toBe(true)
      expect(mockCollection().update).toHaveBeenCalledWith('prod123', {
        is_active: false,
      })
    })

    it('should handle delete errors', async () => {
      mockCollection.mockReturnValue({
        update: jest.fn().mockRejectedValue(new Error('Delete failed')),
      })

      const result = await service.delete('prod123')

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('incrementViews', () => {
    it('should increment view count', async () => {
      mockCollection.mockReturnValue({
        getOne: jest.fn().mockResolvedValue({ id: 'prod123', view_count: 5 }),
        update: jest.fn().mockResolvedValue({ view_count: 6 }),
      })

      await service.incrementViews('prod123')

      expect(mockCollection().update).toHaveBeenCalledWith('prod123', {
        view_count: 6,
      })
    })

    it('should initialize view count to 1 if not exists', async () => {
      mockCollection.mockReturnValue({
        getOne: jest.fn().mockResolvedValue({ id: 'prod123' }),
        update: jest.fn().mockResolvedValue({ view_count: 1 }),
      })

      await service.incrementViews('prod123')

      expect(mockCollection().update).toHaveBeenCalledWith('prod123', {
        view_count: 1,
      })
    })
  })

  describe('toggleUpvote', () => {
    it('should add upvote if not already upvoted', async () => {
      const userId = 'user123'
      const productId = 'prod123'
      const upvotesCollection = {
        getFullList: jest.fn().mockResolvedValue([]),
        create: jest.fn().mockResolvedValue({ id: 'upvote123' }),
        delete: jest.fn(),
      }
      const productsCollection = {
        getOne: jest.fn().mockResolvedValue({ id: productId, upvotes: 5 }),
        update: jest.fn().mockResolvedValue({ upvotes: 6 }),
      }

      mockCollection.mockImplementation((collection) => {
        if (collection === 'upvotes') return upvotesCollection
        if (collection === 'products') return productsCollection
      })

      const result = await service.toggleUpvote(productId, userId)

      expect(result).toBe(true)
      expect(upvotesCollection.create).toHaveBeenCalled()
      expect(productsCollection.update).toHaveBeenCalled()
    })

    it('should remove upvote if already upvoted', async () => {
      const userId = 'user123'
      const productId = 'prod123'
      const upvotesCollection = {
        getFullList: jest
          .fn()
          .mockResolvedValue([{ id: 'upvote123', user_id: userId }]),
        delete: jest.fn().mockResolvedValue({}),
        create: jest.fn(),
      }
      const productsCollection = {
        getOne: jest.fn().mockResolvedValue({ id: productId, upvotes: 5 }),
        update: jest.fn().mockResolvedValue({ upvotes: 4 }),
      }

      mockCollection.mockImplementation((collection) => {
        if (collection === 'upvotes') return upvotesCollection
        if (collection === 'products') return productsCollection
      })

      const result = await service.toggleUpvote(productId, userId)

      expect(result).toBe(false)
      expect(upvotesCollection.delete).toHaveBeenCalled()
    })

    it('should prevent upvotes from going negative', async () => {
      const userId = 'user123'
      const productId = 'prod123'
      const upvotesCollection = {
        getFullList: jest
          .fn()
          .mockResolvedValue([{ id: 'upvote123', user_id: userId }]),
        delete: jest.fn().mockResolvedValue({}),
        create: jest.fn(),
      }
      const productsCollection = {
        getOne: jest.fn().mockResolvedValue({ id: productId, upvotes: 0 }),
        update: jest.fn().mockResolvedValue({ upvotes: 0 }),
      }

      mockCollection.mockImplementation((collection) => {
        if (collection === 'upvotes') return upvotesCollection
        if (collection === 'products') return productsCollection
      })

      await service.toggleUpvote(productId, userId)

      expect(productsCollection.update).toHaveBeenCalledWith(productId, {
        upvotes: 0,
      })
    })

    it('should handle upvote errors gracefully', async () => {
      mockCollection.mockImplementation((collection) => {
        if (collection === 'upvotes') {
          return {
            getFullList: jest
              .fn()
              .mockRejectedValue(new Error('Network error')),
          }
        }
        return {
          getOne: jest.fn().mockResolvedValue({ id: 'prod123', upvotes: 0 }),
          update: jest.fn().mockResolvedValue({}),
        }
      })

      const result = await service.toggleUpvote('prod123', 'user123')

      expect(result).toBe(false)
    })
  })
})
