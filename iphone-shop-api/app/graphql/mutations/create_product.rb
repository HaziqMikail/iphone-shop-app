module Mutations
  class CreateProduct < BaseMutation
    field :product, Types::ProductType, null: true
    field :errors, [String], null: false

    argument :name, String, required: true
    argument :description, String, required: false
    argument :price, Float, required: true
    argument :model, String, required: false
    argument :color, String, required: false
    argument :storage, String, required: false
    argument :category, String, required: true
    argument :stock, Integer, required: false

    def resolve(**attributes)
      product = Product.new(attributes) # Creates a new Product using the input values
      
      if product.save
        { product: product, errors: [] } # Return the created product and no errors
      else
        { product: nil, errors: product.errors.full_messages } # Return no product and the error messages
      end
    end
  end
end