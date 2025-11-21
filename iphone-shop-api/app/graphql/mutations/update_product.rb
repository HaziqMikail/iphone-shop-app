module Mutations
  class UpdateProduct < BaseMutation
    field :product, Types::ProductType, null: true
    field :errors, [String], null: false

    argument :id, ID, required: true
    argument :name, String, required: false
    argument :description, String, required: false
    argument :price, Float, required: false
    argument :model, String, required: false
    argument :color, String, required: false
    argument :storage, String, required: false
    argument :category, String, required: false
    argument :stock, Integer, required: false

    def resolve(id:, **attributes)
      product = Product.find_by(id: id)
      
      return { product: nil, errors: ['Product not found'] } unless product
      
      if product.update(attributes)
        { product: product, errors: [] }
      else
        { product: nil, errors: product.errors.full_messages }
      end
    end
  end
end