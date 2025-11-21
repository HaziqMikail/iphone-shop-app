# frozen_string_literal: true

module Types
  class MutationType < Types::BaseObject
    field :create_product, mutation: Mutations::CreateProduct
    field :update_product, mutation: Mutations::UpdateProduct
    field :delete_product, mutation: Mutations::DeleteProduct
    field :add_favorite, mutation: Mutations::AddFavorite
    field :remove_favorite, mutation: Mutations::RemoveFavorite
  end
end
