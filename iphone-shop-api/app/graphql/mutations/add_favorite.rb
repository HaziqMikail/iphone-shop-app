module Mutations
  class AddFavorite < BaseMutation
    field :favorite, Types::FavoriteType, null: true
    field :errors, [String], null: false

    argument :product_id, ID, required: true
    argument :user_id, String, required: true

    def resolve(product_id:, user_id:)
      favorite = Favorite.new(product_id: product_id, user_id: user_id)
      
      if favorite.save
        { favorite: favorite, errors: [] }
      else
        { favorite: nil, errors: favorite.errors.full_messages }
      end
    end
  end
end