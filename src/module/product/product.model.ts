import { model, Schema } from 'mongoose'

// product schema
const productSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true, // Ensure every order is linked to a user
    },
    name: {
      type: String,
      required: [true, 'Product name is required.'],
    },
    image: {
      type: String,
      required: [true, 'Image is required.'],
    },
   
    condition: {
      type: String,
      required: [true, 'Condition is required.'],
      enum: {
        values: [
          'Brand New',
          'Like New',
          'Good',
          'Well Used',
          'For Parts or Repair',
        ],
        message: '{VALUE} is not a valid condition.',
      },
    },
    price: {
      type: Number,
      required: [true, 'Price is required.'],
      min: [1, 'Price must be at least 1.'],
    },

    category: {
      type: String,
      required: true,
      enum: {
        values: [
          'Electronics',
          'Furniture',
          'Books & Stationery',
          'Toys & Games',
          'Home Decor',
          'Sports Equipment',
          'Tools & Equipment',
          'Musical Instruments',
          'Health & Fitness',
          'Collectibles & Art',
          'Uncategorized',
        ],

        message: '{VALUE} is not a valid category.',
      },
    },
    description: {
      type: String,
      required: [true, 'Description is required.'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ['available', 'sold'],
      },
      default: 'available',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
)

const Product = model('Product', productSchema)

export default Product
