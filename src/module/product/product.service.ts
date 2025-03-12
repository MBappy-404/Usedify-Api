import AppError from '../../errors/AppError'
import QueryFilter from '../../queryFilter/queryFilter'
import { sendImageToCloudinary } from '../../utils/hostImage'
import { User } from '../User/user.model'
import { IProduct } from './product.interface'
import Product from './product.model'

// Create a new product
const createProduct = async (file: { path: string } | undefined, payload: IProduct) => {
  const user = await User.findById(payload.userId)
  if (!user) {
    throw new AppError(
      404,
      'User not found',
      'User does not exist in our records'
    )
  }

  const isUserBlocked = user.status === 'deactive'

  if (isUserBlocked) {
    throw new AppError(
      401,
      'Unauthorized',
      'User is banned! Cannot create item. Please contact the admin.'
    )
  }

  if (file) {
    const imageName = `product_${payload.price}${payload?.name}`
    const path = file?.path
    // console.log(imageName, path);

    const { secure_url } = await sendImageToCloudinary(imageName, path)
    payload.image = secure_url as string
  }

  const data = new Product(payload)
  const result = await data.save()

  return result
}

// Get all products
const getAllProducts = async (query: Record<string, unknown>) => {
  // const result = await Product.find()
  // return result

  const productQuery = new QueryFilter(Product.find().populate('userId'), query)
    .search(['name', 'brand', 'category', 'condition', 'location'])
    .filter()

  const result = await productQuery.modelQuery
  return result
}

// Get a single product by ID
const getSingleProduct = async (productId: string) => {
  const result = await Product.findOne({ _id: productId })
  return result
}

// Update a product by ID
const updateProduct = async (
  id: string,
  file: { path: string } | undefined,
  payload: Partial<IProduct>
) => {
  if (file) {
    const imageName = `product_${payload.price}${payload?.name}`
    const path = file?.path
    // console.log(imageName, path);

    const { secure_url } = await sendImageToCloudinary(imageName, path)
    payload.image = secure_url as string
  }

  const result = await Product.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })

  return result
}

// Delete a product by ID
const deleteProduct = async (productId: string) => {
  const result = await Product.deleteOne({ _id: productId })
  return result
}

export const ProductService = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
}
