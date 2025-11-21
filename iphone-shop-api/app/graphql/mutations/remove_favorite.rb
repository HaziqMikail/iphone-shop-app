module Mutations
  class RemoveFavorite < BaseMutation
    field :success, Boolean, null: false
    field :errors, [String], null: false

    argument :product_id, ID, required: true
    argument :user_id, String, required: true

    def resolve(product_id:, user_id:)
      favorite = Favorite.find_by(product_id: product_id, user_id: user_id)
      
      return { success: false, errors: ['Favorite not found'] } unless favorite
      
      if favorite.destroy
        { success: true, errors: [] }
      else
        { success: false, errors: favorite.errors.full_messages }
      end
    end
  end
end